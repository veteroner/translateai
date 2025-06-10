import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { SUPPORTED_LANGUAGES, APP_CONFIG } from '../config';
import translateService from '../services/api';
import LanguageSelector from './LanguageSelector';
import IconButton from './ui/IconButton';
import CharCounter from './ui/CharCounter';
import { useAuthContext } from '../context/AuthContext';
import { useTranslationHistory } from '../context/TranslationHistoryContext';
import { useDebouncedCallback } from '../hooks/useDebounce';
import { useTheme } from '../context/ThemeContext';

// Styled Components
const TranslateContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme === 'dark' ? '#1e2130' : '#ffffff'};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  overflow: hidden;
  transition: all 0.3s ease;
`;

const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background-color: ${props => props.theme === 'dark' ? '#2a2f45' : '#f3f4f6'};
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#3a3f55' : '#e5e7eb'};
`;

const LanguageControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SwapButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#3a3f55' : '#e5e7eb'};
  }
  
  svg {
    width: 20px;
    height: 20px;
    fill: ${props => props.theme === 'dark' ? '#a0a3b1' : '#6b7280'};
  }
`;

const TranslateSection = styled.div`
  display: flex;
  flex-direction: row;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TextArea = styled.div`
  flex: 1;
  padding: 0;
  position: relative;
  min-height: 200px;
  border-right: 1px solid ${props => props.theme === 'dark' ? '#3a3f55' : '#e5e7eb'};
  
  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid ${props => props.theme === 'dark' ? '#3a3f55' : '#e5e7eb'};
  }
`;

const TextInput = styled.textarea`
  width: 100%;
  height: 100%;
  min-height: 200px;
  border: none;
  padding: 20px;
  resize: none;
  font-family: inherit;
  font-size: 16px;
  background-color: ${props => props.theme === 'dark' ? '#1e2130' : '#ffffff'};
  color: ${props => props.theme === 'dark' ? '#e5e7eb' : '#111827'};
  outline: none;
  
  &::placeholder {
    color: ${props => props.theme === 'dark' ? '#6b7280' : '#9ca3af'};
  }
`;

const ResultArea = styled.div`
  flex: 1;
  padding: 20px;
  font-size: 16px;
  position: relative;
  min-height: 200px;
  background-color: ${props => props.theme === 'dark' ? '#1e2130' : '#ffffff'};
  color: ${props => props.theme === 'dark' ? '#e5e7eb' : '#111827'};
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: ${props => props.theme === 'dark' ? '#2a2f45' : '#f3f4f6'};
  border-top: 1px solid ${props => props.theme === 'dark' ? '#3a3f55' : '#e5e7eb'};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
  
  svg {
    animation: spin 1s linear infinite;
    width: 24px;
    height: 24px;
    fill: ${props => props.theme === 'dark' ? '#a0a3b1' : '#6b7280'};
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Simultane mod için büyük mikrofon ikonu
const BigMicWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 32px 0 16px 0;
  @media (max-width: 768px) {
    margin: 16px 0 8px 0;
    min-height: 180px;
  }
`;

const BigMicButton = styled.button`
  background: ${({active}) => active ? '#ef4444' : '#4F46E5'};
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  cursor: pointer;
  transition: background 0.3s;
  outline: none;
  position: relative;
  @media (max-width: 768px) {
    width: 140px;
    height: 140px;
    font-size: 72px;
  }
`;

const MobileOnly = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    text-align: center;
    font-size: 1.1rem;
    color: #6b7280;
    margin-bottom: 12px;
  }
`;

const DesktopOnly = styled.div`
  display: block;
  @media (max-width: 768px) {
    display: none;
  }
`;

const TranslateBox = ({ onTargetLangChange = null, mode, targetLangs = [], setTargetLangs }) => {
  const { user } = useAuthContext();
  const { addToHistory } = useTranslationHistory();
  const { theme } = useTheme();
  
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState(mode === 'simultaneous' ? {} : '');
  const [sourceLang, setSourceLang] = useState(APP_CONFIG.defaultSourceLanguage);
  const [targetLang, setTargetLang] = useState(APP_CONFIG.defaultTargetLanguage);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSimultaneous, setIsSimultaneous] = useState(false);
  const [lastDetectedLang, setLastDetectedLang] = useState(null);
  
  // Eğer targetLangs boşsa, varsayılan olarak İngilizce, Almanca, Fransızca ekle
  useEffect(() => {
    if (mode === 'simultaneous' && (!targetLangs || targetLangs.length === 0)) {
      setTargetLangs(['en', 'de', 'fr']);
    }
  }, [mode, targetLangs, setTargetLangs]);
  
  const textAreaRef = useRef(null);
  const resultAreaRef = useRef(null);
  const recognitionRef = useRef(null);
  
  // Gerçek zamanlı çeviri için debounce kullanımı
  const debouncedTranslate = useDebouncedCallback(async (text) => {
    // Metin boşsa veya çok kısaysa işlem yapma
    if (!text || !text.trim() || text.trim().length < 3) {
      setTranslatedText('');
      setDetectedLanguage(null);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Kaynak ve hedef dil aynıysa çeviri yapmadan aynı metni göster
      if (sourceLang !== 'auto' && sourceLang === targetLang) {
        setTranslatedText(text);
        setIsLoading(false);
        return;
      }
      
      // Önce dil algılama (source dili 'auto' ise)
      if (sourceLang === 'auto') {
        try {
          const detectResult = await translateService.detectLanguage(text);
          setDetectedLanguage(detectResult.language);
          
          // Algılanan dil hedef dil ile aynıysa çeviri yapmadan metni göster
          if (detectResult.language === targetLang) {
            setTranslatedText(text);
            setIsLoading(false);
            return;
          }
        } catch (detectError) {
          console.error('Dil algılama hatası:', detectError);
          // Algılama hatası varsa varsayılan olarak İngilizce varsayalım ama çeviriye devam edelim
          setDetectedLanguage('en');
        }
      } else {
        setDetectedLanguage(null);
      }
      
      // Çeviri yapma
      const result = await translateService.translateText(
        text,
        sourceLang === 'auto' ? (detectedLanguage || 'en') : sourceLang,
        targetLang
      );
      
      setTranslatedText(result.translated_text);
      
      // API kullanım sayısını artır
      if (user) {
        // increment count
      }
    } catch (err) {
      console.error('Çeviri hatası:', err);
      
      // Hata mesajlarını daha kullanıcı dostu hale getir
      if (err.response && err.response.status === 403) {
        setError('API erişim hatası. API anahtarınızı kontrol edin.');
      } else if (err.response && err.response.status === 429) {
        setError('Çeviri limiti aşıldı. Lütfen daha sonra tekrar deneyin.');
      } else if (err.message && err.message.includes('API anahtarı')) {
        setError('API anahtarı eksik veya geçersiz. Lütfen yapılandırma dosyasını kontrol edin.');
      } else if (err.message && err.message.includes('Network Error')) {
        setError('İnternet bağlantısı hatası. Ağ bağlantınızı kontrol edin.');
      } else if (err.message && err.message.includes('Mistral')) {
        setError('Mistral API hatası: ' + err.message);
      } else if (!navigator.onLine) {
        setError('İnternet bağlantınızı kontrol edin ve tekrar deneyin.');
      } else {
        setError('Çeviri sırasında bir hata oluştu: ' + (err.message || 'Bilinmeyen hata'));
      }
      
      setTranslatedText('');
    } finally {
      setIsLoading(false);
    }
  }, 1500); // 1.5 saniye debounce süresi
  
  // Son çeviri metni - önbelleklemek için kullanılır
  const [lastTranslatedText, setLastTranslatedText] = useState('');
  
  // Metin değiştiğinde gerçek zamanlı çeviri
  useEffect(() => {
    // Minimum karakter sayısı kontrolü
    const minCharacters = 3;
    
    // Aşağıdaki koşulların hepsi sağlanırsa çeviri yap:
    // 1. Gerçek zamanlı çeviri açık olmalı
    // 2. Metin boş olmamalı ve minimum karakter sayısını geçmeli
    // 3. Metin bir önceki çevrilen metinden farklı olmalı (tekrarlı istekleri önlemek için)
    if (APP_CONFIG.realTimeTranslation && 
        sourceText && 
        sourceText.trim().length >= minCharacters &&
        sourceText !== lastTranslatedText) {
      debouncedTranslate(sourceText);
      setLastTranslatedText(sourceText);
    }
  }, [sourceText, debouncedTranslate, lastTranslatedText]);
  
  // Metin değiştiğinde gerçek zamanlı çeviri
  useEffect(() => {
    // ... existing code ...
  }, [sourceText, sourceLang, targetLang, debouncedTranslate]);
  
  // Hedef dil değiştiğinde dışarıya bildirme
  useEffect(() => {
    if (onTargetLangChange) {
      onTargetLangChange(targetLang);
    }
  }, [targetLang, onTargetLangChange]);
  
  // Dil değişikliğinde çeviriyi tekrar yap
  useEffect(() => {
    if (APP_CONFIG.realTimeTranslation && 
        sourceText && 
        sourceText.trim().length >= 3) {
      // Aynı metin için tekrar çeviri yaparken önce son çevrilen metni sıfırla
      setLastTranslatedText('');
      debouncedTranslate(sourceText);
    }
  }, [sourceLang, targetLang, sourceText, debouncedTranslate]);
  
  // Dil değiştirme
  const handleSwapLanguages = () => {
    if (sourceLang !== 'auto') {
      const temp = sourceLang;
      setSourceLang(targetLang);
      setTargetLang(temp);
      
      // Metinleri de değiştir
      setSourceText(translatedText);
      setTranslatedText(sourceText);
    }
  };
  
  // Manuel çeviri butonu
  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    if (!APP_CONFIG.realTimeTranslation) {
      debouncedTranslate(sourceText);
    }
  };
  
  // Çeviriyi kaydet
  const handleSaveTranslation = async () => {
    if (!user || !sourceText.trim() || !translatedText.trim()) return;
    
    try {
      const translationData = {
        sourceText,
        translatedText,
        sourceLang: detectedLanguage || sourceLang,
        targetLang
      };
      
      await addToHistory(translationData);
    } catch (err) {
      console.error('Çeviri kaydetme hatası:', err);
    }
  };
  
  // Sesli okuma fonksiyonu
  const handleSpeakText = async (text, language) => {
    try {
      if (!text.trim() || !APP_CONFIG.audioEnabled) return;
      
      const audioBlob = await translateService.synthesizeSpeech(text, language);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (err) {
      console.error('Sesli okuma hatası:', err);
    }
  };
  
  // Metin kopyalama fonksiyonu
  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Kopyalama başarılı
      })
      .catch(err => {
        console.error('Metin kopyalama hatası:', err);
      });
  };
  
  // Temizleme fonksiyonu
  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
    setDetectedLanguage(null);
    setError(null);
    
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };
  
  // Sesli giriş fonksiyonu
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Tarayıcınız sesli giriş özelliğini desteklemiyor.');
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = sourceLang === 'auto' ? 'tr-TR' : sourceLang;
    recognition.continuous = false;
    recognition.interimResults = true;
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      setSourceText(transcript);
    };
    
    recognition.onerror = (event) => {
      console.error('Ses tanıma hatası:', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };
  
  // Ücretsiz LibreTranslate API ile çeviri fonksiyonu
  const libreTranslate = async (text, source, target) => {
    try {
      const res = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, source: source === 'auto' ? 'tr' : source, target, format: 'text' })
      });
      const data = await res.json();
      return data.translatedText;
    } catch (e) {
      setError('Ücretsiz çeviri servisine ulaşılamıyor.');
      return '';
    }
  };
  
  // Simultane tercüme başlat/durdur
  const handleSimultaneousTranslate = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Tarayıcınız sesli giriş özelliğini desteklemiyor.');
      return;
    }
    if (isSimultaneous) {
      setIsSimultaneous(false);
      if (recognitionRef.current) recognitionRef.current.stop();
      return;
    }
    setIsSimultaneous(true);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = sourceLang === 'auto' ? 'tr-TR' : sourceLang;
    recognition.continuous = true;
    recognition.interimResults = true;
    let lastTranscript = '';
    recognition.onresult = async (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setSourceText(transcript);
      // Algılanan dili tespit et
      let detectedLang = null;
      try {
        const detectRes = await translateService.detectLanguage(transcript);
        detectedLang = detectRes.language;
      } catch (e) {}
      // Algılanan dil değiştiyse kullanıcıya sor
      if (detectedLang && detectedLang !== lastDetectedLang) {
        setLastDetectedLang(detectedLang);
        if (setTargetLangs && window.confirm(`Algılanan dil değişti (${detectedLang}). Hedef dilleri bu dile göre güncellemek ister misiniz?`)) {
          // Önerilen hedef diller: İngilizce ise Almanca, Almanca ise İngilizce, Türkçe ise İngilizce gibi basit bir mantık
          let suggested = [];
          if (detectedLang === 'tr') suggested = ['en', 'de'];
          else if (detectedLang === 'en') suggested = ['tr', 'de'];
          else if (detectedLang === 'de') suggested = ['en', 'tr'];
          else suggested = ['en'];
          setTargetLangs(suggested);
        }
      }
      // Sadece yeni metin için çeviri yap
      if (transcript && transcript !== lastTranscript) {
        lastTranscript = transcript;
        setIsLoading(true);
        const translations = {};
        for (const lang of targetLangs) {
          translations[lang] = await libreTranslate(transcript, sourceLang, lang);
        }
        setTranslatedText(translations);
        setIsLoading(false);
        // İlk dili otomatik seslendir
        if (targetLangs.length > 0) {
          handleSpeakText(translations[targetLangs[0]], targetLangs[0]);
        }
      }
    };
    recognition.onerror = (event) => {
      setIsSimultaneous(false);
      setIsListening(false);
      setError('Simultane tercüme sırasında hata oluştu: ' + event.error);
    };
    recognition.onend = () => {
      setIsSimultaneous(false);
      setIsListening(false);
    };
    recognition.start();
  };
  
  return (
    <TranslateContainer theme={theme}>
      {/* Mobilde sade açıklama */}
      {mode === 'simultaneous' && (
        <>
          <MobileOnly>
            Simultane tercüme için mikrofona dokunun ve konuşmaya başlayın.
          </MobileOnly>
          <DesktopOnly>
            {/* Simultane modda büyük mikrofon ikonu */}
            <BigMicWrapper>
              <BigMicButton
                onClick={handleSimultaneousTranslate}
                active={isSimultaneous}
                title={isSimultaneous ? 'Simultane Çeviriyi Durdur' : 'Simultane Çeviriyi Başlat'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="12" rx="3"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                  <line x1="8" y1="22" x2="16" y2="22"/>
                </svg>
              </BigMicButton>
            </BigMicWrapper>
          </DesktopOnly>
          {/* Mobilde tam ekran büyük mikrofon */}
          <MobileOnly>
            <BigMicWrapper>
              <BigMicButton
                onClick={handleSimultaneousTranslate}
                active={isSimultaneous}
                title={isSimultaneous ? 'Simultane Çeviriyi Durdur' : 'Simultane Çeviriyi Başlat'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="12" rx="3"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                  <line x1="8" y1="22" x2="16" y2="22"/>
                </svg>
              </BigMicButton>
            </BigMicWrapper>
          </MobileOnly>
        </>
      )}
      <HeaderBar theme={theme}>
        <LanguageControls>
          <LanguageSelector
            value={sourceLang}
            onChange={setSourceLang}
            languages={SUPPORTED_LANGUAGES}
            theme={theme}
          />
          
          <SwapButton onClick={handleSwapLanguages} disabled={sourceLang === 'auto'} theme={theme}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M7.8 17.7L6.4 19.1 2 14.7 6.4 10.3 7.8 11.7 5.7 13.8 14.6 13.8 14.6 15.8 5.7 15.8 7.8 17.7zM16.2 6.3L17.6 4.9 22 9.3 17.6 13.7 16.2 12.3 18.3 10.2 9.4 10.2 9.4 8.2 18.3 8.2 16.2 6.3z" />
            </svg>
          </SwapButton>
          
          <LanguageSelector
            value={targetLang}
            onChange={setTargetLang}
            languages={SUPPORTED_LANGUAGES.filter(lang => lang.code !== 'auto')}
            theme={theme}
          />
        </LanguageControls>
        
        {mode === 'simultaneous' && (
          <div style={{display: 'none'}}>
            <LanguageSelector
              value={targetLangs}
              onChange={setTargetLangs}
              languages={SUPPORTED_LANGUAGES.filter(lang => lang.code !== 'auto')}
              theme={theme}
              multiple
              hideHighlight
            />
          </div>
        )}
      </HeaderBar>
      
      <TranslateSection>
        <TextArea theme={theme}>
          <TextInput
            ref={textAreaRef}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Çevrilecek metni yazın..."
            maxLength={APP_CONFIG.maxInputLength}
            theme={theme}
            readOnly={mode === 'simultaneous'}
          />
          
          {detectedLanguage && sourceLang === 'auto' && (
            <div style={{ position: 'absolute', bottom: 10, left: 20, fontSize: 12, color: theme === 'dark' ? '#a0a3b1' : '#6b7280' }}>
              Algılanan dil: {SUPPORTED_LANGUAGES.find(lang => lang.code === detectedLanguage)?.name || detectedLanguage}
            </div>
          )}
        </TextArea>
        
        <ResultArea theme={theme} ref={resultAreaRef}>
          {isLoading ? (
            <LoadingIndicator theme={theme}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8Z" />
              </svg>
            </LoadingIndicator>
          ) : error ? (
            <div style={{ color: '#ef4444', padding: '10px 0' }}>{error}</div>
          ) : mode === 'simultaneous' && targetLangs.length > 0 ? (
            <div>
              {targetLangs.map(lang => (
                <div key={lang} style={{marginBottom: 16, display:'flex', alignItems:'center', gap:8}}>
                  <span style={{fontWeight:600, minWidth:90}}>{SUPPORTED_LANGUAGES.find(l=>l.code===lang)?.name || lang}:</span>
                  <span style={{flex:1}}>{translatedText[lang] || 'Çeviri bekleniyor...'}</span>
                  <IconButton
                    icon="listen"
                    onClick={() => handleSpeakText(translatedText[lang], lang)}
                    disabled={
                      (mode === 'simultaneous')
                        ? (!translatedText[lang] || !APP_CONFIG.audioEnabled)
                        : (!translatedText || typeof translatedText !== 'string' || !(typeof translatedText === 'string' && translatedText.trim()) || !APP_CONFIG.audioEnabled)
                    }
                    title="Çeviriyi dinle"
                    theme={theme}
                  />
                </div>
              ))}
            </div>
          ) : (
            (typeof translatedText === 'string' && translatedText.trim()) ? translatedText : 'Çeviri burada görüntülenecek'
          )}
        </ResultArea>
      </TranslateSection>
      
      <BottomBar theme={theme}>
        <CharCounter
          current={sourceText.length}
          max={APP_CONFIG.maxInputLength}
          theme={theme}
        />
        
        <ButtonGroup>
          {mode === 'simultaneous' ? (
            <>
              <IconButton
                icon="listen"
                onClick={() => handleSpeakText(translatedText, targetLang)}
                disabled={
                  (mode === 'simultaneous')
                    ? (!translatedText[targetLangs?.[0]] || !APP_CONFIG.audioEnabled)
                    : (!translatedText || typeof translatedText !== 'string' || !(typeof translatedText === 'string' && translatedText.trim()) || !APP_CONFIG.audioEnabled)
                }
                title="Çeviriyi dinle"
                theme={theme}
              />
            </>
          ) : (
            <>
              <IconButton
                icon="microphone"
                onClick={handleVoiceInput}
                disabled={!APP_CONFIG.audioEnabled}
                title={isListening ? "Dinlemeyi Durdur" : "Sesli Giriş"}
                theme={theme}
                isActive={isListening}
              />
              
              {!APP_CONFIG.realTimeTranslation && (
                <IconButton
                  icon="translate"
                  onClick={handleTranslate}
                  disabled={!sourceText.trim() || isLoading}
                  title="Çevir"
                  theme={theme}
                />
              )}
              
              <IconButton
                icon="clear"
                onClick={handleClear}
                disabled={!sourceText.trim() && !translatedText.trim()}
                title="Temizle"
                theme={theme}
              />
              
              <IconButton
                icon="listen"
                onClick={() => handleSpeakText(sourceText, detectedLanguage || sourceLang)}
                disabled={!sourceText.trim() || !APP_CONFIG.audioEnabled}
                title="Kaynağı dinle"
                theme={theme}
              />
              
              <IconButton
                icon="copy"
                onClick={() => handleCopyText(translatedText)}
                disabled={
                  (mode === 'simultaneous')
                    ? !translatedText[targetLangs?.[0]]
                    : (!translatedText || typeof translatedText !== 'string' || !(typeof translatedText === 'string' && translatedText.trim()))
                }
                title="Çeviriyi kopyala"
                theme={theme}
              />
              
              <IconButton
                icon="save"
                onClick={handleSaveTranslation}
                disabled={
                  (mode === 'simultaneous')
                    ? (!user || !sourceText.trim() || !translatedText[targetLangs?.[0]])
                    : (!user || !sourceText.trim() || !translatedText || typeof translatedText !== 'string' || !(typeof translatedText === 'string' && translatedText.trim()))
                }
                title="Çeviriyi kaydet"
                theme={theme}
              />
            </>
          )}
        </ButtonGroup>
      </BottomBar>
    </TranslateContainer>
  );
};

export default TranslateBox; 