import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

// Styled Components
const PageContainer = styled.div`
  padding: 2rem 1rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
  border-bottom: 2px solid ${props => props.theme === 'dark' ? '#374151' : '#e5e7eb'};
  padding-bottom: 1rem;
`;

const PageDescription = styled.p`
  margin-bottom: 2rem;
  line-height: 1.6;
  font-size: 1.1rem;
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
`;

const Card = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px ${props => props.theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
`;

const EndpointTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Method = styled.span`
  background-color: ${props => {
    if (props.method === 'GET') return props.theme === 'dark' ? '#0e7490' : '#06b6d4';
    if (props.method === 'POST') return props.theme === 'dark' ? '#0e9f6e' : '#10b981';
    if (props.method === 'PUT') return props.theme === 'dark' ? '#7e3af2' : '#8b5cf6';
    if (props.method === 'DELETE') return props.theme === 'dark' ? '#e11d48' : '#f43f5e';
    return props.theme === 'dark' ? '#4b5563' : '#9ca3af';
  }};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
`;

const Description = styled.p`
  margin-bottom: 1rem;
  line-height: 1.5;
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
`;

const Th = styled.th`
  padding: 0.75rem;
  text-align: left;
  background-color: ${props => props.theme === 'dark' ? '#374151' : '#f3f4f6'};
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#4b5563' : '#e5e7eb'};
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#4b5563' : '#e5e7eb'};
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
`;

const CodeBlock = styled.pre`
  background-color: ${props => props.theme === 'dark' ? '#111827' : '#f3f4f6'};
  color: ${props => props.theme === 'dark' ? '#e5e7eb' : '#1f2937'};
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`;

const Code = styled.code`
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  background-color: ${props => props.theme === 'dark' ? '#374151' : '#e5e7eb'};
  color: ${props => props.theme === 'dark' ? '#e5e7eb' : '#1f2937'};
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
`;

const Button = styled.button`
  background-color: ${props => props.theme === 'dark' ? '#3b82f6' : '#2563eb'};
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#2563eb' : '#1d4ed8'};
  }
`;

const ApiPage = () => {
  const { theme } = useTheme();

  return (
    <PageContainer>
      <PageTitle theme={theme}>Teknova API</PageTitle>
      
      <PageDescription theme={theme}>
        Teknova API, çeviri işlemlerinizi kendi uygulamalarınıza ve sistemlerinize entegre etmenizi sağlar. 
        REST mimarisi üzerine kurulu olan API'miz, basit ve kullanımı kolay bir arayüz sunar.
      </PageDescription>
      
      <Button theme={theme}>API Anahtarı Oluştur</Button>
      
      <SectionTitle theme={theme}>Hızlı Başlangıç</SectionTitle>
      
      <Card theme={theme}>
        <Description theme={theme}>
          API'yi kullanmaya başlamak için aşağıdaki adımları izleyin:
        </Description>
        
        <ol>
          <li><Description theme={theme}>Teknova hesabınıza giriş yapın ve API anahtarınızı oluşturun.</Description></li>
          <li><Description theme={theme}>API anahtarınızı her istekte <Code theme={theme}>X-API-KEY</Code> başlığında gönderin.</Description></li>
          <li><Description theme={theme}>İstekleri yapmak için aşağıdaki endpoint'leri kullanın.</Description></li>
        </ol>
        
        <CodeBlock theme={theme}>
{`// Örnek API isteği (JavaScript)
const translateText = async (text, sourceLang, targetLang) => {
  const response = await fetch('https://api.teknova.com.tr/v1/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': 'YOUR_API_KEY'
    },
    body: JSON.stringify({
      text: text,
      source_lang: sourceLang,
      target_lang: targetLang
    })
  });
  
  return await response.json();
};`}
        </CodeBlock>
      </Card>
      
      <SectionTitle theme={theme}>Endpoint'ler</SectionTitle>
      
      <Card theme={theme}>
        <EndpointTitle theme={theme}>
          <Method theme={theme} method="POST">POST</Method>
          /v1/translate
        </EndpointTitle>
        
        <Description theme={theme}>
          Metin çevirisi yapmak için kullanılır. Kaynak dili ve hedef dili belirlemeniz gerekir.
        </Description>
        
        <Table>
          <thead>
            <tr>
              <Th theme={theme}>Parametre</Th>
              <Th theme={theme}>Tip</Th>
              <Th theme={theme}>Açıklama</Th>
              <Th theme={theme}>Zorunlu</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td theme={theme}>text</Td>
              <Td theme={theme}>string</Td>
              <Td theme={theme}>Çevrilecek metin</Td>
              <Td theme={theme}>Evet</Td>
            </tr>
            <tr>
              <Td theme={theme}>source_lang</Td>
              <Td theme={theme}>string</Td>
              <Td theme={theme}>Kaynak dil kodu (örn. 'en', 'tr', veya 'auto' otomatik algılama için)</Td>
              <Td theme={theme}>Evet</Td>
            </tr>
            <tr>
              <Td theme={theme}>target_lang</Td>
              <Td theme={theme}>string</Td>
              <Td theme={theme}>Hedef dil kodu (örn. 'en', 'tr')</Td>
              <Td theme={theme}>Evet</Td>
            </tr>
          </tbody>
        </Table>
        
        <CodeBlock theme={theme}>
{`// İstek örneği
{
  "text": "Hello, how are you?",
  "source_lang": "en",
  "target_lang": "tr"
}

// Yanıt örneği
{
  "success": true,
  "translated_text": "Merhaba, nasılsın?",
  "detected_language": "en",
  "characters": 19
}`}
        </CodeBlock>
      </Card>
      
      <Card theme={theme}>
        <EndpointTitle theme={theme}>
          <Method theme={theme} method="POST">POST</Method>
          /v1/detect
        </EndpointTitle>
        
        <Description theme={theme}>
          Metnin dilini otomatik olarak algılamak için kullanılır.
        </Description>
        
        <Table>
          <thead>
            <tr>
              <Th theme={theme}>Parametre</Th>
              <Th theme={theme}>Tip</Th>
              <Th theme={theme}>Açıklama</Th>
              <Th theme={theme}>Zorunlu</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td theme={theme}>text</Td>
              <Td theme={theme}>string</Td>
              <Td theme={theme}>Dili algılanacak metin</Td>
              <Td theme={theme}>Evet</Td>
            </tr>
          </tbody>
        </Table>
        
        <CodeBlock theme={theme}>
{`// İstek örneği
{
  "text": "Hello, how are you?"
}

// Yanıt örneği
{
  "success": true,
  "language": "en",
  "confidence": 0.95
}`}
        </CodeBlock>
      </Card>
      
      <Card theme={theme}>
        <EndpointTitle theme={theme}>
          <Method theme={theme} method="POST">POST</Method>
          /v1/document
        </EndpointTitle>
        
        <Description theme={theme}>
          Belge çevirisi için kullanılır. Desteklenen dosya formatları: PDF, DOCX, PPTX.
        </Description>
        
        <Description theme={theme}>
          Not: Bu endpoint multipart/form-data formatını kullanır.
        </Description>
        
        <Table>
          <thead>
            <tr>
              <Th theme={theme}>Parametre</Th>
              <Th theme={theme}>Tip</Th>
              <Th theme={theme}>Açıklama</Th>
              <Th theme={theme}>Zorunlu</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td theme={theme}>file</Td>
              <Td theme={theme}>file</Td>
              <Td theme={theme}>Çevrilecek dosya</Td>
              <Td theme={theme}>Evet</Td>
            </tr>
            <tr>
              <Td theme={theme}>source_lang</Td>
              <Td theme={theme}>string</Td>
              <Td theme={theme}>Kaynak dil kodu (örn. 'en', 'tr', veya 'auto')</Td>
              <Td theme={theme}>Evet</Td>
            </tr>
            <tr>
              <Td theme={theme}>target_lang</Td>
              <Td theme={theme}>string</Td>
              <Td theme={theme}>Hedef dil kodu (örn. 'en', 'tr')</Td>
              <Td theme={theme}>Evet</Td>
            </tr>
          </tbody>
        </Table>
        
        <CodeBlock theme={theme}>
{`// Yanıt örneği
{
  "success": true,
  "job_id": "doc_job_12345",
  "status": "processing",
  "estimated_completion_time": "60"  // saniye cinsinden
}`}
        </CodeBlock>
      </Card>
      
      <Card theme={theme}>
        <EndpointTitle theme={theme}>
          <Method theme={theme} method="GET">GET</Method>
          /v1/document/status/:job_id
        </EndpointTitle>
        
        <Description theme={theme}>
          Belge çevirisi işinin durumunu kontrol etmek için kullanılır.
        </Description>
        
        <Table>
          <thead>
            <tr>
              <Th theme={theme}>Parametre</Th>
              <Th theme={theme}>Tip</Th>
              <Th theme={theme}>Açıklama</Th>
              <Th theme={theme}>Zorunlu</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td theme={theme}>job_id</Td>
              <Td theme={theme}>string</Td>
              <Td theme={theme}>Belge çevirisi işinin ID'si</Td>
              <Td theme={theme}>Evet</Td>
            </tr>
          </tbody>
        </Table>
        
        <CodeBlock theme={theme}>
{`// Yanıt örneği (işlem devam ediyor)
{
  "success": true,
  "job_id": "doc_job_12345",
  "status": "processing",
  "progress": 45,  // yüzde cinsinden
  "estimated_completion_time": "30"  // saniye cinsinden
}

// Yanıt örneği (işlem tamamlandı)
{
  "success": true,
  "job_id": "doc_job_12345",
  "status": "completed",
  "download_url": "https://api.teknova.com.tr/v1/document/download/doc_job_12345",
  "expires_at": "2024-06-10T15:30:00Z"  // İndirme URL'sinin son kullanma tarihi
}`}
        </CodeBlock>
      </Card>
      
      <SectionTitle theme={theme}>Hata Kodları</SectionTitle>
      
      <Card theme={theme}>
        <Table>
          <thead>
            <tr>
              <Th theme={theme}>Kod</Th>
              <Th theme={theme}>Mesaj</Th>
              <Th theme={theme}>Açıklama</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td theme={theme}>400</Td>
              <Td theme={theme}>Bad Request</Td>
              <Td theme={theme}>İstek formatı geçersiz veya eksik parametre</Td>
            </tr>
            <tr>
              <Td theme={theme}>401</Td>
              <Td theme={theme}>Unauthorized</Td>
              <Td theme={theme}>API anahtarı geçersiz veya eksik</Td>
            </tr>
            <tr>
              <Td theme={theme}>404</Td>
              <Td theme={theme}>Not Found</Td>
              <Td theme={theme}>İstenen kaynak bulunamadı</Td>
            </tr>
            <tr>
              <Td theme={theme}>413</Td>
              <Td theme={theme}>Payload Too Large</Td>
              <Td theme={theme}>Çevrilecek metin veya dosya çok büyük</Td>
            </tr>
            <tr>
              <Td theme={theme}>429</Td>
              <Td theme={theme}>Too Many Requests</Td>
              <Td theme={theme}>API kullanım limiti aşıldı</Td>
            </tr>
            <tr>
              <Td theme={theme}>500</Td>
              <Td theme={theme}>Internal Server Error</Td>
              <Td theme={theme}>Sunucu hatası</Td>
            </tr>
          </tbody>
        </Table>
        
        <CodeBlock theme={theme}>
{`// Hata yanıtı örneği
{
  "success": false,
  "error": {
    "code": 401,
    "message": "Invalid API key"
  }
}`}
        </CodeBlock>
      </Card>
      
      <SectionTitle theme={theme}>Kullanım Limitleri</SectionTitle>
      
      <Card theme={theme}>
        <Table>
          <thead>
            <tr>
              <Th theme={theme}>Plan</Th>
              <Th theme={theme}>Dakikada İstek</Th>
              <Th theme={theme}>Günlük Karakter</Th>
              <Th theme={theme}>Aylık Belge</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td theme={theme}>Ücretsiz</Td>
              <Td theme={theme}>10</Td>
              <Td theme={theme}>5.000</Td>
              <Td theme={theme}>3</Td>
            </tr>
            <tr>
              <Td theme={theme}>Premium</Td>
              <Td theme={theme}>60</Td>
              <Td theme={theme}>Sınırsız</Td>
              <Td theme={theme}>Sınırsız</Td>
            </tr>
            <tr>
              <Td theme={theme}>Kurumsal</Td>
              <Td theme={theme}>Özel</Td>
              <Td theme={theme}>Özel</Td>
              <Td theme={theme}>Özel</Td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </PageContainer>
  );
};

export default ApiPage; 