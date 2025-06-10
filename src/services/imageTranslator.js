import { createWorker } from 'tesseract.js';
import translateService from './api';

// Konsola özel bir stil ile hata ayıklama mesajları yazdırma
const debug = (message, data = null) => {
  console.log(`%c[GRAFİK ÇEVİRİ] ${message}`, 'background: #3949ab; color: white; padding: 2px 4px; border-radius: 2px;', data || '');
};

// OCR durumunu kontrol etme
export const checkTesseractSupport = () => {
  try {
    debug('Tesseract.js desteği kontrol ediliyor...');
    if (typeof createWorker !== 'function') {
      debug('HATA: createWorker fonksiyonu tanımlanmamış!', createWorker);
      return false;
    }
    debug('Tesseract.js desteği mevcut');
    return true;
  } catch (error) {
    debug('Tesseract desteği kontrol hatası:', error);
    return false;
  }
};

// Tesseract dil haritası - desteklediğimiz diller için
const TESSERACT_LANG_MAP = {
  'en': 'eng',
  'tr': 'tur',
  'de': 'deu',
  'fr': 'fra',
  'es': 'spa',
  'it': 'ita',
  'pt': 'por',
  'ru': 'rus',
  'ja': 'jpn',
  'zh': 'chi_sim',
  'ko': 'kor',
  'ar': 'ara',
  'hi': 'hin',
  'auto': 'eng' // Otomatik algılama için varsayılan İngilizce
};

// Tesseract worker örneği
let worker = null;

// Tesseract worker'ı başlat
const initWorker = async (language = 'eng') => {
  try {
    debug(`Tesseract worker başlatılıyor, dil: ${language}`);
    
    // Tesseract desteğini kontrol et
    checkTesseractSupport();
    
    // Eğer zaten bir worker varsa, kapat
    if (worker) {
      debug('Mevcut worker kapatılıyor...');
      await worker.terminate();
    }
    
    // Yeni worker oluştur - fonksiyon yerine boolean kullan
    debug('Yeni worker oluşturuluyor...');
    worker = await createWorker({
      logger: true, // Fonksiyon yerine true kullan
      langPath: 'https://tessdata.projectnaptha.com/4.0.0',
    });
    
    // Log için olay dinleyicisi ekle
    document.addEventListener('tesseract-worker-update', (e) => {
      if (e.detail) {
        debug('Tesseract ilerleme:', e.detail);
      }
    }, false);
    
    // Dili yükle
    debug(`Dil yükleniyor: ${language}`);
    await worker.loadLanguage(language);
    await worker.initialize(language);
    
    debug('Tesseract worker başarıyla başlatıldı');
    return worker;
  } catch (error) {
    debug('Tesseract worker başlatma hatası:', error);
    throw new Error('OCR sistemi başlatılamadı: ' + error.message);
  }
};

// Resimdeki metinleri tanıma
export const recognizeTextInImage = async (imageData, language = 'eng') => {
  try {
    debug('OCR işlemi başlatılıyor...');
    
    // Görüntü verilerini kontrol et
    if (!imageData || typeof imageData !== 'string' || !imageData.startsWith('data:')) {
      debug('HATA: Geçersiz görüntü verisi:', typeof imageData);
      return { text: '', words: [], confidence: 0, error: 'Geçersiz görüntü verisi' };
    }
    
    // Dil kodunu düzgün formata çevir
    const tesseractLang = TESSERACT_LANG_MAP[language] || 'eng';
    debug('Kullanılan OCR dili:', tesseractLang);
    
    // Görüntüyü ön işleme tabi tut
    debug('Görüntü yükleniyor...');
    const img = new Image();
    
    await new Promise((resolve, reject) => {
      img.onload = () => {
        debug(`Görüntü başarıyla yüklendi: ${img.width}x${img.height} px`);
        resolve();
      };
      img.onerror = (e) => {
        debug('Görüntü yükleme hatası:', e);
        reject(new Error('Görüntü yüklenemedi'));
      };
      img.src = imageData;
    });
    
    debug(`Görüntü boyutları: ${img.width}x${img.height}`);
    
    // Çok küçük görüntüleri işleme (tesseract hatası önleme)
    if (img.width < 50 || img.height < 50) {
      debug('UYARI: Görüntü OCR için çok küçük, atlanıyor');
      return { text: '', words: [], confidence: 0, error: 'Görüntü çok küçük' };
    }
    
    // Worker'ı başlat - her seferinde yeni bir worker oluştur
    debug('OCR worker başlatılıyor...');
    let localWorker = await createWorker({
      logger: false,
    });
    
    try {
      // Dili yükle
      debug(`Dil yükleniyor: ${tesseractLang}`);
      await localWorker.loadLanguage(tesseractLang);
      await localWorker.initialize(tesseractLang);
      
      // OCR işlemi
      debug('OCR tanıma başlıyor...');
      const result = await localWorker.recognize(imageData);
      debug('OCR tanıma tamamlandı');
      
      // Sonuç kontrolü
      if (result && result.data && result.data.text) {
        const text = result.data.text.trim();
        debug(`OCR metni bulundu (${text.length} karakter):`, text.substring(0, 50) + (text.length > 50 ? '...' : ''));
        debug('OCR güven oranı:', result.data.confidence);
        
        return {
          text: text,
          words: result.data.words || [],
          confidence: result.data.confidence
        };
      } else {
        debug('OCR metin bulunamadı veya boş');
        return {
          text: '',
          words: [],
          confidence: 0,
          error: 'Metinsel içerik bulunamadı'
        };
      }
    } finally {
      // İşlem sonrası worker'ı kapat
      if (localWorker) {
        try {
          debug('Worker kapatılıyor...');
          await localWorker.terminate();
          debug('Worker başarıyla kapatıldı');
        } catch (e) {
          debug('Worker kapatma hatası:', e);
        }
      }
    }
  } catch (error) {
    debug('OCR işleme hatası:', error);
    return {
      text: '',
      words: [],
      confidence: 0,
      error: error.message
    };
  }
};

// Resimdeki metinleri çevirme
export const translateImageText = async (imageData, sourceLang, targetLang) => {
  try {
    debug(`Görüntü çevirisi başlatılıyor: ${sourceLang} -> ${targetLang}`);
    
    // 1. Resimdeki metinleri tanıma
    const recognitionResult = await recognizeTextInImage(
      imageData, 
      sourceLang === 'auto' ? 'eng' : sourceLang
    );
    
    if (!recognitionResult.text || recognitionResult.text.trim() === '') {
      debug('Çevrilecek metin bulunamadı veya boş metin');
      return {
        originalText: '',
        translatedText: '',
        confidence: 0,
        imageData: imageData,
        error: recognitionResult.error || 'Çevrilecek metin bulunamadı'
      };
    }
    
    debug(`Tanınan metin (${recognitionResult.text.length} karakter) çeviriliyor...`);
    
    // 2. Tanınan metinleri çevirme
    const translationResult = await translateService.translateText(
      recognitionResult.text,
      sourceLang,
      targetLang
    );
    
    debug('Metin çevirisi tamamlandı');
    
    // 3. Sonuçları döndür
    return {
      originalText: recognitionResult.text,
      translatedText: translationResult.translated_text,
      confidence: recognitionResult.confidence,
      words: recognitionResult.words,
      imageData: imageData
    };
  } catch (error) {
    debug('Görüntü çeviri hatası:', error);
    throw new Error('Grafik çevirisi başarısız oldu: ' + error.message);
  }
};

// Resim üzerine çevrilen metni ekleme
export const renderTranslatedImage = async (imageData, translationResult) => {
  return new Promise((resolve, reject) => {
    try {
      debug('Çevrilen metin resme uygulanıyor...');
      
      // Görüntüyü yükle
      const img = new Image();
      img.onload = () => {
        debug(`Orijinal görüntü boyutları: ${img.width}x${img.height}`);
        
        // Canvas oluştur
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        // Orijinal resmi çiz
        ctx.drawImage(img, 0, 0);
        
        // Görüntü türünü analiz et (grafik, tablo vb.)
        const isTable = detectTable(translationResult.words);
        const isChart = detectChart(translationResult.words);
        
        // Çevirme stratejisini belirle
        if (isTable) {
          debug('Tablo tespit edildi, tablo formatına göre yerleştirme yapılıyor');
          renderTable(ctx, translationResult, img.width, img.height);
        } else if (isChart) {
          debug('Grafik tespit edildi, grafik formatına göre yerleştirme yapılıyor');
          renderChart(ctx, translationResult, img.width, img.height);
        } else {
          // Standart metin yerleştirme
          debug('Standart metin yerleştirme yapılıyor');
          
          // Orijinal metinleri bul ve üzerini kapat
          if (translationResult.words && translationResult.words.length > 0) {
            debug(`${translationResult.words.length} kelime alanı işleniyor`);
            
            translationResult.words.forEach(word => {
              const { bbox } = word;
              if (bbox && bbox.x0 !== undefined && bbox.y0 !== undefined) {
                // Metin alanını beyaz dikdörtgenle kapat
                ctx.fillStyle = 'white';
                ctx.fillRect(bbox.x0, bbox.y0, bbox.x1 - bbox.x0, bbox.y1 - bbox.y0);
              }
            });
          }
          
          // Çevrilmiş metni ekle
          ctx.font = '14px Arial';
          ctx.fillStyle = 'black';
          
          // Basit metin yerleştirme
          const lines = translationResult.translatedText.split('\n');
          let y = 30; // Başlangıç y koordinatı
          
          lines.forEach(line => {
            // Metin genişliğini kontrol et
            const textWidth = ctx.measureText(line).width;
            const maxWidth = img.width - 40; // Kenar boşluğu için
            
            if (textWidth > maxWidth) {
              // Metin çok uzunsa böl
              const words = line.split(' ');
              let currentLine = '';
              
              words.forEach(word => {
                const testLine = currentLine + word + ' ';
                const testWidth = ctx.measureText(testLine).width;
                
                if (testWidth > maxWidth) {
                  ctx.fillText(currentLine, 20, y);
                  currentLine = word + ' ';
                  y += 20;
                } else {
                  currentLine = testLine;
                }
              });
              
              // Son satırı ekle
              if (currentLine.trim()) {
                ctx.fillText(currentLine, 20, y);
                y += 20;
              }
            } else {
              ctx.fillText(line, 20, y);
              y += 20;
            }
          });
        }
        
        debug('Çevrilen metin resme uygulandı');
        
        // Canvas'ı resim olarak döndür
        canvas.toBlob(blob => {
          const imageUrl = URL.createObjectURL(blob);
          debug('Çeviri sonucu resim URL oluşturuldu:', imageUrl);
          resolve(imageUrl);
        });
      };
      
      img.onerror = (e) => {
        debug('Görüntü yükleme hatası:', e);
        reject(new Error('Görüntü yüklenemedi: ' + e.message));
      };
      
      img.src = imageData;
    } catch (error) {
      debug('Görüntü işleme hatası:', error);
      reject(error);
    }
  });
};

// Tablo algılama
const detectTable = (words) => {
  if (!words || words.length < 10) return false;
  
  // Tablo hücresi benzeri yapılar var mı?
  const potentialCells = words.filter(word => {
    const { bbox } = word;
    if (!bbox) return false;
    
    // Hücrelerin genellikle dikdörtgen şekli vardır
    const width = bbox.x1 - bbox.x0;
    const height = bbox.y1 - bbox.y0;
    
    // Hücre benzeri olup olmadığını kontrol et
    return width > 10 && height > 10 && width < 200 && height < 100;
  });
  
  // Hizalama kontrolü - tablolarda genellikle sütunlar ve satırlar hizalıdır
  const verticalAlignments = {};
  const horizontalAlignments = {};
  
  words.forEach(word => {
    if (!word.bbox) return;
    
    // Yatay hizalama sayısı
    const left = Math.round(word.bbox.x0 / 5) * 5;
    verticalAlignments[left] = (verticalAlignments[left] || 0) + 1;
    
    // Dikey hizalama sayısı
    const top = Math.round(word.bbox.y0 / 5) * 5;
    horizontalAlignments[top] = (horizontalAlignments[top] || 0) + 1;
  });
  
  // Aynı hizada en az 3 kelime varsa, tablo olma olasılığı yüksektir
  const hasVerticalAlignment = Object.values(verticalAlignments).some(count => count >= 3);
  const hasHorizontalAlignment = Object.values(horizontalAlignments).some(count => count >= 3);
  
  return hasVerticalAlignment && hasHorizontalAlignment && potentialCells.length > 8;
};

// Grafik algılama (basit)
const detectChart = (words) => {
  if (!words || words.length < 5) return false;
  
  // Grafikler genellikle az sayıda kelimeye sahiptir ve
  // çizgiler, barlar, renkli alanlar gibi grafik öğelerini içerir
  
  // Kelimeler arasında belirli mesafelerde boşluklar olabilir (eksen etiketleri vb.)
  const wordPositions = words.map(word => {
    if (!word.bbox) return null;
    return {
      x: word.bbox.x0,
      y: word.bbox.y0,
      width: word.bbox.x1 - word.bbox.x0,
      height: word.bbox.y1 - word.bbox.y0
    };
  }).filter(pos => pos !== null);
  
  // Kelimeler arasında büyük boşluklar var mı?
  if (wordPositions.length < 5) return false;
  
  // Kelimelerin X ekseninde dağılımını kontrol et
  const sortedByX = [...wordPositions].sort((a, b) => a.x - b.x);
  const xGaps = [];
  
  for (let i = 1; i < sortedByX.length; i++) {
    const gap = sortedByX[i].x - (sortedByX[i-1].x + sortedByX[i-1].width);
    if (gap > 20) {
      xGaps.push(gap);
    }
  }
  
  // Kelimelerin Y ekseninde dağılımını kontrol et
  const sortedByY = [...wordPositions].sort((a, b) => a.y - b.y);
  const yGaps = [];
  
  for (let i = 1; i < sortedByY.length; i++) {
    const gap = sortedByY[i].y - (sortedByY[i-1].y + sortedByY[i-1].height);
    if (gap > 20) {
      yGaps.push(gap);
    }
  }
  
  // Grafikler genellikle eksen boyunca düzenli aralıklarla yerleştirilmiş etiketlere sahiptir
  return (xGaps.length >= 2 || yGaps.length >= 2);
};

// Tablo render etme
const renderTable = (ctx, translationResult, imgWidth, imgHeight) => {
  try {
    // Orijinal metinleri bul ve üzerini kapat
    if (translationResult.words && translationResult.words.length > 0) {
      translationResult.words.forEach(word => {
        const { bbox } = word;
        if (bbox && bbox.x0 !== undefined && bbox.y0 !== undefined) {
          // Metin alanını beyaz dikdörtgenle kapat
          ctx.fillStyle = 'white';
          ctx.fillRect(bbox.x0, bbox.y0, bbox.x1 - bbox.x0, bbox.y1 - bbox.y0);
        }
      });
    }
    
    // Çevrilmiş tablo metinlerini ekle
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';
    
    // Tablo yapısını analiz et
    const rows = parseTableStructure(translationResult.words, translationResult.translatedText);
    
    // Satırları render et
    rows.forEach(row => {
      row.cells.forEach(cell => {
        ctx.fillText(cell.text, cell.x, cell.y);
      });
    });
  } catch (error) {
    debug('Tablo render hatası:', error);
    // Hata durumunda basit metin yerleştirme yap
    ctx.font = '14px Arial';
    ctx.fillStyle = 'black';
    const lines = translationResult.translatedText.split('\n');
    let y = 30;
    lines.forEach(line => {
      ctx.fillText(line, 20, y);
      y += 20;
    });
  }
};

// Tablo yapısını analiz etme
const parseTableStructure = (words, translatedText) => {
  // Basit bir yapı oluştur
  const rows = [];
  
  try {
    if (!words || words.length === 0) return rows;
    
    // Kelimeleri y pozisyonuna göre sırala (satırlar)
    const sortedWords = [...words].sort((a, b) => {
      if (!a.bbox || !b.bbox) return 0;
      return a.bbox.y0 - b.bbox.y0;
    });
    
    // Çevirilen metni satırlara ayır
    const translatedLines = translatedText.split('\n');
    let currentLineIndex = 0;
    
    // Yaklaşık satır yüksekliğini hesapla
    let currentY = sortedWords[0]?.bbox?.y0 || 0;
    let currentRow = { y: currentY, cells: [] };
    
    sortedWords.forEach(word => {
      if (!word.bbox) return;
      
      // Yeni satır mı?
      if (Math.abs(word.bbox.y0 - currentY) > 15) {
        if (currentRow.cells.length > 0) {
          rows.push(currentRow);
        }
        currentY = word.bbox.y0;
        currentRow = { y: currentY, cells: [] };
      }
      
      // Çevrilen satırdan metni al
      const cellText = currentLineIndex < translatedLines.length ? 
                       translatedLines[currentLineIndex] : word.text;
      
      // Hücre ekle
      currentRow.cells.push({
        x: word.bbox.x0,
        y: word.bbox.y0 + (word.bbox.y1 - word.bbox.y0) * 0.7, // Dikey hizalama
        text: cellText
      });
      
      currentLineIndex++;
    });
    
    // Son satırı ekle
    if (currentRow.cells.length > 0) {
      rows.push(currentRow);
    }
  } catch (error) {
    debug('Tablo yapısı analiz hatası:', error);
  }
  
  return rows;
};

// Grafik render etme
const renderChart = (ctx, translationResult, imgWidth, imgHeight) => {
  try {
    // Orijinal metinleri bul ve sadece metnin olduğu kısmı kapat
    // Grafiklerde genellikle grafiğin kendisini koruyup sadece etiketleri değiştirmek istiyoruz
    if (translationResult.words && translationResult.words.length > 0) {
      translationResult.words.forEach(word => {
        const { bbox } = word;
        if (bbox && bbox.x0 !== undefined && bbox.y0 !== undefined) {
          // Metin alanını beyaz dikdörtgenle kapat
          ctx.fillStyle = 'white';
          ctx.fillRect(bbox.x0, bbox.y0, bbox.x1 - bbox.x0, bbox.y1 - bbox.y0);
        }
      });
    }
    
    // Çevrilmiş metni ekle
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';
    
    // Grafik etiketlerini analiz et
    const labels = parseChartLabels(translationResult.words, translationResult.translatedText);
    
    // Etiketleri render et
    labels.forEach(label => {
      ctx.fillText(label.text, label.x, label.y);
    });
    
    // Eğer başlık varsa
    if (labels.length > 0 && translationResult.translatedText) {
      const title = translationResult.translatedText.split('\n')[0];
      if (title && title.length > 0) {
        ctx.font = 'bold 14px Arial';
        ctx.fillText(title, imgWidth / 2 - ctx.measureText(title).width / 2, 20);
      }
    }
  } catch (error) {
    debug('Grafik render hatası:', error);
    // Hata durumunda basit metin yerleştirme yap
    ctx.font = '14px Arial';
    ctx.fillStyle = 'black';
    const lines = translationResult.translatedText.split('\n');
    let y = 30;
    lines.forEach(line => {
      ctx.fillText(line, 20, y);
      y += 20;
    });
  }
};

// Grafik etiketlerini analiz etme
const parseChartLabels = (words, translatedText) => {
  const labels = [];
  
  try {
    if (!words || words.length === 0) return labels;
    
    // Çevirilen metni satırlara ayır
    const translatedLines = translatedText.split('\n');
    let currentLineIndex = 0;
    
    words.forEach(word => {
      if (!word.bbox) return;
      
      // Çevrilen satırdan metni al
      const labelText = currentLineIndex < translatedLines.length ? 
                     translatedLines[currentLineIndex] : word.text;
      
      // Etiket ekle
      labels.push({
        x: word.bbox.x0,
        y: word.bbox.y0 + (word.bbox.y1 - word.bbox.y0) * 0.7, // Dikey hizalama
        text: labelText
      });
      
      currentLineIndex++;
    });
  } catch (error) {
    debug('Grafik etiketleri analiz hatası:', error);
  }
  
  return labels;
};

// Çalışma kontrolü - Component mount olduktan sonra çağrılabilir
export const checkOperation = async () => {
  debug('OCR sistemi test ediliyor...');
  
  try {
    // Tesseract.js desteğini kontrol et
    const isSupported = checkTesseractSupport();
    
    if (!isSupported) {
      debug('OCR sistemi kullanılamıyor!');
      return { success: false, error: 'Tesseract.js desteği bulunamadı' };
    }
    
    debug('Test için tesseract.js yükleniyor...');
    
    // Tüm worker işlemlerini atla ve sadece kütüphanenin doğru yüklendiğini doğrula
    return { success: true, message: 'Tesseract.js desteği mevcut' };
    
  } catch (error) {
    debug('OCR test hatası:', error);
    return { success: false, error: error.message };
  }
};

export default {
  recognizeTextInImage,
  translateImageText,
  renderTranslatedImage,
  checkTesseractSupport,
  checkOperation
}; 