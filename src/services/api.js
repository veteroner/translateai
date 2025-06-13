import * as axiosLib from 'axios';
import { API_CONFIG } from '../config';

// Axios örneğini oluştur
const axios = axiosLib.default || axiosLib;

// Axios örneği oluşturma - Varsayılan API URL'sini kullanma (hatalı olduğu için)
// Artık Mistral API'yi kullanacağız
const apiClient = axios.create({
  // baseURL: API_CONFIG.baseUrl, // Bu satırı yorum satırına alıyoruz, artık kullanmıyoruz
  timeout: API_CONFIG.requestTimeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// İstek interceptor'ı - her istekte API anahtarını ekler
apiClient.interceptors.request.use(
  config => {
    config.headers['Authorization'] = `Bearer ${API_CONFIG.apiKey}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Hata işleme ve yeniden deneme mekanizması
let retryCount = 0;

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Yeniden deneme limiti kontrol ediliyor
    if (retryCount < API_CONFIG.maxRetries) {
      if (error.response) {
        // Rate limit aşıldı veya geçici sunucu hatası
        if (error.response.status === 429 || error.response.status >= 500) {
          retryCount++;
          
          // Exponential backoff ile yeniden deneme
          const delay = API_CONFIG.retryDelay * (2 ** (retryCount - 1));
          await new Promise(resolve => setTimeout(resolve, delay));
          
          return apiClient(originalRequest);
        }
      } else if (error.request) {
        // Ağ hatası, yeniden deneme
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay));
        return apiClient(originalRequest);
      }
    }
    
    // Tüm yeniden denemeler başarısızsa
    retryCount = 0;
    return Promise.reject(error);
  }
);

// Çeviri önbelleği - aynı metinlerin tekrar çevrilmesini önler
const translationCache = new Map();

// Önbellekten çeviri getirme
const getCachedTranslation = (text, sourceLang, targetLang) => {
  if (!API_CONFIG.cachingEnabled) return null;
  
  const cacheKey = `${text}_${sourceLang}_${targetLang}`;
  const cachedItem = translationCache.get(cacheKey);
  
  if (cachedItem) {
    const now = Date.now();
    // Önbellek süresi dolmuş mu kontrol et
    if (now - cachedItem.timestamp < API_CONFIG.cacheExpiration) {
      console.log('Önbellekten çeviri kullanılıyor');
      return cachedItem.data;
    } else {
      // Süresi dolmuş önbellek öğesini temizle
      translationCache.delete(cacheKey);
    }
  }
  
  return null;
};

// Çeviriyi önbelleğe ekleme
const cacheTranslation = (text, sourceLang, targetLang, data) => {
  if (!API_CONFIG.cachingEnabled) return;
  
  const cacheKey = `${text}_${sourceLang}_${targetLang}`;
  translationCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  // Önbellek boyutunu kontrol et, 100 öğeyi geçerse eskilerini temizle
  if (translationCache.size > 100) {
    const oldestKey = [...translationCache.keys()].sort((a, b) => 
      translationCache.get(a).timestamp - translationCache.get(b).timestamp
    )[0];
    
    if (oldestKey) {
      translationCache.delete(oldestKey);
    }
  }
};

// Rate limiting için istek sayacı
let requestCount = 0;
let lastRequestTimestamp = Date.now();
let isThrottled = false;

// Rate limit kontrolü
const checkRateLimit = async () => {
  if (!API_CONFIG.rateLimiting.enabled) return true;
  
  const now = Date.now();
  const timeElapsed = now - lastRequestTimestamp;
  
  // 1 dakika (60000 ms) geçtiyse sayacı sıfırla
  if (timeElapsed > 60000) {
    requestCount = 0;
    lastRequestTimestamp = now;
    isThrottled = false;
    return true;
  }
  
  // Limit aşıldıysa istek göndermeyi engelle
  if (requestCount >= API_CONFIG.rateLimiting.maxRequestsPerMinute) {
    if (!isThrottled) {
      console.warn(`Rate limit aşıldı. ${API_CONFIG.rateLimiting.throttleDelay}ms bekleniyor...`);
      isThrottled = true;
      
      // Throttle süresini bekleyip tekrar dene
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.rateLimiting.throttleDelay));
      requestCount = Math.max(0, requestCount - 5); // 5 istek kredisi geri ver
      isThrottled = false;
    }
  }
  
  requestCount++;
  return true;
};

// Google Translate API için yardımcı fonksiyon
const getGoogleTranslateUrl = () => {
  // Google Translate API URL'si
  return `https://translation.googleapis.com/language/translate/v2?key=${API_CONFIG.googleApiKey}`;
};

// Gemini AI API'si için yardımcı fonksiyon
const getGeminiTranslatePrompt = (text, sourceLanguage, targetLanguage) => {
  // Kaynak dil auto ise, bunu belirtmeden direkt çeviri isteyelim
  const sourceLangText = sourceLanguage === 'auto' ? '' : `Kaynak dil: ${sourceLanguage}.`;
  
  return {
    contents: [
      {
        parts: [
          {
            text: `${sourceLangText} Lütfen aşağıdaki metni ${targetLanguage} diline çevir. Sadece çeviriyi döndür, ekstra açıklama yapma:\n\n"${text}"`
          }
        ]
      }
    ]
  };
};

// Gemini AI ile çeviri yap
const translateWithGemini = async (text, sourceLanguage, targetLanguage) => {
  try {
    // Rate limit kontrolü
    await checkRateLimit();
    
    if (!API_CONFIG.googleApiKey) {
      throw new Error('API anahtarı eksik.');
    }
    
    const endpoint = `${API_CONFIG.geminiApiEndpoint}/${API_CONFIG.geminiModel}:generateContent?key=${API_CONFIG.googleApiKey}`;
    const requestData = getGeminiTranslatePrompt(text, sourceLanguage, targetLanguage);
    
    const response = await axios.post(endpoint, requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Gemini yanıtından çeviriyi çıkar
    if (response.data && 
        response.data.candidates && 
        response.data.candidates.length > 0 && 
        response.data.candidates[0].content &&
        response.data.candidates[0].content.parts &&
        response.data.candidates[0].content.parts.length > 0) {
      
      const translatedText = response.data.candidates[0].content.parts[0].text;
      
      const result = {
        translated_text: translatedText.trim(),
        source_language: sourceLanguage,
        target_language: targetLanguage
      };
      
      // Sonucu önbelleğe ekle
      cacheTranslation(text, sourceLanguage, targetLanguage, result);
      
      return result;
    }
    
    throw new Error('Gemini yanıtında çeviri bulunamadı.');
  } catch (error) {
    console.error('Gemini çeviri hatası:', error);
    throw error;
  }
};

// Alternatif çeviri servisi (API anahtarı geçersiz olduğunda)
const alternativeTranslation = (text, targetLanguage) => {
  // Çevrimdışı modda basit bir çeviri simülasyonu
  // Not: Gerçek bir uygulama için yerel bir çeviri kütüphanesi kullanılabilir
  
  // Bazı yaygın kelimeler için örnek çeviriler
  const simpleDictionary = {
    'tr': {
      'hello': 'merhaba',
      'world': 'dünya',
      'good': 'iyi',
      'morning': 'sabah',
      'evening': 'akşam',
      'night': 'gece',
      'thanks': 'teşekkürler',
      'please': 'lütfen',
      'yes': 'evet',
      'no': 'hayır',
      'today': 'bugün',
      'tomorrow': 'yarın',
      'yesterday': 'dün'
    },
    'en': {
      'merhaba': 'hello',
      'dünya': 'world',
      'iyi': 'good',
      'sabah': 'morning',
      'akşam': 'evening',
      'gece': 'night',
      'teşekkürler': 'thanks',
      'lütfen': 'please',
      'evet': 'yes',
      'hayır': 'no',
      'bugün': 'today',
      'yarın': 'tomorrow',
      'dün': 'yesterday'
    }
  };
  
  // Eğer desteklenen bir dil sözlüğü varsa, basit kelime çevirisi yap
  if (simpleDictionary[targetLanguage]) {
    // Metni kelimelere ayır
    const words = text.toLowerCase().split(/\s+/);
    
    // Her kelimeyi çevirmeye çalış
    const translatedWords = words.map(word => {
      const cleanWord = word.replace(/[.,!?;:'"()]/g, ''); // Noktalama işaretlerini kaldır
      const translation = simpleDictionary[targetLanguage][cleanWord];
      return translation || word; // Çeviri yoksa orijinal kelimeyi kullan
    });
    
    return translatedWords.join(' ');
  }
  
  // Sözlük yoksa veya basit çeviri yapılamıyorsa, orijinal metni döndür
  return `[${targetLanguage} Çevirisi] ${text}`;
};

// Mistral API ile çeviri fonksiyonu
const translateWithMistral = async (text, sourceLanguage, targetLanguage) => {
  try {
    await checkRateLimit();
    const prompt = `Lütfen aşağıdaki metni ${sourceLanguage} dilinden ${targetLanguage} diline çevir. Sadece çeviriyi döndür, açıklama ekleme.\n\n"${text}"`;
    const response = await axios.post(
      API_CONFIG.mistralApiEndpoint,
      {
        model: "mistral-large-latest",
        messages: [
          { role: "system", content: "Sen profesyonel bir çeviri asistanısın." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 1024
      },
      {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.mistralApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return {
        translated_text: response.data.choices[0].message.content.trim(),
        source_language: sourceLanguage,
        target_language: targetLanguage
      };
    }
    throw new Error('Mistral yanıtında çeviri bulunamadı.');
  } catch (error) {
    console.error('Mistral çeviri hatası:', error);
    throw error;
  }
};

// API Servisleri
const translateService = {
  // Metin çevirisi
  translateText: async (text, sourceLanguage, targetLanguage) => {
    try {
      // Minimum karakter kontrolü
      if (text.trim().length < API_CONFIG.minCharsForTranslation) {
        return {
          translated_text: '',
          source_language: sourceLanguage,
          target_language: targetLanguage
        };
      }
      // Önbellekteki çeviriyi kontrol et
      const cachedTranslation = getCachedTranslation(text, sourceLanguage, targetLanguage);
      if (cachedTranslation) {
        return cachedTranslation;
      }
      // Mistral API ile çeviri
      if (API_CONFIG.useMistral && API_CONFIG.mistralApiKey) {
        try {
          const mistralResult = await translateWithMistral(text, sourceLanguage, targetLanguage);
          cacheTranslation(text, sourceLanguage, targetLanguage, mistralResult);
          return mistralResult;
        } catch (mistralError) {
          console.log('Mistral çeviri hatası, offline moda geçiliyor...', mistralError);
        }
      }
      // Çevrimdışı mod kontrolü
      if (API_CONFIG.offlineMode) {
        const offlineData = translateService.getOfflineData();
        if (offlineData) {
          return {
            translated_text: `[Çevrimdışı Çeviri] ${text}`,
            source_language: sourceLanguage,
            target_language: targetLanguage
          };
        }
      }
      // Son çare: basit dictionary
      return {
        translated_text: alternativeTranslation(text, targetLanguage),
        source_language: sourceLanguage,
        target_language: targetLanguage
      };
    } catch (error) {
      console.error('Çeviri hatası:', error);
      throw error;
    }
  },
  
  // Dil algılama
  detectLanguage: async (text) => {
    try {
      // Minimum karakter kontrolü
      if (text.trim().length < API_CONFIG.minCharsForTranslation) {
        return { language: 'en' }; // Varsayılan olarak İngilizce döndür
      }
      
      // Önbellekteki dil algılama sonucunu kontrol et
      const cacheKey = `detect_${text}`;
      const cachedDetection = localStorage.getItem(cacheKey);
      if (cachedDetection) {
        return JSON.parse(cachedDetection);
      }
      
      // Mistral API ile dil algılama
      if (API_CONFIG.useMistral && API_CONFIG.mistralApiKey) {
        try {
          await checkRateLimit();
          const prompt = `Lütfen aşağıdaki metnin hangi dilde yazıldığını tespit et ve sadece dil kodunu döndür (örneğin "en", "tr", "fr", "de" vb.). Sadece dil kodunu yaz, başka açıklama ekleme.\n\n"${text}"`;
          
          const response = await axios.post(
            API_CONFIG.mistralApiEndpoint,
            {
              model: "mistral-large-latest",
              messages: [
                { role: "system", content: "Sen dil algılama uzmanısın. Yanıtlarını sadece dil kodu olarak ver (en, tr, fr, de, vb.)." },
                { role: "user", content: prompt }
              ],
              temperature: 0.1,
              max_tokens: 10
            },
            {
              headers: {
                'Authorization': `Bearer ${API_CONFIG.mistralApiKey}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (response.data && response.data.choices && response.data.choices.length > 0) {
            // Yanıttan dil kodunu çıkar (sadece 2 harfli kod almalıyız)
            const content = response.data.choices[0].message.content.trim().toLowerCase();
            const langCode = content.match(/^[a-z]{2}$/);
            
            const result = { 
              language: langCode ? langCode[0] : 'en' 
            };
            
            // Sonucu önbelleğe ekle
            localStorage.setItem(cacheKey, JSON.stringify(result));
            
            return result;
          }
        } catch (mistralError) {
          console.log('Mistral dil algılama hatası, alternatif yönteme geçiliyor...', mistralError);
        }
      }
      
      // Çevrimdışı mod veya hata durumunda basit dil algılama
      // Metinde en çok kullanılan harflere göre dil tahmini
      const turkishChars = 'çğıöşüÇĞİÖŞÜ';
      const englishChars = 'qwxQWX';
      
      let trCount = 0;
      let enCount = 0;
      
      // Türkçe ve İngilizce özel karakterleri say
      for (let i = 0; i < text.length; i++) {
        if (turkishChars.includes(text[i])) {
          trCount++;
        } else if (englishChars.includes(text[i])) {
          enCount++;
        }
      }
      
      // Sonucu belirle ve önbelleğe ekle
      const result = { language: trCount > 0 ? 'tr' : (enCount > 0 ? 'en' : 'en') };
      localStorage.setItem(cacheKey, JSON.stringify(result));
      
      return result;
    } catch (error) {
      console.error('Dil algılama hatası:', error);
      return { language: 'en' }; // Hata durumunda varsayılan olarak İngilizce döndür
    }
  },
  
  // Konuşma sentezi (Text-to-Speech)
  synthesizeSpeech: async (text, language) => {
    try {
      // Çevrimdışı mod kontrol et
      if (API_CONFIG.offlineMode) {
        // Web Speech API kullanarak tarayıcıda TTS yap
        return new Promise((resolve, reject) => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = language;
          utterance.onend = () => resolve(new Blob());
          utterance.onerror = (err) => reject(err);
          window.speechSynthesis.speak(utterance);
        });
      }
      
      // Google Text-to-Speech API kullanımı
      if (API_CONFIG.useGoogleTTS) {
        const response = await axios.post(
          `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_CONFIG.googleApiKey}`,
          {
            input: { text },
            voice: { languageCode: language },
            audioConfig: { audioEncoding: 'MP3' }
          },
          {
            responseType: 'json'
          }
        );
        
        // Base64 ses verisini Blob'a dönüştür
        const audioContent = response.data.audioContent;
        const byteCharacters = atob(audioContent);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: 'audio/mp3' });
      }
      
      // Varsayılan API kullanımı
      const response = await apiClient.post('/tts', { 
        text, 
        language,
        voice: 'standard'
      }, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Ses sentezleme hatası:', error);
      
      // Hata durumunda Web Speech API ile geri dön
      try {
        return new Promise((resolve, reject) => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = language;
          utterance.onend = () => resolve(new Blob());
          utterance.onerror = (err) => reject(err);
          window.speechSynthesis.speak(utterance);
        });
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
  },
  
  // Toplu çeviri
  bulkTranslate: async (texts, sourceLanguage, targetLanguage) => {
    try {
      // Google Translate API kullanımı
      if (API_CONFIG.useGoogleTranslate) {
        const response = await axios.post(
          getGoogleTranslateUrl(),
          {
            q: texts,
            source: sourceLanguage === 'auto' ? '' : sourceLanguage,
            target: targetLanguage,
            format: 'text'
          }
        );
        
        return {
          translations: response.data.data.translations.map(t => ({
            translated_text: t.translatedText,
            source_language: t.detectedSourceLanguage || sourceLanguage,
            target_language: targetLanguage
          }))
        };
      }
      
      // Varsayılan API kullanımı
      const response = await apiClient.post('/bulk-translate', {
        texts,
        source_language: sourceLanguage,
        target_language: targetLanguage
      });
      return response.data;
    } catch (error) {
      console.error('Toplu çeviri hatası:', error);
      throw error;
    }
  },
  
  // Alternatif çeviriler
  getAlternativeTranslations: async (text, sourceLanguage, targetLanguage) => {
    try {
      const response = await apiClient.post('/alternatives', {
        text,
        source_language: sourceLanguage,
        target_language: targetLanguage
      });
      return response.data;
    } catch (error) {
      console.error('Alternatif çeviri hatası:', error);
      throw error;
    }
  },
  
  // Çeviri geçmişi (çevrimdışı kullanım için)
  getOfflineData: () => {
    const offlineData = localStorage.getItem('translate_offline_data');
    return offlineData ? JSON.parse(offlineData) : null;
  },
  
  // Çevrimdışı veri kaydetme
  saveOfflineData: (data) => {
    localStorage.setItem('translate_offline_data', JSON.stringify(data));
  }
};

export default translateService; 