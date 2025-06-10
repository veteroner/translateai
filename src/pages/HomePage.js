import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TranslateBox from '../components/TranslateBox';
import FileUploader from '../components/FileUploader';
import BigDocumentProcessor from '../components/BigDocumentProcessor';
import { useTheme } from '../context/ThemeContext';
import { 
  extractTextFromFile, 
  saveTranslatedDocument, 
  translateHtmlContent,
  translateDocumentImages
} from '../services/documentTranslator';
import translateService from '../services/api';
import { APP_CONFIG, SUPPORTED_LANGUAGES } from '../config';
import LanguageSelector from '../components/LanguageSelector';
import imageTranslator from '../services/imageTranslator';

// Styled Components
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 1rem 0;
`;

const WelcomeSection = styled.section`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  line-height: 1.75;
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#6b7280'};
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 980px;
  margin-bottom: 1rem;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.active 
    ? (props.theme === 'dark' ? '#4F46E5' : '#4338CA') 
    : 'transparent'};
  color: ${props => props.active 
    ? '#ffffff' 
    : (props.theme === 'dark' ? '#d1d5db' : '#6b7280')};
  border: none;
  border-radius: 0.5rem 0.5rem 0 0;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active 
      ? (props.theme === 'dark' ? '#4F46E5' : '#4338CA') 
      : (props.theme === 'dark' ? '#2a2f45' : '#f3f4f6')};
  }
`;

const DocumentResult = styled.div`
  width: 100%;
  max-width: 980px;
  background-color: ${props => props.theme === 'dark' ? '#1e2130' : '#ffffff'};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-top: 1rem;
  
  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
  }
  
  p {
    margin-bottom: 1rem;
    color: ${props => props.theme === 'dark' ? '#d1d5db' : '#6b7280'};
  }
`;

const ResultButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.primary ? '#4F46E5' : 'transparent'};
  color: ${props => props.primary ? '#ffffff' : (props.theme === 'dark' ? '#f3f4f6' : '#4F46E5')};
  border: ${props => props.primary ? 'none' : '1px solid #4F46E5'};
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.primary ? '#4338CA' : (props.theme === 'dark' ? 'rgba(79, 70, 229, 0.1)' : 'rgba(79, 70, 229, 0.1)')};
  }
  
  &:disabled {
    background-color: #9CA3AF;
    border-color: #9CA3AF;
    cursor: not-allowed;
  }
`;

// Çevrilen görüntüler bileşeni
const TranslatedImages = ({ images, theme }) => {
  if (!images || images.length === 0) return null;
  
  return (
    <div style={{ marginTop: '1rem' }}>
      <h4 style={{ color: theme === 'dark' ? '#f3f4f6' : '#111827' }}>
        Grafikler ({images.length})
      </h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
        {images.map((item, index) => (
          <div key={index} style={{ 
            border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
            borderRadius: '0.5rem',
            padding: '0.5rem',
            width: '300px'
          }}>
            <p style={{ 
              fontSize: '0.875rem', 
              marginBottom: '0.5rem',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280'
            }}>
              Grafik {index + 1} {item.translated ? '(Çevrildi)' : '(Orijinal)'}
            </p>
            <img 
              src={item.translated ? item.translated.data : item.original.data} 
              alt={item.translated ? item.translated.altText : item.original.altText || `Grafik ${index + 1}`} 
              style={{ 
                maxWidth: '100%', 
                border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}` 
              }} 
            />
            
            {item.translated && (
              <>
                <p style={{ 
                  fontSize: '0.75rem', 
                  marginTop: '0.5rem',
                  color: theme === 'dark' ? '#9ca3af' : '#6b7280'
                }}>
                  <strong>Orijinal metin:</strong> {item.translated.originalText}
                </p>
                <p style={{ 
                  fontSize: '0.75rem', 
                  marginTop: '0.25rem',
                  color: theme === 'dark' ? '#d1d5db' : '#4b5563'
                }}>
                  <strong>Çevrilen metin:</strong> {item.translated.translatedText}
                </p>
              </>
            )}
            
            {!item.translated && item.error && (
              <p style={{ 
                fontSize: '0.75rem', 
                marginTop: '0.5rem',
                color: theme === 'dark' ? '#ef4444' : '#dc2626'
              }}>
                <strong>Hata:</strong> {item.error}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('text'); // 'text', 'document', 'bigdocument', veya 'simultaneous'
  const [isProcessingDocument, setIsProcessingDocument] = useState(false);
  const [documentResult, setDocumentResult] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [sourceLang, setSourceLang] = useState(APP_CONFIG.defaultSourceLanguage);
  const [targetLang, setTargetLang] = useState(APP_CONFIG.defaultTargetLanguage);
  const [targetLangs, setTargetLangs] = useState([APP_CONFIG.defaultTargetLanguage]);
  const [imageProgress, setImageProgress] = useState(null);
  const [ocrStatus, setOcrStatus] = useState(null);
  
  // Sayfa yüklendiğinde OCR sistemini test et
  useEffect(() => {
    async function checkOcrSystem() {
      try {
        console.log('OCR sistem testi başlatılıyor...');
        setOcrStatus({ status: 'testing', message: 'OCR sistemi test ediliyor...' });
        
        // Tesseract desteğini kontrol et
        const isSupported = imageTranslator.checkTesseractSupport();
        
        if (!isSupported) {
          console.error('Tesseract.js desteği bulunamadı!');
          setOcrStatus({ 
            status: 'error',
            error: 'Tesseract.js kütüphanesi yüklenemedi. Grafik çevirisi kullanılamayacak.'
          });
          return;
        }
        
        // OCR işlevselliğini test et
        const testResult = await imageTranslator.checkOperation();
        
        if (testResult.success) {
          console.log('OCR testi başarılı:', testResult);
          setOcrStatus({ 
            status: 'success', 
            message: 'Grafik çevirisi kullanılabilir'
          });
        } else {
          console.error('OCR testi başarısız:', testResult);
          setOcrStatus({ 
            status: 'error',
            error: `OCR sistemi çalışmıyor: ${testResult.error}`
          });
        }
      } catch (error) {
        console.error('OCR test hatası:', error);
        setOcrStatus({ 
          status: 'error',
          error: `OCR test hatası: ${error.message}`
        });
      }
    }
    
    checkOcrSystem();
  }, []);
  
  // Dosya yüklendiğinde çalışacak işlev
  const handleFileLoad = async (file) => {
    try {
      setIsProcessingDocument(true);
      setDocumentResult(null);
      setImageProgress(null);
      setCurrentFile(file);
      
      console.log('Dosya işleniyor:', file.name, file.type, Math.round(file.size / 1024), 'KB');
      
      // Dosyadan metin çıkarma (artık HTML desteği ile)
      const extractionResult = await extractTextFromFile(file);
      
      let translatedContent = '';
      let translatedImages = [];
      
      // Eğer HTML içerik varsa, tablo yapısını koruyan çeviri yap
      if (extractionResult.isHtml && extractionResult.htmlContent) {
        console.log('HTML içerik algılandı, tablo yapısı korunarak çevriliyor...');
        // HTML içeriğini çevir (tablo yapısını koruyarak)
        translatedContent = await translateHtmlContent(
          extractionResult.htmlContent,
          sourceLang,
          targetLang
        );
        
        // OCR sistemi çalışıyor mu kontrol et
        if (ocrStatus && ocrStatus.status === 'success') {
          // Belgedeki resimleri çevir
          console.log('Belgedeki grafikler çevriliyor...');
          setImageProgress({ stage: 'starting', message: 'Grafikler işleniyor...' });
          
          try {
            const imageResult = await translateDocumentImages(
              file,
              sourceLang,
              targetLang,
              (progress) => {
                console.log('Grafik çevirme ilerleme:', progress);
                setImageProgress(progress);
              }
            );
            
            if (imageResult && imageResult.translatedImages) {
              translatedImages = imageResult.translatedImages;
              console.log(`${translatedImages.length} grafik işlendi, çevrilen:`, 
                translatedImages.filter(img => img.translated).length);
              
              // Hiç çevrilen grafik yoksa uyarı göster
              if (translatedImages.length > 0 && translatedImages.filter(img => img.translated).length === 0) {
                setImageProgress({ 
                  stage: 'warning', 
                  message: 'Grafiklerde çevrilecek metin bulunamadı veya tanınamadı.'
                });
              }
            } else {
              console.log('Grafik işleme sonucu bulunamadı veya boş');
              setImageProgress({ 
                stage: 'warning', 
                message: 'Belgede işlenebilir grafik bulunamadı.'
              });
            }
          } catch (imageError) {
            console.error('Grafik çevirme hatası:', imageError);
            setImageProgress({ 
              stage: 'error', 
              error: imageError.message,
              message: 'Grafikler çevrilirken hata oluştu'
            });
          }
        } else {
          console.log('OCR sistemi hazır değil, grafik çevirisi atlanıyor');
          setImageProgress({ 
            stage: 'error', 
            error: ocrStatus?.error || 'OCR sistemi kullanılamıyor',
            message: 'Grafik çevirisi kullanılamıyor'
          });
        }
      } else {
        console.log('Düz metin çevirisi yapılıyor...');
        // Düz metin çevirisi
        const result = await translateService.translateText(
          extractionResult.text,
          sourceLang,
          targetLang
        );
        translatedContent = result.translated_text;
      }
      
      // Sonucu kaydetme
      console.log('Çeviri tamamlandı, sonuçlar kaydediliyor...');
      setDocumentResult({
        originalText: extractionResult.isHtml ? extractionResult.htmlContent : extractionResult.text,
        translatedText: translatedContent,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        isHtml: extractionResult.isHtml,
        translatedImages: translatedImages
      });
      
      // Grafik çevirme tamamlandı
      if (!imageProgress || imageProgress.stage !== 'error') {
        setImageProgress({ stage: 'complete', progress: 100, message: 'İşlem tamamlandı' });
      }
      
    } catch (error) {
      console.error('Dosya işleme hatası:', error);
      // Hata mesajı gösterilebilir
    } finally {
      setIsProcessingDocument(false);
    }
  };
  
  // Çevrilen belgeyi indirme
  const handleDownloadTranslation = (format = 'txt') => {
    if (!documentResult) return;
    
    saveTranslatedDocument(
      documentResult.fileName,
      documentResult.translatedText,
      targetLang,
      format,
      documentResult.isHtml
    );
  };

  // Tüm çevrilmiş resimleri indirme
  const handleDownloadAllImages = () => {
    if (!documentResult || !documentResult.translatedImages) return;
    
    documentResult.translatedImages.forEach((item, index) => {
      if (item.translated) {
        const link = document.createElement('a');
        link.href = item.translated.data;
        link.download = `${documentResult.fileName.split('.')[0]}_image_${index+1}_${targetLang}.png`;
        link.click();
      }
    });
  };
  
  // Grafik çevirme ilerleme bilgisini göster
  const GraphicProgress = ({ progress, theme }) => {
    if (!progress) return null;
    
    // Hata durumu
    if (progress.stage === 'error') {
      return (
        <div style={{ 
          padding: '0.5rem', 
          marginTop: '1rem',
          backgroundColor: theme === 'dark' ? '#471c1c' : '#fee2e2',
          color: theme === 'dark' ? '#fca5a5' : '#b91c1c',
          borderRadius: '0.375rem'
        }}>
          <p style={{ fontWeight: 'bold' }}>Grafik işleme hatası</p>
          <p style={{ fontSize: '0.875rem' }}>{progress.message || progress.error}</p>
        </div>
      );
    }
    
    // İlerleme durumu
    return (
      <div style={{ marginTop: '1rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <span style={{ 
            fontSize: '0.875rem',
            color: theme === 'dark' ? '#d1d5db' : '#6b7280'
          }}>
            {progress.message || `Grafikler işleniyor: ${progress.stage}`}
          </span>
          <span style={{ 
            fontSize: '0.875rem',
            color: theme === 'dark' ? '#d1d5db' : '#6b7280'
          }}>
            {progress.progress ? `${progress.progress}%` : ''}
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '0.5rem',
          backgroundColor: theme === 'dark' ? '#374151' : '#e5e7eb',
          borderRadius: '0.25rem',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress.progress || 0}%`,
            height: '100%',
            backgroundColor: '#4F46E5',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>
    );
  };

  // OCR durum bileşeni
  const OcrStatusIndicator = ({ status, theme }) => {
    if (!status) return null;
    
    const getStatusColor = () => {
      switch (status.status) {
        case 'success': return { bg: theme === 'dark' ? '#064e3b' : '#d1fae5', text: theme === 'dark' ? '#6ee7b7' : '#047857' };
        case 'error': return { bg: theme === 'dark' ? '#7f1d1d' : '#fee2e2', text: theme === 'dark' ? '#fca5a5' : '#dc2626' };
        case 'warning': return { bg: theme === 'dark' ? '#78350f' : '#fef3c7', text: theme === 'dark' ? '#fcd34d' : '#d97706' };
        default: return { bg: theme === 'dark' ? '#1e3a8a' : '#dbeafe', text: theme === 'dark' ? '#93c5fd' : '#2563eb' };
      }
    };
    
    const colors = getStatusColor();
    
    // OCR sistemini yeniden başlat
    const handleRetryOcr = async () => {
      try {
        console.log('OCR sistemi yeniden başlatılıyor...');
        setOcrStatus({ status: 'testing', message: 'OCR sistemi yeniden başlatılıyor...' });
        
        const testResult = await imageTranslator.checkOperation();
        
        if (testResult.success) {
          console.log('OCR testi başarılı:', testResult);
          setOcrStatus({ 
            status: 'success', 
            message: 'Grafik çevirisi kullanılabilir'
          });
        } else {
          console.error('OCR testi başarısız:', testResult);
          setOcrStatus({ 
            status: 'error',
            error: `OCR sistemi çalışmıyor: ${testResult.error}`
          });
        }
      } catch (error) {
        console.error('OCR yeniden başlatma hatası:', error);
        setOcrStatus({ 
          status: 'error',
          error: `OCR başlatma hatası: ${error.message}`
        });
      }
    };
    
    return (
      <div style={{ 
        padding: '0.5rem 1rem',
        marginBottom: '1rem',
        backgroundColor: colors.bg,
        color: colors.text,
        borderRadius: '0.375rem',
        fontSize: '0.875rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>
          {status.status === 'error' ? (
            <>⚠️ {status.error || 'OCR sistemi kullanılamıyor'}</>
          ) : status.status === 'testing' ? (
            <>⏳ {status.message || 'OCR sistemi test ediliyor...'}</>
          ) : status.status === 'success' ? (
            <>✅ {status.message || 'OCR sistemi hazır'}</>
          ) : (
            <>{status.message || 'OCR durumu'}</>
          )}
        </span>
        
        {(status.status === 'error' || status.status === 'warning') && (
          <button 
            onClick={handleRetryOcr}
            style={{
              background: 'none',
              border: `1px solid ${colors.text}`,
              color: colors.text,
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            Yeniden Dene
          </button>
        )}
      </div>
    );
  };

  return (
    <HomeContainer>
      <WelcomeSection>
        <Title theme={theme}>Yapay Zeka Destekli Çeviri</Title>
        <Subtitle theme={theme}>
          TranslateAI, gelişmiş yapay zeka algoritmaları ile doğal ve akıcı çeviriler sunar.
          Metinlerinizi ve belgelerinizi anında çevirin, sesli dinleyin ve çeviri geçmişinizi kaydedin.
        </Subtitle>
      </WelcomeSection>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'text'} 
          theme={theme}
          onClick={() => setActiveTab('text')}
        >
          Metin Çeviri
        </Tab>
        <Tab 
          active={activeTab === 'document'} 
          theme={theme}
          onClick={() => setActiveTab('document')}
        >
          Belge Çeviri
        </Tab>
        <Tab
          active={activeTab === 'bigdocument'}
          theme={theme}
          onClick={() => setActiveTab('bigdocument')}
        >
          Büyük Dokümanlar (100+ Sayfa)
        </Tab>
        <Tab
          active={activeTab === 'simultaneous'}
          theme={theme}
          onClick={() => setActiveTab('simultaneous')}
        >
          Simultane Tercüme
        </Tab>
      </TabsContainer>
      
      {activeTab === 'text' ? (
        <TranslateBox onTargetLangChange={setTargetLang} />
      ) : activeTab === 'document' ? (
        <>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', justifyContent: 'center' }}>
            <LanguageSelector
              value={sourceLang}
              onChange={setSourceLang}
              languages={SUPPORTED_LANGUAGES}
              theme={theme}
            />
            <span style={{ alignSelf: 'center', fontSize: 20 }}>⇄</span>
            <LanguageSelector
              value={targetLang}
              onChange={setTargetLang}
              languages={SUPPORTED_LANGUAGES.filter(lang => lang.code !== 'auto')}
              theme={theme}
            />
          </div>
          
          {/* OCR Durum Göstergesi */}
          <div style={{ width: '100%', maxWidth: '980px' }}>
            <OcrStatusIndicator status={ocrStatus} theme={theme} />
          </div>
          
          <FileUploader onFileLoad={handleFileLoad} isLoading={isProcessingDocument} />
          
          {/* Grafik çevirme ilerleme bilgisi */}
          {imageProgress && (
            <div style={{ width: '100%', maxWidth: '980px' }}>
              <GraphicProgress progress={imageProgress} theme={theme} />
            </div>
          )}
          
          {documentResult && (
            <DocumentResult theme={theme}>
              <h3>Dosya İşleme Sonucu</h3>
              <p>
                <strong>Dosya:</strong> {documentResult.fileName} ({Math.round(documentResult.fileSize / 1024)} KB)
              </p>
              <p>
                <strong>Çıkarılan metin uzunluğu:</strong> {documentResult.originalText.length} karakter
              </p>
              <p>
                <strong>Çevrilen metin uzunluğu:</strong> {documentResult.translatedText.length} karakter
              </p>
              
              {/* Debug bilgisi - çevrilen resimlerin bilgilerini göster */}
              {documentResult.translatedImages && documentResult.translatedImages.length > 0 && (
                <div style={{ 
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#f3f4f6',
                  padding: '0.5rem',
                  marginBottom: '1rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}>
                  <p style={{ margin: '0 0 0.5rem 0' }}>
                    <strong>Grafik işleme detayları:</strong> Toplam {documentResult.translatedImages.length} grafik bulundu, 
                    {documentResult.translatedImages.filter(img => img.translated).length} tanesi çevrildi.
                  </p>
                  {documentResult.translatedImages.map((img, idx) => (
                    <div key={idx} style={{ marginBottom: '0.25rem' }}>
                      Grafik {idx+1}: {img.translated ? '✅ Çevrildi' : '❌ Çevrilemedi'} 
                      {img.error && ` (Hata: ${img.error})`}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Çevrilen resimleri göster */}
              {documentResult.translatedImages && documentResult.translatedImages.length > 0 && (
                <TranslatedImages images={documentResult.translatedImages} theme={theme} />
              )}
              
              <ResultButtons>
                <Button 
                  primary 
                  theme={theme} 
                  onClick={() => handleDownloadTranslation('txt')}
                >
                  TXT olarak İndir
                </Button>
                <Button 
                  secondary 
                  theme={theme} 
                  onClick={() => handleDownloadTranslation('pdf')}
                >
                  PDF olarak İndir
                </Button>
                <Button 
                  secondary 
                  theme={theme} 
                  onClick={() => handleDownloadTranslation('docx')}
                >
                  Word olarak İndir
                </Button>
                <Button 
                  secondary 
                  theme={theme} 
                  onClick={() => handleDownloadTranslation('pptx')}
                >
                  HTML Sunum olarak İndir
                </Button>
                {documentResult.translatedImages && documentResult.translatedImages.length > 0 && (
                  <Button 
                    secondary 
                    theme={theme} 
                    onClick={() => handleDownloadAllImages()}
                  >
                    Tüm Grafikleri İndir
                  </Button>
                )}
              </ResultButtons>
            </DocumentResult>
          )}
        </>
      ) : activeTab === 'bigdocument' ? (
        <BigDocumentProcessor />
      ) : (
        <div style={{width: '100%', maxWidth: 980}}>
          <h2 style={{textAlign: 'center', marginBottom: 16}}>Simultane Tercüme</h2>
          <p style={{textAlign: 'center', marginBottom: 24, color: theme === 'dark' ? '#d1d5db' : '#6b7280'}}>
            Bu modda konuşmanızı anında çevirip sesli olarak dinleyebilirsiniz. Başlatmak için aşağıdaki mikrofon butonunu kullanın.
          </p>
          <TranslateBox onTargetLangChange={setTargetLang} mode="simultaneous" targetLangs={targetLangs} setTargetLangs={setTargetLangs} />
        </div>
      )}
    </HomeContainer>
  );
};

export default HomePage; 