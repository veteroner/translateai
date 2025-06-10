import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

// Styled Components
const PageContainer = styled.div`
  padding: 2rem 1rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
  border-bottom: 2px solid ${props => props.theme === 'dark' ? '#374151' : '#e5e7eb'};
  padding-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
`;

const Paragraph = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-size: 1.1rem;
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#374151'};
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const FeatureCard = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px ${props => props.theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
  line-height: 1.5;
`;

const CaseStudySection = styled.div`
  margin: 3rem 0;
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px ${props => props.theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
`;

const CaseStudyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const CaseStudyCard = styled.div`
  border: 1px solid ${props => props.theme === 'dark' ? '#374151' : '#e5e7eb'};
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const CaseStudyTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
`;

const CaseStudyCompany = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
  margin-bottom: 1rem;
`;

const CaseStudyDescription = styled.p`
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const CaseStudyResults = styled.div`
  font-weight: 600;
  color: ${props => props.theme === 'dark' ? '#60a5fa' : '#2563eb'};
`;

const PricingSection = styled.div`
  margin: 3rem 0;
`;

const Button = styled(Link)`
  display: inline-block;
  background-color: ${props => props.theme === 'dark' ? '#3b82f6' : '#2563eb'};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#2563eb' : '#1d4ed8'};
  }
`;

const FAQSection = styled.div`
  margin: 3rem 0;
`;

const FAQItem = styled.div`
  margin-bottom: 1.5rem;
`;

const FAQQuestion = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
`;

const FAQAnswer = styled.p`
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
  line-height: 1.5;
`;

const BusinessPage = () => {
  const { theme } = useTheme();

  return (
    <PageContainer>
      <PageTitle theme={theme}>Kurumsal Çözümler</PageTitle>
      
      <Paragraph theme={theme}>
        Teknova Kurumsal Çözümler, işletmelerin global iletişim ihtiyaçlarını karşılamak için özel olarak geliştirilmiş, 
        gelişmiş yapay zeka destekli çeviri hizmetleri sunar. Tüm ölçekteki işletmeler için ölçeklenebilir, 
        güvenli ve maliyet etkin çeviri çözümleri sunuyoruz.
      </Paragraph>
      
      <SectionTitle theme={theme}>Neden Teknova Kurumsal?</SectionTitle>
      
      <FeatureGrid>
        <FeatureCard theme={theme}>
          <FeatureTitle theme={theme}>Özelleştirilmiş Çözümler</FeatureTitle>
          <FeatureDescription theme={theme}>
            Şirketinizin spesifik ihtiyaçlarına göre özelleştirilmiş çeviri çözümleri sunuyoruz. 
            Sektörünüze özel terminoloji yönetimi ve çeviri belleği ile tutarlı çeviriler elde edersiniz.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard theme={theme}>
          <FeatureTitle theme={theme}>Kurumsal Entegrasyon</FeatureTitle>
          <FeatureDescription theme={theme}>
            Mevcut iş süreçlerinize sorunsuz entegrasyon sağlıyoruz. CMS, CRM, ERP sistemleri ve 
            diğer kurumsal yazılımlarla kolay entegrasyon için gelişmiş API çözümleri sunuyoruz.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard theme={theme}>
          <FeatureTitle theme={theme}>Ekip İşbirliği</FeatureTitle>
          <FeatureDescription theme={theme}>
            Ekip üyelerinizin çeviri projelerinde işbirliği yapmasını sağlayan araçlar sunuyoruz. 
            Rol tabanlı izinler, ortak terminoloji kütüphaneleri ve proje yönetim özellikleri içerir.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard theme={theme}>
          <FeatureTitle theme={theme}>Güvenlik ve Gizlilik</FeatureTitle>
          <FeatureDescription theme={theme}>
            Verilerinizin güvenliği birinci önceliğimizdir. Uçtan uca şifreleme, özel bulut 
            çözümleri ve GDPR uyumlu veri işleme süreçleri ile verilerinizi koruyoruz.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard theme={theme}>
          <FeatureTitle theme={theme}>Ölçeklenebilir Kapasite</FeatureTitle>
          <FeatureDescription theme={theme}>
            İster küçük bir işletme olun, isterse global bir şirket, çeviri ihtiyaçlarınız büyüdükçe 
            kapasitemiz de büyür. Hızlı büyüme dönemlerinde bile sorunsuz çeviri süreçleri sağlarız.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard theme={theme}>
          <FeatureTitle theme={theme}>Özel Destek</FeatureTitle>
          <FeatureDescription theme={theme}>
            Kurumsal müşterilerimize 7/24 öncelikli destek ve özel müşteri temsilcisi atıyoruz. 
            Teknik sorunlar, stratejik çeviri planlaması veya genel sorular için her zaman yanınızdayız.
          </FeatureDescription>
        </FeatureCard>
      </FeatureGrid>
      
      <SectionTitle theme={theme}>Başarı Hikayeleri</SectionTitle>
      
      <CaseStudySection theme={theme}>
        <Paragraph theme={theme}>
          İşte Teknova Kurumsal çözümlerimizin çeşitli sektörlerdeki müşterilerimize nasıl değer kattığına 
          dair bazı gerçek örnekler:
        </Paragraph>
        
        <CaseStudyGrid>
          <CaseStudyCard theme={theme}>
            <CaseStudyTitle theme={theme}>Global E-ticaret Genişlemesi</CaseStudyTitle>
            <CaseStudyCompany theme={theme}>MobiTech A.Ş.</CaseStudyCompany>
            <CaseStudyDescription theme={theme}>
              Türkiye'nin önde gelen e-ticaret şirketi, Avrupa pazarına giriş yaparken tüm ürün 
              kataloğunu 7 dile çevirmek için Teknova'yı tercih etti.
            </CaseStudyDescription>
            <CaseStudyResults theme={theme}>
              %40 çeviri maliyeti tasarrufu, 12 günde 50.000+ ürün açıklaması çevirisi
            </CaseStudyResults>
          </CaseStudyCard>
          
          <CaseStudyCard theme={theme}>
            <CaseStudyTitle theme={theme}>Yazılım Dokümantasyonu</CaseStudyTitle>
            <CaseStudyCompany theme={theme}>SofTech Yazılım</CaseStudyCompany>
            <CaseStudyDescription theme={theme}>
              Gelişen bir yazılım şirketi, teknik dokümantasyonunu 12 farklı dile çevirmek ve 
              sürekli güncellemeler yapmak için API entegrasyonumuzu kullandı.
            </CaseStudyDescription>
            <CaseStudyResults theme={theme}>
              %85 daha hızlı güncelleme süreci, otomatikleştirilmiş çeviri iş akışı
            </CaseStudyResults>
          </CaseStudyCard>
          
          <CaseStudyCard theme={theme}>
            <CaseStudyTitle theme={theme}>Yasal Dokümantasyon Çevirisi</CaseStudyTitle>
            <CaseStudyCompany theme={theme}>Dünya Hukuk Bürosu</CaseStudyCompany>
            <CaseStudyDescription theme={theme}>
              Uluslararası bir hukuk firması, karmaşık yasal belgeleri çevirmek için özel terminoloji 
              yönetimimizden ve gelişmiş çeviri hafızasından faydalandı.
            </CaseStudyDescription>
            <CaseStudyResults theme={theme}>
              %99.8 terminoloji tutarlılığı, güvenli ve uyumlu belge işleme
            </CaseStudyResults>
          </CaseStudyCard>
        </CaseStudyGrid>
      </CaseStudySection>
      
      <PricingSection>
        <SectionTitle theme={theme}>Esnek Fiyatlandırma Modelleri</SectionTitle>
        
        <Paragraph theme={theme}>
          Kurumsal müşterilerimize ihtiyaçları ve kullanım hacimleri doğrultusunda özelleştirilmiş 
          fiyatlandırma seçenekleri sunuyoruz. Aylık abonelik, kullanım başına ödeme veya yıllık 
          sözleşme modellerinden birini seçebilirsiniz.
        </Paragraph>
        
        <Paragraph theme={theme}>
          Kurumunuz için en uygun fiyatlandırma modelini belirlemek ve özel bir teklif almak için 
          bizimle iletişime geçin.
        </Paragraph>
        
        <Button to="/contact" theme={theme}>İletişime Geç</Button>
        <Button to="/pricing" theme={theme} style={{ marginLeft: '1rem', backgroundColor: 'transparent', color: theme === 'dark' ? '#d1d5db' : '#4b5563', border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}` }}>
          Fiyatlandırmayı Gör
        </Button>
      </PricingSection>
      
      <FAQSection>
        <SectionTitle theme={theme}>Sıkça Sorulan Sorular</SectionTitle>
        
        <FAQItem>
          <FAQQuestion theme={theme}>Teknova Kurumsal, şirketimizin mevcut sistemlerine nasıl entegre olur?</FAQQuestion>
          <FAQAnswer theme={theme}>
            Teknova API'si sayesinde CMS, CRM, ERP ve diğer kurumsal sistemlerinizle sorunsuz entegrasyon sağlayabilirsiniz. 
            Teknik ekibimiz, entegrasyon sürecinde size rehberlik ederek mevcut iş akışlarınıza özel çözümler geliştirecektir.
          </FAQAnswer>
        </FAQItem>
        
        <FAQItem>
          <FAQQuestion theme={theme}>Verilerimizin güvenliği nasıl sağlanıyor?</FAQQuestion>
          <FAQAnswer theme={theme}>
            Tüm verileriniz uçtan uca şifreleme ile korunmaktadır. GDPR ve diğer veri koruma düzenlemelerine 
            tam uyumluluk sağlıyoruz. İsterseniz, verilerinizin işlenmesi için özel bulut çözümleri de sunabiliriz. 
            Ayrıca, müşteri verilerinin kullanımı ve saklanması konusunda katı politikalarımız vardır.
          </FAQAnswer>
        </FAQItem>
        
        <FAQItem>
          <FAQQuestion theme={theme}>Sektörümüze özel terminoloji desteği sağlıyor musunuz?</FAQQuestion>
          <FAQAnswer theme={theme}>
            Evet, sektörünüze ve şirketinize özel terminoloji kütüphaneleri oluşturuyoruz. 
            Mevcut terminoloji listelerinizi sistemimize aktarabilir, özel terimlerinizi ekleyebilir ve 
            zaman içinde terminoloji yönetimi yapabilirsiniz. Bu, tüm çevirilerinizde tutarlılık sağlar.
          </FAQAnswer>
        </FAQItem>
        
        <FAQItem>
          <FAQQuestion theme={theme}>Kurumsal müşteriler için minimum sözleşme süresi var mı?</FAQQuestion>
          <FAQAnswer theme={theme}>
            Kurumsal çözümlerimiz için genellikle 12 aylık bir sözleşme süresi öneriyoruz, ancak 
            ihtiyaçlarınıza göre daha kısa süreli veya proje bazlı anlaşmalar da yapabiliyoruz. 
            Size en uygun modeli belirlemek için satış ekibimizle görüşmenizi öneririz.
          </FAQAnswer>
        </FAQItem>
      </FAQSection>
    </PageContainer>
  );
};

export default BusinessPage; 