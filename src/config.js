// API ve Uygulama Yapılandırması
import firebaseConfig, { mistralApiKey } from './firebase-config';

// API Konfigürasyonu
export const API_CONFIG = {
  baseUrl: '',
  apiKey: mistralApiKey, // Mistral API anahtarı
  mistralApiKey: mistralApiKey,
  mistralApiEndpoint: 'https://api.mistral.ai/v1/chat/completions',
  useMistral: true,
  useGoogleTranslate: false,
  useGoogleTTS: false,
  offlineMode: true, // Firebase devre dışı bırakmak için true yapıldı
  requestTimeout: 10000, // milisaniye cinsinden
  maxRetries: 3,
  retryDelay: 1000,
  // Gemini ve Google Translate devre dışı
  useGeminiAI: false,
  geminiModel: '',
  geminiApiEndpoint: '',
  cacheExpiration: 3600000, // 1 saat (milisaniye)
  cachingEnabled: true,
  minCharsForTranslation: 3,
  rateLimiting: {
    enabled: true,
    maxRequestsPerMinute: 20,
    throttleDelay: 3000
  },
  characterLimit: {
    free: 10000000,           // 10MB'a yükseltildi
    premium: 100000000        // 100MB'a yükseltildi
  }
};

// Firebase Konfigürasyonu
export const FIREBASE_CONFIG = firebaseConfig;

// React Router gelecek özellikleri
export const ROUTER_CONFIG = {
  v7_startTransition: true,  // React Router v7 için state güncellemelerini React.startTransition içine alır
  v7_relativeSplatPath: true // React Router v7 için Splat rotalarında göreceli rota çözümlemesini değiştirir
};

// Uygulama Ayarları
export const APP_CONFIG = {
  defaultSourceLanguage: 'auto', // otomatik algılama
  defaultTargetLanguage: 'tr',   // Türkçe
  maxInputLength: 5000,          // maksimum karakter sayısı
  saveHistoryCount: 100,         // saklanacak maksimum çeviri sayısı
  defaultTheme: 'light',         // varsayılan tema
  audioEnabled: true,            // ses özellikleri aktif mi
  realTimeTranslation: true,     // gerçek zamanlı çeviri aktif mi
  offlineMode: false,            // çevrimdışı mod aktif mi
  characterLimit: {
    free: 10000000,              // Ücretsiz kullanımda limit 10MB'a yükseltildi
    premium: 100000000           // Premium kullanımda limit 100MB'a yükseltildi
  }
};

// Desteklenen Diller
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
  { code: 'ja', name: 'Japonca' },
  { code: 'zh', name: 'Çince' },
  { code: 'ar', name: 'Arapça' },
  { code: 'hi', name: 'Hintçe' },
  { code: 'ko', name: 'Korece' },
]; 