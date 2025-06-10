import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import { saveAs } from 'file-saver';
import { API_CONFIG } from '../config';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { jsPDF } from 'jspdf';
import imageTranslator from './imageTranslator';

// Güvenilir kütüphane yolu belirleme (tarayıcı ortamı için)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Desteklenen dosya türleri
export const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/vnd.ms-powerpoint' // .ppt
];

// PDF dosyasından metin çıkarma (tarayıcı uyumlu)
const extractTextFromPdf = async (arrayBuffer) => {
  try {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    
    // Tüm sayfaları işle
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      
      // Metin içeriğini birleştir
      const pageText = content.items
        .map(item => item.str)
        .join(' ');
      
      text += pageText + '\n';
    }
    
    return text;
  } catch (error) {
    console.error('PDF metin çıkarma hatası:', error);
    throw new Error('PDF dosyasından metin çıkarılamadı');
  }
};

// Büyük PDF dosyasından metin çıkarma (sayfa bazlı)
const extractTextFromPdfByPages = async (arrayBuffer) => {
  try {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pageCount = pdf.numPages;
    const pages = [];
    
    // Tüm sayfaları işle ve sayfa bazlı metin dizisi oluştur
    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      
      // Sayfa metnini oluştur
      const pageText = content.items
        .map(item => item.str)
        .join(' ');
      
      pages.push(pageText);
    }
    
    return { pages, pageCount };
  } catch (error) {
    console.error('PDF sayfa bazlı metin çıkarma hatası:', error);
    throw new Error('PDF dosyasından metin çıkarılamadı');
  }
};

// HTML içeriğinden tablo yapısını koruyarak çeviri yapma
export const translateHtmlContent = async (html, sourceLang, targetLang) => {
  try {
    // HTML'de tablo var mı kontrol et
    const hasTable = /<table[^>]*>[\s\S]*?<\/table>/i.test(html);
    
    if (hasTable) {
      // Tablolar varsa, tablo yapısını koruyarak çeviri yap
      return await translateWithTablePreservation(html, sourceLang, targetLang);
    } else {
      // Tablo yoksa normal metin olarak çevir
      // Basit HTML temizleme işlemi yaparak çevrilecek düz metni çıkar
      const plainText = html.replace(/<[^>]*>/g, ' ')
                            .replace(/\s+/g, ' ')
                            .trim();
      
      // Metni çevir
      const result = await translateChunk(plainText, sourceLang, targetLang);
      return result;
    }
  } catch (error) {
    console.error('HTML çeviri hatası:', error);
    return html; // Hata durumunda orijinal HTML'i döndür
  }
};

// Tablo yapısını koruyarak HTML çevirme
const translateWithTablePreservation = async (html, sourceLang, targetLang) => {
  try {
    // Tabloları bul ve işaretle
    const tablePattern = /(<table[^>]*>[\s\S]*?<\/table>)/gi;
    const markedHtml = html.replace(tablePattern, '<!--TABLE_MARKER-->$1<!--/TABLE_MARKER-->');
    
    // Parçalara ayır
    const parts = markedHtml.split(/(<!--TABLE_MARKER-->[\s\S]*?<!--\/TABLE_MARKER-->)/g);
    
    // Her bir parçayı ayrı ayrı çevir
    const translatedParts = await Promise.all(parts.map(async part => {
      if (part.startsWith('<!--TABLE_MARKER-->')) {
        // Tablo içeriğini çıkar
        const tableContent = part.replace(/<!--TABLE_MARKER-->([\s\S]*?)<!--\/TABLE_MARKER-->/g, '$1');
        // Tablo hücrelerinin içeriğini çevir ama tablo yapısını koru
        return await translateTableContent(tableContent, sourceLang, targetLang);
      } else {
        // Normal metin - temizleyip düz çeviri yap
        const plainText = part.replace(/<[^>]*>/g, ' ')
                              .replace(/\s+/g, ' ')
                              .trim();
        if (plainText.length > 0) {
          return await translateChunk(plainText, sourceLang, targetLang);
        }
        return part; // Boş parçaları olduğu gibi bırak
      }
    }));
    
    return translatedParts.join('');
  } catch (error) {
    console.error('Tablo korumalı çeviri hatası:', error);
    return html; // Hata durumunda orijinal HTML'i döndür
  }
};

// Tablo içeriğini çevirme
const translateTableContent = async (tableHtml, sourceLang, targetLang) => {
  try {
    // Hücre içeriklerini bul ve çevir
    const cellPattern = /<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi;
    
    // Her hücreyi işle
    return tableHtml.replace(cellPattern, async (match, cellContent) => {
      // Hücre içeriğinden HTML etiketlerini temizle
      const plainText = cellContent.replace(/<[^>]*>/g, ' ')
                                   .replace(/\s+/g, ' ')
                                   .trim();
      
      if (plainText.length > 0) {
        // Hücre içeriğini çevir
        const translatedContent = await translateChunk(plainText, sourceLang, targetLang);
        // Orijinal eşleşmeyi, çevrilmiş içerikle değiştir
        return match.replace(cellContent, translatedContent);
      }
      
      return match; // Boş hücreleri olduğu gibi bırak
    });
  } catch (error) {
    console.error('Tablo içeriği çevirme hatası:', error);
    return tableHtml; // Hata durumunda orijinal tablo HTML'ini döndür
  }
};

// Dosya içeriğini çıkarma
export const extractTextFromFile = async (file) => {
  try {
    const fileType = file.type;
    let text = '';
    let isHtml = false;
    let htmlContent = '';

    if (fileType === 'application/pdf') {
      // PDF dosyasından metin çıkarma (tarayıcı uyumlu)
      const arrayBuffer = await file.arrayBuffer();
      text = await extractTextFromPdf(arrayBuffer);
    } 
    else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
             fileType === 'application/msword') {
      // Word dosyasından HTML çıkarma (tablo yapısını korumak için)
      const arrayBuffer = await file.arrayBuffer();
      
      // HTML olarak çıkar (tablo yapısını korur)
      const result = await mammoth.convertToHtml({ arrayBuffer });
      htmlContent = result.value;
      isHtml = true;
      
      // Yine de düz metin versiyonunu da al (geri uyumluluk için)
      const textResult = await mammoth.extractRawText({ arrayBuffer });
      text = textResult.value;
    }
    else if (fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || 
             fileType === 'application/vnd.ms-powerpoint') {
      // PowerPoint dosyasından metin çıkarma - basitleştirilmiş yaklaşım
      // Not: PPT dosyalarını tarayıcıda işlemek zordur, daha iyi bir çözüm gerekebilir
      try {
        const arrayBuffer = await file.arrayBuffer();
        const decoder = new TextDecoder('utf-8');
        const fileText = decoder.decode(new Uint8Array(arrayBuffer));
        
        // XML formatındaki metin içeriğini basitçe ayıklama
        const matches = fileText.match(/<a:t>([^<]+)<\/a:t>/g) || [];
        text = matches.map(m => m.replace(/<a:t>|<\/a:t>/g, '')).join('\n');
        
        if (!text) {
          text = "PowerPoint dosyasından metin çıkarılamadı. Lütfen metin kopyalayıp yapıştırın.";
        }
      } catch (e) {
        console.error('PowerPoint işleme hatası:', e);
        text = "PowerPoint dosyasını işlerken hata oluştu. Lütfen metin kopyalayıp yapıştırın.";
      }
    }

    // HTML içerik varsa, ek bilgileri de döndür
    return {
      text,
      isHtml,
      htmlContent
    };
  } catch (error) {
    console.error('Dosya işleme hatası:', error);
    throw new Error('Dosya içeriği okunamadı. Lütfen başka bir dosya deneyin.');
  }
};

// Büyük dokümanları parçalara ayırıp işleme (100+ sayfa)
export const processBigDocument = async (file, sourceLang, targetLang, progressCallback) => {
  try {
    const fileType = file.type;
    const arrayBuffer = await file.arrayBuffer();
    let pages = [];
    let pageCount = 0;
    let textChunks = [];
    let isHtml = false;
    let htmlContent = '';
    let translatedImages = [];

    // Dokümanı parçalara ayırma
    if (fileType === 'application/pdf') {
      // PDF'i sayfa bazlı işleme
      const result = await extractTextFromPdfByPages(arrayBuffer);
      pages = result.pages;
      pageCount = result.pageCount;
      
      // İlerleme durumunu bildir
      progressCallback({ stage: 'extraction', progress: 100, pageCount });
      
      // Sayfaları makul parçalara ayır (her 3 sayfa bir parça - büyük dokümanlarda daha küçük parçalar daha iyi)
      const PAGES_PER_CHUNK = 3; // Daha küçük parçalar (5 yerine 3)
      for (let i = 0; i < pages.length; i += PAGES_PER_CHUNK) {
        const chunk = pages.slice(i, i + PAGES_PER_CHUNK).join('\n\n');
        if (chunk.trim()) textChunks.push(chunk);
      }
      
      // PDF'deki grafikleri çıkar
      progressCallback({ stage: 'images', progress: 0, message: 'Grafikler çıkarılıyor...' });
      
      try {
        const { images } = await extractImagesFromDocument(arrayBuffer, fileType);
        
        progressCallback({ 
          stage: 'images', 
          progress: 100, 
          message: `${images.length} grafik bulundu.`
        });
        
        if (images.length > 0) {
          // Grafikleri çevir
          progressCallback({ 
            stage: 'image_translation', 
            progress: 0, 
            message: 'Grafikler çevriliyor...'
          });
          
          for (let i = 0; i < images.length; i++) {
            try {
              // İlerleme bildirimi
              progressCallback({ 
                stage: 'image_translation', 
                progress: Math.round((i / images.length) * 100),
                currentImage: i + 1,
                totalImages: images.length,
                message: `Grafik ${i + 1}/${images.length} çevriliyor`
              });
              
              // Resmi çevir
              const translationResult = await imageTranslator.translateImageText(
                images[i].data,
                sourceLang,
                targetLang
              );
              
              // Çevrilen metni resme uygula
              if (translationResult.translatedText) {
                const renderedImage = await imageTranslator.renderTranslatedImage(
                  images[i].data,
                  translationResult
                );
                
                translatedImages.push({
                  original: images[i],
                  translated: {
                    data: renderedImage,
                    contentType: images[i].contentType,
                    altText: images[i].altText,
                    originalText: translationResult.originalText,
                    translatedText: translationResult.translatedText
                  }
                });
              } else {
                // Metin bulunamazsa orijinal resmi ekle
                translatedImages.push({
                  original: images[i],
                  translated: null
                });
              }
            } catch (error) {
              console.error(`Resim ${i+1}/${images.length} çeviri hatası:`, error);
              // Hata durumunda orijinal resmi ekle
              translatedImages.push({
                original: images[i],
                translated: null,
                error: error.message
              });
            }
          }
          
          progressCallback({ 
            stage: 'image_translation', 
            progress: 100, 
            message: 'Grafik çevirisi tamamlandı.'
          });
        }
      } catch (imageError) {
        console.error('Grafik çıkarma hatası:', imageError);
        progressCallback({ 
          stage: 'images', 
          progress: 100, 
          message: 'Grafik çıkarılamadı: ' + imageError.message
        });
      }
    } 
    else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
             fileType === 'application/msword') {
      // Word dosyasını önce HTML olarak dönüştür (tablo yapısı için)
      const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
      htmlContent = htmlResult.value;
      isHtml = true;
      
      // Paragrafları da alalım (indirme ve standart çeviri için)
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;
      
      // Paragrafları makul parçalara ayır (3000 karakter, yaklaşık 1 sayfa)
      const paragraphs = text.split('\n').filter(p => p.trim());
      pageCount = Math.ceil(paragraphs.length / 20); // Yaklaşık olarak her 20 paragraf 1 sayfa
      
      // İlerleme durumunu bildir
      progressCallback({ stage: 'extraction', progress: 100, pageCount });
      
      // Paragrafları grupla (2000 karakter civarı - 3000 yerine daha küçük değer)
      const CHARS_PER_CHUNK = 2000; 
      let currentChunk = "";
      
      for (const paragraph of paragraphs) {
        if (currentChunk.length + paragraph.length > CHARS_PER_CHUNK) {
          textChunks.push(currentChunk);
          currentChunk = paragraph;
        } else {
          currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
        }
      }
      
      if (currentChunk) textChunks.push(currentChunk);
      
      // Word'deki grafikleri çıkar
      progressCallback({ stage: 'images', progress: 0, message: 'Grafikler çıkarılıyor...' });
      
      try {
        const { images } = await extractImagesFromDocument(arrayBuffer, fileType);
        
        progressCallback({ 
          stage: 'images', 
          progress: 100, 
          message: `${images.length} grafik bulundu.`
        });
        
        if (images.length > 0) {
          // Grafikleri çevir
          progressCallback({ 
            stage: 'image_translation', 
            progress: 0, 
            message: 'Grafikler çevriliyor...'
          });
          
          for (let i = 0; i < images.length; i++) {
            try {
              // İlerleme bildirimi
              progressCallback({ 
                stage: 'image_translation', 
                progress: Math.round((i / images.length) * 100),
                currentImage: i + 1,
                totalImages: images.length,
                message: `Grafik ${i + 1}/${images.length} çevriliyor`
              });
              
              // Resmi çevir
              const translationResult = await imageTranslator.translateImageText(
                images[i].data,
                sourceLang,
                targetLang
              );
              
              // Çevrilen metni resme uygula
              if (translationResult.translatedText) {
                const renderedImage = await imageTranslator.renderTranslatedImage(
                  images[i].data,
                  translationResult
                );
                
                translatedImages.push({
                  original: images[i],
                  translated: {
                    data: renderedImage,
                    contentType: images[i].contentType,
                    altText: images[i].altText,
                    originalText: translationResult.originalText,
                    translatedText: translationResult.translatedText
                  }
                });
              } else {
                // Metin bulunamazsa orijinal resmi ekle
                translatedImages.push({
                  original: images[i],
                  translated: null
                });
              }
            } catch (error) {
              console.error(`Resim ${i+1}/${images.length} çeviri hatası:`, error);
              // Hata durumunda orijinal resmi ekle
              translatedImages.push({
                original: images[i],
                translated: null,
                error: error.message
              });
            }
          }
          
          progressCallback({ 
            stage: 'image_translation', 
            progress: 100, 
            message: 'Grafik çevirisi tamamlandı.'
          });
        }
      } catch (imageError) {
        console.error('Grafik çıkarma hatası:', imageError);
        progressCallback({ 
          stage: 'images', 
          progress: 100, 
          message: 'Grafik çıkarılamadı: ' + imageError.message
        });
      }
    }
    else {
      throw new Error("Bu dosya türü büyük doküman işleme için desteklenmiyor.");
    }
    
    // Parçaların hiçbir içeriğe sahip olmaması durumunu kontrol et
    if (textChunks.length === 0) {
      console.warn("Dokümandan metin çıkarılamadı veya boş");
      progressCallback({ 
        stage: 'warning', 
        progress: 100,
        message: 'Belgeden çevrilecek metin çıkarılamadı'
      });
      
      // Basit bir içerik ekle
      textChunks.push("Belgeden metin çıkarılamadı. Lütfen belgenin korumalı olmadığından emin olun.");
    }
    
    // Tüm parçaları çevirme
    const totalChunks = textChunks.length;
    const translations = [];
    let translatedHtml = '';
    
    // Parçaları optimize et - cümle kırılmasını önlemek için
    const optimizedChunks = optimizeChunks(textChunks);
    
    console.log(`${textChunks.length} parça, optimizasyon sonrası ${optimizedChunks.length} parça`);
    
    // HTML içerik varsa ve tablolar içeriyorsa özel işlem yap
    if (isHtml && htmlContent) {
      progressCallback({ 
        stage: 'html_translation', 
        progress: 0, 
        message: 'HTML içeriği ve tablolar çevriliyor...' 
      });
      
      try {
        translatedHtml = await translateHtmlContent(htmlContent, sourceLang, targetLang);
        
        progressCallback({ 
          stage: 'html_translation', 
          progress: 100, 
          message: 'HTML ve tablo çevirisi tamamlandı' 
        });
      } catch (htmlError) {
        console.error('HTML çeviri hatası:', htmlError);
        progressCallback({ 
          stage: 'html_translation', 
          progress: 100, 
          message: 'HTML çevirisinde hata: ' + htmlError.message
        });
      }
    }
    
    // Normal metin parçalarını çevir
    for (let i = 0; i < optimizedChunks.length; i++) {
      try {
        // İlerleme durumunu bildir
        progressCallback({ 
          stage: 'translation', 
          progress: Math.round((i / optimizedChunks.length) * 100),
          currentChunk: i + 1,
          totalChunks: optimizedChunks.length
        });
        
        // API çağrısı başarısız olma ihtimaline karşı yeniden deneme mekanizması
        let retryCount = 0;
        let translationResult = null;
        
        while (retryCount < 3 && translationResult === null) {
          try {
            // Çeviri servisini çağır
            translationResult = await translateChunk(optimizedChunks[i], sourceLang, targetLang);
          } catch (retryError) {
            retryCount++;
            console.error(`Parça ${i+1}/${optimizedChunks.length} çeviri hatası (Deneme ${retryCount}/3):`, retryError);
            
            if (retryCount < 3) {
              // Biraz bekle ve tekrar dene
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            }
          }
        }
        
        if (translationResult) {
          translations.push(translationResult);
        } else {
          // Tüm denemeler başarısız olduysa, hata ile işaretle
          translations.push(`[Çeviri hatası: Bu bölüm çevirilemedi.]\n\n${optimizedChunks[i]}`);
        }
        
        // Her 5 parçada bir kısa bekleme (API sınırlamaları için)
        if (i % 5 === 4) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Parça ${i+1}/${optimizedChunks.length} çeviri hatası:`, error);
        // Hata durumunda bile devam et, hatayı not olarak ekle
        translations.push(`[Çeviri hatası: Bu bölüm çevirilemedi. Hata: ${error.message}]\n\n${optimizedChunks[i]}`);
      }
    }
    
    // Çevirilerin birleştirilmesi
    const mergedTranslation = translations.join('\n\n');
    
    // Tamamlandı bilgisi
    progressCallback({ 
      stage: 'complete', 
      progress: 100,
      translatedImages: translatedImages.length > 0,
      htmlTranslated: !!translatedHtml
    });
    
    // Sonuçları döndür
    return {
      text: mergedTranslation,
      htmlContent: translatedHtml,
      isHtml: isHtml,
      translatedImages: translatedImages
    };
  } catch (error) {
    console.error('Büyük doküman işleme hatası:', error);
    progressCallback({ stage: 'error', error: error.message });
    throw error;
  }
};

// Parçaları optimize etme - cümle kırılmasını önlemek için
const optimizeChunks = (chunks) => {
  if (!chunks || chunks.length <= 1) return chunks;
  
  const result = [];
  let currentChunk = chunks[0];
  
  for (let i = 1; i < chunks.length; i++) {
    const chunk = chunks[i];
    
    // Mevcut parça nokta, soru işareti veya ünlem ile bitmiyorsa
    // ve yeni parça küçük harfle başlıyorsa, bu parçaları birleştir
    if (currentChunk && chunk) {
      const lastChar = currentChunk.trim().slice(-1);
      const firstChar = chunk.trim().charAt(0);
      
      if (!/[.!?]/.test(lastChar) && 
          firstChar === firstChar.toLowerCase() && 
          firstChar.match(/[a-z]/i)) {
        // Cümle muhtemelen kesilmiş, birleştir
        currentChunk += ' ' + chunk;
      } else {
        // Mevcut parçayı sonuçlara ekle ve yeni parçaya geç
        result.push(currentChunk);
        currentChunk = chunk;
      }
    } else {
      // Boş parçaları atla
      if (currentChunk) result.push(currentChunk);
      currentChunk = chunk || '';
    }
  }
  
  // Son parçayı ekle
  if (currentChunk) result.push(currentChunk);
  
  return result;
};

// Metin parçasını çevirme (API ile)
const translateChunk = async (text, sourceLang, targetLang) => {
  // İstek sayısını sınırlamak için metin boşsa veya çok kısaysa atla
  if (!text || text.trim().length < 3) {
    return '';
  }
  
  try {
    // Çok büyük metin parçaları için bölme işlemi (API sınırları için)
    const MAX_CHUNK_SIZE = 4000; // Çoğu API'nin sınırı 5000 karakter civarıdır, güvenli olması için 4000
    
    if (text.length > MAX_CHUNK_SIZE) {
      console.log(`Çok büyük metin parçası (${text.length} karakter), daha küçük parçalara bölünüyor`);
      
      // Metni cümlelere böl
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      
      // Cümleleri grupla
      let currentGroup = '';
      const groups = [];
      
      for (const sentence of sentences) {
        if (currentGroup.length + sentence.length > MAX_CHUNK_SIZE) {
          groups.push(currentGroup);
          currentGroup = sentence;
        } else {
          currentGroup += sentence;
        }
      }
      
      if (currentGroup) {
        groups.push(currentGroup);
      }
      
      console.log(`Metin ${groups.length} alt parçaya bölündü`);
      
      // Her bir parçayı çevir ve birleştir
      const translations = [];
      for (let i = 0; i < groups.length; i++) {
        // Parçayı çevir (recursive çağrı)
        const partTranslation = await translateChunk(groups[i], sourceLang, targetLang);
        translations.push(partTranslation);
        
        // API sınırlamaları için kısa bir bekleme
        if (i < groups.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      return translations.join(' ');
    }
    
    // Önce Mistral API ile çevirmeyi dene (daha kaliteli sonuçlar için)
    if (API_CONFIG.useMistral && API_CONFIG.mistralApiKey) {
      try {
        console.log('Mistral API ile çeviri deneniyor...');
        const response = await fetch(API_CONFIG.mistralApiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_CONFIG.mistralApiKey}`
          },
          body: JSON.stringify({
            model: "mistral-large-latest",
            messages: [
              { role: "system", content: `Sen profesyonel bir çeviri asistanısın. Verilen metni ${sourceLang} dilinden ${targetLang} diline çevirirken, orijinal metnin anlam ve tonunu koruyarak doğal ve akıcı bir çeviri yaparsın.` },
              { role: "user", content: `Lütfen aşağıdaki metni ${sourceLang} dilinden ${targetLang} diline çevir. Sadece çeviriyi döndür, açıklama yapma:\n\n"${text}"` }
            ],
            temperature: 0.2,
            max_tokens: Math.max(1024, Math.ceil(text.length * 1.5)) // Metin uzunluğuna göre token sayısını ayarla
          })
        });
        
        // Yanıt başarılıysa ve JSON formatındaysa
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (data.choices && data.choices.length > 0) {
              console.log('Mistral API ile çeviri başarılı');
              return data.choices[0].message.content.trim();
            }
          }
        }
        // Bu çağrı başarısız olduysa, diğer alternatiflere geç
        console.log('Mistral API çevirisi başarısız, alternatif yönteme geçiliyor...');
      } catch (mistralError) {
        console.log('Mistral API hatası, alternatif çeviri yöntemine geçiliyor...', mistralError);
        // Hata durumunda diğer çeviri yöntemlerine geç
      }
    }
    
    // API üzerinden çeviri yap (ana API)
    try {
      console.log('Ana API ile çeviri deneniyor...');
      const result = await fetch(API_CONFIG.translateApiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.apiKey}`
        },
        body: JSON.stringify({
          text,
          source_language: sourceLang,
          target_language: targetLang
        })
      });
      
      // Yanıt başarılıysa ve JSON formatındaysa
      if (result.ok) {
        const contentType = result.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await result.json();
          console.log('Ana API ile çeviri başarılı');
          return data.translated_text;
        } else {
          throw new Error('API geçerli bir JSON yanıtı döndürmedi');
        }
      } else {
        // HTTP hata kodu durumunda
        const errorText = await result.text();
        throw new Error(`API yanıt hatası: ${result.status} ${result.statusText} - ${errorText}`);
      }
    } catch (apiError) {
      console.error('Ana API çeviri hatası:', apiError);
      // API çağrısı başarısız olduğunda alternatif yönteme geç
      console.log('Alternatif çeviri yöntemine geçiliyor...');
    }
    
    // Basit alternatif çeviri fonksiyonu
    const alternativeResult = alternativeTranslation(text, sourceLang, targetLang);
    console.log('Alternatif çeviri kullanıldı');
    return alternativeResult;
    
  } catch (error) {
    console.error('Çeviri parçası hatası:', error);
    // Son çare: hiçbir şey çalışmazsa en azından orijinal metni döndür
    return `[Çeviri yapılamadı] ${text}`;
  }
};

// Basit alternatif çeviri fonksiyonu
const alternativeTranslation = (text, sourceLang, targetLang) => {
  // Çok basit bir çeviri simulasyonu
  console.log(`Alternatif çeviri kullanılıyor: ${sourceLang} -> ${targetLang}`);
  
  // Basit kelime sözlüğü - özellikle büyük dokümanlar için daha fazla kelime ekliyorum
  const simpleDictionary = {
    'en': {
      'tr': {
        'hello': 'merhaba',
        'world': 'dünya',
        'document': 'belge',
        'translation': 'çeviri',
        'page': 'sayfa',
        'language': 'dil',
        'content': 'içerik',
        'section': 'bölüm',
        'chapter': 'bölüm',
        'table': 'tablo',
        'figure': 'şekil',
        'image': 'resim',
        'text': 'metin',
        'title': 'başlık',
        'subtitle': 'alt başlık',
        'paragraph': 'paragraf',
        'introduction': 'giriş',
        'conclusion': 'sonuç',
        'appendix': 'ek',
        'reference': 'referans',
        'bibliography': 'kaynakça',
        'glossary': 'sözlük',
        'index': 'dizin',
        'preface': 'önsöz',
        'foreword': 'önsöz',
        'abstract': 'özet',
        'summary': 'özet',
        'note': 'not',
        'footnote': 'dipnot',
        'header': 'başlık',
        'footer': 'altbilgi',
        'page number': 'sayfa numarası',
        'list': 'liste',
        'bullet point': 'madde işareti',
        'numbering': 'numaralandırma',
        'font': 'yazı tipi',
        'size': 'boyut',
        'color': 'renk',
        'margin': 'kenar boşluğu',
        'layout': 'düzen',
        'style': 'stil',
        'format': 'biçim',
        'alignment': 'hizalama',
        'left': 'sol',
        'right': 'sağ',
        'center': 'merkez',
        'justify': 'iki yana yaslı',
        'bold': 'kalın',
        'italic': 'italik',
        'underline': 'altı çizili',
        'highlight': 'vurgu',
        'caption': 'alt yazı',
        'chart': 'grafik',
        'graph': 'grafik',
        'diagram': 'diyagram',
        'flowchart': 'akış şeması',
        'process': 'süreç',
        'method': 'yöntem',
        'theory': 'teori',
        'concept': 'kavram',
        'idea': 'fikir',
        'analysis': 'analiz',
        'review': 'inceleme',
        'evaluation': 'değerlendirme',
        'assessment': 'değerlendirme',
        'result': 'sonuç',
        'finding': 'bulgu',
        'conclusion': 'sonuç',
        'recommendation': 'öneri',
        'suggestion': 'öneri',
        'discussion': 'tartışma',
        'argument': 'argüman',
        'evidence': 'kanıt',
        'data': 'veri',
        'information': 'bilgi',
        'knowledge': 'bilgi'
      }
    },
    'tr': {
      'en': {
        'merhaba': 'hello',
        'dünya': 'world',
        'belge': 'document',
        'çeviri': 'translation',
        'sayfa': 'page',
        'dil': 'language',
        'içerik': 'content',
        'bölüm': 'section',
        'tablo': 'table',
        'şekil': 'figure',
        'resim': 'image',
        'metin': 'text',
        'başlık': 'title',
        'alt başlık': 'subtitle',
        'paragraf': 'paragraph',
        'giriş': 'introduction',
        'sonuç': 'conclusion',
        'ek': 'appendix',
        'referans': 'reference',
        'kaynakça': 'bibliography',
        'sözlük': 'glossary',
        'dizin': 'index',
        'önsöz': 'preface',
        'özet': 'summary',
        'not': 'note',
        'dipnot': 'footnote',
        'altbilgi': 'footer',
        'sayfa numarası': 'page number',
        'liste': 'list',
        'madde işareti': 'bullet point',
        'numaralandırma': 'numbering',
        'yazı tipi': 'font',
        'boyut': 'size',
        'renk': 'color',
        'kenar boşluğu': 'margin',
        'düzen': 'layout',
        'stil': 'style',
        'biçim': 'format',
        'hizalama': 'alignment',
        'sol': 'left',
        'sağ': 'right',
        'merkez': 'center',
        'iki yana yaslı': 'justify',
        'kalın': 'bold',
        'italik': 'italic',
        'altı çizili': 'underline',
        'vurgu': 'highlight',
        'alt yazı': 'caption',
        'grafik': 'chart',
        'diyagram': 'diagram',
        'akış şeması': 'flowchart',
        'süreç': 'process',
        'yöntem': 'method',
        'teori': 'theory',
        'kavram': 'concept',
        'fikir': 'idea',
        'analiz': 'analysis',
        'inceleme': 'review',
        'değerlendirme': 'evaluation',
        'bulgu': 'finding',
        'öneri': 'recommendation',
        'tartışma': 'discussion',
        'argüman': 'argument',
        'kanıt': 'evidence',
        'veri': 'data',
        'bilgi': 'information'
      }
    }
  };
  
  // Eğer dil çifti için sözlük varsa, basit kelime değiştirme
  if (simpleDictionary[sourceLang]?.[targetLang]) {
    const dict = simpleDictionary[sourceLang][targetLang];
    // Metindeki kelimeleri değiştir
    let result = text;
    
    // İlk önce daha uzun ifadeleri işle (birden fazla kelimeden oluşan ifadeler)
    const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);
    
    for (const word of sortedKeys) {
      // Tam kelime eşleşmesi için kelime sınırları kullan
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      result = result.replace(regex, dict[word]);
    }
    
    return result;
  }
  
  // Desteklenmeyen dil çifti için basit bir mesaj ekle ve orijinal metni döndür
  return `[${targetLang} diline çevrilmedi - yedek çeviri kullanıldı] ${text}`;
};

// Çevrilmiş metni DOCX dosyası olarak oluşturma
const createWordDocument = (translatedText) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: translatedText.split('\n').map(paragraph => 
        new Paragraph({
          children: [new TextRun(paragraph)]
        })
      )
    }]
  });
  
  return Packer.toBlob(doc);
};

// Çevrilmiş metni PDF dosyası olarak oluşturma
const createPdfDocument = (translatedText) => {
  // Yeni jsPDF örneği oluştur
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Türkçe karakter desteği için yazı tipi ekleme
  pdf.setFont("Helvetica");
  
  // Sayfa genişliği ve kenar boşluğu hesaplama
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  
  // Metin stilini ayarla
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  
  // Metni parçalara bölerek sayfalara ekle
  const lines = pdf.splitTextToSize(translatedText, maxWidth);
  let y = 20;
  
  lines.forEach(line => {
    // Sayfanın sonuna yaklaşırsak yeni sayfa ekle
    if (y > 280) {
      pdf.addPage();
      y = 20;
    }
    
    // Unicode desteğini aktif ederek metni yaz
    pdf.text(line, margin, y, { flags: { noBOM: false } });
    y += 7;
  });
  
  return pdf.output('blob');
};

// Basitleştirilmiş HTML sunum oluştur
const createHtmlPresentation = (translatedText) => {
  const paragraphs = translatedText.split('\n').filter(p => p.trim());
  
  // Her 5 paragrafta bir yeni slayt oluştur
  const slides = [];
  const PARAGRAPHS_PER_SLIDE = 5;
  
  for(let i = 0; i < paragraphs.length; i += PARAGRAPHS_PER_SLIDE) {
    const slideContent = paragraphs.slice(i, i + PARAGRAPHS_PER_SLIDE).join('<br><br>');
    slides.push(`
      <div class="slide" style="page-break-after: always; padding: 40px; font-size: 18px;">
        ${slideContent}
      </div>
    `);
  }
  
  // HTML sunum oluştur
  const htmlPresentation = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Çeviri Sunumu</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        .slide { height: 90vh; position: relative; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: white; }
        @media print {
          .slide { page-break-after: always; height: 100vh; border: none; }
        }
      </style>
    </head>
    <body>
      ${slides.join('\n')}
      <script>
        // Otomatik yazdırma diyaloğu
        window.onload = function() {
          // window.print(); // Otomatik yazdırma isteğe bağlı olarak eklenebilir
        }
      </script>
    </body>
    </html>
  `;
  
  // HTML içeriğini blob olarak döndür
  return new Blob([htmlPresentation], { type: 'text/html' });
};

// Çevrilmiş metni dosya olarak indirme
export const saveTranslatedDocument = async (originalFileName, translatedText, targetLang, fileFormat = 'txt', isHtml = false) => {
  try {
    const baseName = originalFileName.split('.')[0] + `_${targetLang}`;
    let blob;
    let fileName;
    
    // HTML içerik olup olmadığını kontrol et
    if (isHtml && (fileFormat === 'txt' || fileFormat === 'html')) {
      // HTML içeriği HTML dosyası olarak kaydet
      blob = new Blob([translatedText], { type: 'text/html;charset=utf-8' });
      fileName = `${baseName}.html`;
    } else {
      // Normal dosya formatları
      switch (fileFormat) {
        case 'pdf':
          blob = await createPdfDocument(translatedText);
          fileName = `${baseName}.pdf`;
          break;
        
        case 'docx':
          blob = await createWordDocument(translatedText);
          fileName = `${baseName}.docx`;
          break;
        
        case 'pptx':
          // HTML sunum oluştur
          blob = createHtmlPresentation(translatedText);
          fileName = `${baseName}_sunum.html`;
          break;
        
        case 'html':
          // HTML olarak kaydet
          blob = new Blob([translatedText], { type: 'text/html;charset=utf-8' });
          fileName = `${baseName}.html`;
          break;
        
        case 'txt':
        default:
          blob = new Blob([translatedText], { type: 'text/plain;charset=utf-8' });
          fileName = `${baseName}.txt`;
          break;
      }
    }
    
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Dosya kaydetme hatası:', error);
    throw new Error('Çevrilen metin kaydedilemedi.');
  }
};

// Yapılandırma kontrolü
export const validateFileSize = (file, userProfile) => {
  // API_CONFIG içinde characterLimit yoksa varsayılan değerleri kullan
  const maxCharLimit = API_CONFIG.characterLimit || { free: 10000, premium: 100000 };
  
  const maxSize = userProfile?.premium 
    ? maxCharLimit.premium 
    : maxCharLimit.free;
  
  return file.size <= maxSize;
};

// Dosya türü kontrolü
export const isFileTypeSupported = (file) => {
  return SUPPORTED_FILE_TYPES.includes(file.type);
};

// Dosyadan resim çıkarma fonksiyonu
const extractImagesFromDocument = async (arrayBuffer, fileType) => {
  let images = [];
  console.log('Belgeden grafik çıkarma başlatıldı, dosya türü:', fileType);
  
  try {
    if (fileType.includes('word')) {
      console.log('Word belgesinden resimler çıkarılıyor...');
      
      // Mammoth seçeneklerini yapılandır - tüm resimleri çıkarmak için
      const options = {
        arrayBuffer: arrayBuffer,
        convertImage: mammoth.images.imgElement(async (image) => {
          try {
            console.log('Word resmi bulundu, tür:', image.contentType);
            
            // Base64 formatına çevir
            const imageBuffer = await image.readAsBase64String();
            
            // Eğer veri varsa, image nesnesini oluştur
            if (imageBuffer && imageBuffer.length > 0) {
              const imgData = `data:${image.contentType};base64,${imageBuffer}`;
              
              // Görüntüyü boyutlarını kontrol etmek için yükle
              await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                  // Çok küçük resimleri veya boyutları olmayan resimleri atla
                  if (img.width > 50 && img.height > 50) {
                    console.log(`Word resmi eklendi: ${img.width}x${img.height} px`);
                    images.push({
                      data: imgData,
                      contentType: image.contentType,
                      altText: image.altText || '',
                      width: img.width,
                      height: img.height
                    });
                  } else {
                    console.log(`Word resmi çok küçük, atlanıyor: ${img.width}x${img.height} px`);
                  }
                  resolve();
                };
                
                img.onerror = () => {
                  console.log('Resim yüklenemedi, atlanıyor');
                  resolve(); // Hata durumunda da devam et, sadece bu resmi atla
                };
                
                img.src = imgData;
              });
              
              // HTML içinde görüntüyü kullan
              return { src: imgData };
            }
            
            return null; // Veri yoksa null döndür
          } catch (imgError) {
            console.error('Word resmi işleme hatası:', imgError);
            return null; // Hata durumunda null döndür
          }
        })
      };
      
      // HTML'ye dönüştür ve resimleri çıkar
      const result = await mammoth.convertToHtml(options);
      
      console.log(`Word belgesinden ${images.length} resim çıkarıldı`);
      return { images, html: result.value };
    } 
    else if (fileType.includes('pdf')) {
      console.log('PDF belgesinden resimler çıkarılıyor...');
      // PDF dosyalarından resim çıkarma
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      console.log(`PDF belgesi yüklendi, toplam sayfa: ${pdf.numPages}`);
      
      for (let i = 1; i <= pdf.numPages; i++) {
        console.log(`PDF sayfa ${i}/${pdf.numPages} işleniyor...`);
        const page = await pdf.getPage(i);
        const ops = await page.getOperatorList();
        const imgIndex = [];
        
        // Sayfadaki resim operatörlerini bul
        for (let j = 0; j < ops.fnArray.length; j++) {
          if (ops.fnArray[j] === pdfjsLib.OPS.paintImageXObject) {
            imgIndex.push(j);
          }
        }
        
        console.log(`Sayfa ${i}'de ${imgIndex.length} potansiyel resim bulundu`);
        
        // Bulunan resimleri işle
        for (const j of imgIndex) {
          try {
            const imgData = ops.argsArray[j][0]; // Resim referansı
            const img = page.objs.get(imgData);
            
            if (img && img.data) {
              console.log(`Resim ${j} işleniyor, boyut: ${img.width}x${img.height}`);
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              
              // Resim verisini canvas'a çiz
              const imgDataObj = ctx.createImageData(img.width, img.height);
              imgDataObj.data.set(img.data);
              ctx.putImageData(imgDataObj, 0, 0);
              
              // Canvas'ı base64 olarak al
              const dataUrl = canvas.toDataURL('image/png');
              
              // Resim kalitesini kontrol et (tamamen beyaz veya çok küçük resimleri atla)
              if (isImageWorthProcessing(canvas, img.width, img.height)) {
                console.log(`Sayfa ${i}'den geçerli resim eklendi`);
                images.push({
                  data: dataUrl,
                  contentType: 'image/png',
                  altText: `Image from page ${i}`
                });
              } else {
                console.log('Resim işlenmesi için uygun değil (boş veya çok küçük), atlanıyor');
              }
            }
          } catch (e) {
            console.error('PDF resim çıkarma hatası:', e);
          }
        }
      }
      
      console.log(`PDF belgesinden toplam ${images.length} resim çıkarıldı`);
      return { images, html: '' };
    }
    
    console.log('Desteklenmeyen dosya türü, resim çıkarılamadı');
    return { images: [], html: '' };
  } catch (error) {
    console.error('Resim çıkarma hatası:', error);
    return { images: [], html: '', error: error.message };
  }
};

// Resmin işlenmeye değer olup olmadığını kontrol et
function isImageWorthProcessing(canvas, width, height) {
  // Çok küçük resimleri atla
  if (width < 50 || height < 50) {
    return false;
  }
  
  try {
    // Resmin tamamen boş/beyaz olup olmadığını kontrol et
    const ctx = canvas.getContext('2d');
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    
    // Piksellerin çeşitliliğini kontrol et
    let hasContent = false;
    for (let i = 0; i < data.length; i += 20) { // Her 20 pikselde bir kontrol et (performans için)
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Eğer piksel beyaz veya şeffaf değilse (içerik var)
      if ((r < 240 || g < 240 || b < 240) && data[i + 3] > 10) {
        hasContent = true;
        break;
      }
    }
    
    return hasContent;
  } catch (e) {
    console.error('Resim içerik kontrolü hatası:', e);
    return true; // Hata durumunda işlemeye devam et
  }
}

// Belgedeki resimleri çevirme
export const translateDocumentImages = async (file, sourceLang, targetLang, progressCallback) => {
  try {
    console.log('Belge resimlerini çevirme işlemi başlatıldı');
    const arrayBuffer = await file.arrayBuffer();
    const fileType = file.type;
    
    // Belgedeki resimleri çıkar
    console.log('Resimleri çıkarma işlemi başlatılıyor...');
    const extractionResult = await extractImagesFromDocument(arrayBuffer, fileType);
    const { images } = extractionResult;
    
    if (images.length === 0) {
      console.log('Belgede çevrilecek resim bulunamadı');
      if (progressCallback) {
        progressCallback({ stage: 'image_complete', progress: 100, message: 'Çevrilecek resim bulunamadı' });
      }
      return { translatedImages: [], originalImages: [] };
    }
    
    console.log(`Toplam ${images.length} resim bulundu, çevirme işlemi başlatılıyor`);
    
    // İlerleme bildirimi
    if (progressCallback) {
      progressCallback({ 
        stage: 'image_extraction', 
        progress: 100,
        imageCount: images.length,
        message: `${images.length} resim çıkarıldı`
      });
    }
    
    // Her bir resmi çevir
    const translatedImages = [];
    const totalImages = images.length;
    
    for (let i = 0; i < totalImages; i++) {
      try {
        console.log(`Resim ${i + 1}/${totalImages} çeviriliyor...`);
        
        // İlerleme bildirimi
        if (progressCallback) {
          progressCallback({ 
            stage: 'image_translation', 
            progress: Math.round((i / totalImages) * 100),
            currentImage: i + 1,
            totalImages,
            message: `Resim ${i + 1}/${totalImages} çeviriliyor`
          });
        }
        
        // Resmi çevir
        const translationResult = await imageTranslator.translateImageText(
          images[i].data,
          sourceLang,
          targetLang
        );
        
        console.log(`Resim ${i + 1} için çeviri sonucu:`, 
          translationResult.translatedText ? 'Metin bulundu ve çevrildi' : 'Metin bulunamadı');
        
        // Çevrilen metni resme uygula
        if (translationResult.translatedText) {
          console.log('Çevrilen metin resme uygulanıyor...');
          const renderedImage = await imageTranslator.renderTranslatedImage(
            images[i].data,
            translationResult
          );
          
          translatedImages.push({
            original: images[i],
            translated: {
              data: renderedImage,
              contentType: images[i].contentType,
              altText: images[i].altText,
              originalText: translationResult.originalText,
              translatedText: translationResult.translatedText
            }
          });
          
          console.log(`Resim ${i + 1} başarıyla çevrildi`);
        } else {
          console.log(`Resim ${i + 1}'de çevrilecek metin bulunamadı`);
          // Metin bulunamazsa orijinal resmi ekle
          translatedImages.push({
            original: images[i],
            translated: null
          });
        }
      } catch (error) {
        console.error(`Resim ${i+1}/${totalImages} çeviri hatası:`, error);
        // Hata durumunda orijinal resmi ekle
        translatedImages.push({
          original: images[i],
          translated: null,
          error: error.message
        });
      }
    }
    
    console.log('Tüm resimlerin çevirisi tamamlandı');
    
    // Tamamlandı bildirimi
    if (progressCallback) {
      progressCallback({ 
        stage: 'image_complete', 
        progress: 100,
        message: `${translatedImages.filter(img => img.translated).length}/${totalImages} resim çevrildi`
      });
    }
    
    return {
      translatedImages,
      originalImages: images
    };
  } catch (error) {
    console.error('Belge resimleri çevirme hatası:', error);
    if (progressCallback) {
      progressCallback({ stage: 'image_error', error: error.message });
    }
    throw error;
  }
};

export default {
  extractTextFromFile,
  processBigDocument,
  saveTranslatedDocument,
  validateFileSize,
  isFileTypeSupported,
  translateHtmlContent,
  translateDocumentImages,
  SUPPORTED_FILE_TYPES
}; 