// API yapılandırması
export const API_CONFIG = {
  // API anahtarları
  apiKey: process.env.REACT_APP_API_KEY || 'your-api-key-here',
  googleApiKey: process.env.REACT_APP_GOOGLE_API_KEY || 'your-google-api-key-here',
  mistralApiKey: process.env.REACT_APP_MISTRAL_API_KEY || 'your-mistral-api-key-here',
  
  // API endpoints
  baseUrl: process.env.REACT_APP_API_URL || 'https://api.translationservice.com/v1',
  mistralApiEndpoint: process.env.REACT_APP_MISTRAL_ENDPOINT || 'https://api.mistral.ai/v1/chat/completions',
  geminiApiEndpoint: process.env.REACT_APP_GEMINI_ENDPOINT || 'https://generativelanguage.googleapis.com/v1beta/models',
  geminiModel: process.env.REACT_APP_GEMINI_MODEL || 'gemini-pro',
  translateApiEndpoint: process.env.REACT_APP_TRANSLATE_ENDPOINT || 'https://api.translationservice.com/v1/translate',
  
  // API tercih ayarları
  useMistral: true,        // Mistral API kullan (öncelikli)
  useGoogleTranslate: false, // Google Translate API kullan (yedek)
  useGoogleTTS: false,     // Google Text-to-Speech API kullan
  
  // Uygulama yapılandırması
  defaultSourceLanguage: 'auto',
  defaultTargetLanguage: 'en',
  audioEnabled: true,      // Sesli okuma özelliği aktif
  maxInputLength: 5000,    // Maksimum girdi uzunluğu
  minCharsForTranslation: 3, // Çeviri için minimum karakter sayısı
  realTimeTranslation: true, // Gerçek zamanlı çeviri aktif
  
  // Önbellekleme ayarları
  cachingEnabled: true,     // Çeviri önbellekleme aktif
  cacheExpiration: 24 * 60 * 60 * 1000, // 24 saat (milisaniye)
  
  // Rate limiting ve hata işleme
  maxRetries: 3,           // Maksimum yeniden deneme sayısı
  retryDelay: 1000,        // Yeniden denemeler arası bekleme süresi (ms)
  requestTimeout: 10000,   // İstek zaman aşımı (ms)
  rateLimiting: {
    enabled: true,
    maxRequestsPerMinute: 30,
    throttleDelay: 2000
  },
  
  // Çevrimdışı mod
  offlineMode: false,
  
  // Karakter limitleri
  characterLimit: {
    free: 10000,        // Ücretsiz hesap için maksimum karakter
    premium: 1000000    // Premium hesap için maksimum karakter (1M)
  }
};

// Desteklenen diller
export const SUPPORTED_LANGUAGES = [
  { code: 'auto', name: 'Otomatik Algıla' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'en', name: 'İngilizce' },
  { code: 'de', name: 'Almanca' },
  { code: 'fr', name: 'Fransızca' },
  { code: 'es', name: 'İspanyolca' },
  { code: 'it', name: 'İtalyanca' },
  { code: 'pt', name: 'Portekizce' },
  { code: 'ru', name: 'Rusça' },
  { code: 'zh', name: 'Çince' },
  { code: 'ja', name: 'Japonca' },
  { code: 'ko', name: 'Korece' },
  { code: 'ar', name: 'Arapça' },
  { code: 'hi', name: 'Hintçe' }
]; 