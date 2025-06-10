import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import FileUploader from './FileUploader';
import LanguageSelector from './LanguageSelector';
import { processBigDocument, saveTranslatedDocument } from '../services/documentTranslator';
import { APP_CONFIG, SUPPORTED_LANGUAGES } from '../config';

// Styled Components
const Container = styled.div`
  width: 100%;
  max-width: 980px;
`;

const ProgressContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${props => props.theme === 'dark' ? '#1e2130' : '#f9fafb'};
  border-radius: 0.5rem;
  border: 1px solid ${props => props.theme === 'dark' ? '#374151' : '#e5e7eb'};
`;

const ProgressLabel = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
  margin-bottom: 0.5rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.5rem;
  background-color: ${props => props.theme === 'dark' ? '#374151' : '#e5e7eb'};
  border-radius: 9999px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: #4F46E5;
  border-radius: 9999px;
  transition: width 0.3s ease;
`;

const ProgressDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
  margin-top: 0.5rem;
`;

const ErrorMessage = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${props => props.theme === 'dark' ? '#471c1c' : '#fee2e2'};
  color: ${props => props.theme === 'dark' ? '#fca5a5' : '#b91c1c'};
  border-radius: 0.5rem;
  font-size: 0.875rem;
`;

const WarningMessage = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${props => props.theme === 'dark' ? '#78350f' : '#fef3c7'};
  color: ${props => props.theme === 'dark' ? '#fcd34d' : '#d97706'};
  border-radius: 0.5rem;
  font-size: 0.875rem;
`;

const ResultContainer = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background-color: ${props => props.theme === 'dark' ? '#1e2130' : '#ffffff'};
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.primary ? '#4F46E5' : 'transparent'};
  color: ${props => props.primary ? '#ffffff' : (props.theme === 'dark' ? '#f3f4f6' : '#4F46E5')};
  border: ${props => props.primary ? 'none' : '1px solid #4F46E5'};
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.primary ? '#4338CA' : (props => props.theme === 'dark' ? 'rgba(79, 70, 229, 0.1)' : 'rgba(79, 70, 229, 0.1)')};
  }
  
  &:disabled {
    background-color: #9CA3AF;
    border-color: #9CA3AF;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
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

const BigDocumentProcessor = () => {
  const { theme } = useTheme();
  const [sourceLang, setSourceLang] = useState(APP_CONFIG.defaultSourceLanguage);
  const [targetLang, setTargetLang] = useState(APP_CONFIG.defaultTargetLanguage);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [progress, setProgress] = useState({
    stage: '',
    progress: 0,
    currentChunk: 0,
    totalChunks: 0
  });
  const [result, setResult] = useState(null);
  
  const handleFileLoad = async (file) => {
    try {
      setIsProcessing(true);
      setCurrentFile(file);
      setProgress({
        stage: 'starting',
        progress: 0,
        message: 'İşlem başlatılıyor...'
      });
      setResult(null);
      
      console.log(`Büyük doküman işleme başlatılıyor: ${file.name} (${Math.round(file.size / 1024)} KB)`);
      
      // Büyük dosya işleme servisi
      const translationResult = await processBigDocument(
        file,
        sourceLang,
        targetLang,
        (progressInfo) => {
          console.log('İlerleme:', progressInfo);
          setProgress(progressInfo);
        }
      );
      
      console.log('Çeviri sonucu alındı:', translationResult);
      
      // Sonucu kaydet
      setResult({
        translatedText: typeof translationResult === 'string' ? translationResult : translationResult.text,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        isHtml: translationResult.isHtml || false,
        htmlContent: translationResult.htmlContent || '',
        translatedImages: translationResult.translatedImages || []
      });
      
    } catch (error) {
      console.error('Büyük dosya işleme hatası:', error);
      setProgress({
        stage: 'error',
        error: error.message,
        progress: 100,
        message: 'Dosya işlenirken bir hata oluştu'
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDownload = (format = 'txt') => {
    if (!result) return;
    
    // Eğer HTML içerik varsa ve format html veya txt ise, HTML içeriği kullan
    const content = (result.isHtml && result.htmlContent && (format === 'html' || format === 'txt')) 
      ? result.htmlContent 
      : result.translatedText;
    
    saveTranslatedDocument(
      result.fileName,
      content,
      targetLang,
      format,
      result.isHtml
    );
  };
  
  const handleDownloadAllImages = () => {
    if (!result || !result.translatedImages || result.translatedImages.length === 0) return;
    
    result.translatedImages.forEach((item, index) => {
      if (item.translated) {
        const link = document.createElement('a');
        link.href = item.translated.data;
        link.download = `${result.fileName.split('.')[0]}_image_${index+1}_${targetLang}.png`;
        link.click();
      } else if (item.original) {
        // Çevrilmemiş olsa bile orijinal resmi indir
        const link = document.createElement('a');
        link.href = item.original.data;
        link.download = `${result.fileName.split('.')[0]}_image_${index+1}_original.png`;
        link.click();
      }
    });
  };
  
  const getProgressStageLabel = (stage) => {
    switch (stage) {
      case 'starting': return 'Başlatılıyor';
      case 'extraction': return 'Metin çıkarılıyor';
      case 'translation': return 'Çeviri yapılıyor';
      case 'images': return 'Grafikler işleniyor';
      case 'image_translation': return 'Grafikler çevriliyor';
      case 'html_translation': return 'HTML içerik ve tablolar çevriliyor';
      case 'complete': return 'Tamamlandı';
      case 'error': return 'Hata';
      case 'warning': return 'Uyarı';
      default: return 'İşleniyor';
    }
  };
  
  return (
    <Container>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ color: theme === 'dark' ? '#f3f4f6' : '#111827', marginBottom: '1rem' }}>
          Büyük Doküman Çevirisi
        </h2>
        <p style={{ color: theme === 'dark' ? '#d1d5db' : '#6b7280' }}>
          Bu özellik, 100+ sayfalık PDF ve Word belgelerini parçalara ayırıp çevirir. 
          Yüklenen doküman kısımlara ayrılır, çevrilir ve birleştirilir.
        </p>
      </div>
      
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
      
      <FileUploader 
        onFileLoad={handleFileLoad} 
        isLoading={isProcessing}
        acceptedFileTypes={['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
        bigDocument={true}
      />
      
      {progress.stage && (
        <>
          <ProgressContainer theme={theme}>
            <ProgressLabel theme={theme}>
              <strong>{getProgressStageLabel(progress.stage)}</strong>
              {progress.stage === 'translation' && progress.currentChunk && progress.totalChunks ? 
                ` - Parça ${progress.currentChunk}/${progress.totalChunks}` : 
                progress.message ? ` - ${progress.message}` : ''}
            </ProgressLabel>
            <ProgressBar theme={theme}>
              <ProgressFill style={{ width: `${progress.progress}%` }} />
            </ProgressBar>
            
            {/* İlerleme detayları */}
            {progress.stage !== 'error' && progress.stage !== 'warning' && (
              <ProgressDetails theme={theme}>
                <span>
                  {progress.currentChunk && progress.totalChunks ? 
                    `${progress.currentChunk}/${progress.totalChunks} parça` : ''}
                  {progress.currentImage && progress.totalImages ? 
                    `${progress.currentImage}/${progress.totalImages} grafik` : ''}
                </span>
                <span>{progress.progress}%</span>
              </ProgressDetails>
            )}
          </ProgressContainer>
          
          {/* Hata mesajları */}
          {progress.stage === 'error' && (
            <ErrorMessage theme={theme}>
              <strong>Hata: </strong> 
              {progress.error || 'İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.'}
              <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                Sorunu çözmek için şunları deneyebilirsiniz:
                <ul style={{ marginTop: '0.25rem', paddingLeft: '1rem' }}>
                  <li>Dosyanın doğru formatta olduğundan emin olun (PDF veya Word)</li>
                  <li>Dosya şifre korumalı ise şifreyi kaldırın</li>
                  <li>Dosya boyutunu küçültmeyi deneyin</li>
                  <li>Farklı bir dil çifti seçin</li>
                </ul>
              </p>
            </ErrorMessage>
          )}
          
          {/* Uyarı mesajları */}
          {progress.stage === 'warning' && (
            <WarningMessage theme={theme}>
              <strong>Uyarı: </strong> 
              {progress.message || 'İşlem sırasında bir uyarı oluştu.'}
            </WarningMessage>
          )}
        </>
      )}
      
      {result && (
        <ResultContainer theme={theme}>
          <h3 style={{ color: theme === 'dark' ? '#f3f4f6' : '#111827', marginTop: 0 }}>
            Çeviri Tamamlandı
          </h3>
          <p style={{ color: theme === 'dark' ? '#d1d5db' : '#6b7280' }}>
            <strong>Dosya:</strong> {result.fileName} ({Math.round(result.fileSize / 1024)} KB)
          </p>
          
          {/* Tablo ve HTML içeriği bilgisi */}
          {result.isHtml && result.htmlContent && (
            <p style={{ 
              backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
              padding: '0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem'
            }}>
              <strong>✅ HTML içerik ve tablolar korunarak çevrildi.</strong> HTML formatında indirmek için aşağıdaki "HTML olarak İndir" butonunu kullanabilirsiniz.
            </p>
          )}
          
          {/* Grafik bilgisi ve grafikler */}
          {result.translatedImages && result.translatedImages.length > 0 && (
            <>
              <p style={{ 
                backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.875rem'
              }}>
                <strong>📊 {result.translatedImages.length} grafik işlendi.</strong> {result.translatedImages.filter(img => img.translated).length} tanesi çevrildi.
                Tüm grafikleri indirmek için aşağıdaki "Grafikleri İndir" butonunu kullanabilirsiniz.
              </p>
              
              <TranslatedImages images={result.translatedImages} theme={theme} />
            </>
          )}
          
          <ButtonGroup>
            <Button 
              primary 
              theme={theme} 
              onClick={() => handleDownload('txt')}
            >
              Metin olarak İndir
            </Button>
            <Button 
              theme={theme} 
              onClick={() => handleDownload('pdf')}
            >
              PDF olarak İndir
            </Button>
            <Button 
              theme={theme} 
              onClick={() => handleDownload('docx')}
            >
              Word olarak İndir
            </Button>
            {result.isHtml && result.htmlContent && (
              <Button 
                theme={theme} 
                onClick={() => handleDownload('html')}
              >
                HTML olarak İndir
              </Button>
            )}
            {result.translatedImages && result.translatedImages.length > 0 && (
              <Button 
                theme={theme} 
                onClick={handleDownloadAllImages}
              >
                Grafikleri İndir
              </Button>
            )}
          </ButtonGroup>
        </ResultContainer>
      )}
    </Container>
  );
};

export default BigDocumentProcessor; 