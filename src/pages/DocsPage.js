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
  margin-bottom: 2rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
  border-bottom: 2px solid ${props => props.theme === 'dark' ? '#374151' : '#e5e7eb'};
  padding-bottom: 1rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  position: sticky;
  top: 5rem;
  height: fit-content;
  
  @media (max-width: 768px) {
    position: relative;
    top: 0;
  }
`;

const MainContent = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px ${props => props.theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
  
  &:first-of-type {
    margin-top: 0;
  }
`;

const SubSectionTitle = styled.h3`
  font-size: 1.25rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
`;

const Paragraph = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.6;
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
`;

const NavList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 0.5rem;
`;

const NavLink = styled.a`
  display: block;
  padding: 0.5rem;
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
  text-decoration: none;
  border-radius: 0.25rem;
  transition: all 0.2s;
  
  &:hover, &.active {
    background-color: ${props => props.theme === 'dark' ? '#374151' : '#f3f4f6'};
    color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
  }
  
  &.section {
    font-weight: 600;
    color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
  }
  
  &.subsection {
    padding-left: 1.5rem;
    font-size: 0.9rem;
  }
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

const Image = styled.img`
  max-width: 100%;
  border-radius: 0.375rem;
  margin: 1.5rem 0;
`;

const List = styled.ul`
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
`;

const ListItem = styled.li`
  margin-bottom: 0.5rem;
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
`;

const DocsPage = () => {
  const { theme } = useTheme();

  return (
    <PageContainer>
      <PageTitle theme={theme}>Dokümantasyon</PageTitle>
      
      <ContentGrid>
        <Sidebar>
          <NavList>
            <NavItem>
              <NavLink href="#baslangic" className="section" theme={theme}>Başlangıç</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#kurulum" className="subsection" theme={theme}>Kurulum</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#hesap-olusturma" className="subsection" theme={theme}>Hesap Oluşturma</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#metin-cevirisi" className="section" theme={theme}>Metin Çevirisi</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#basit-ceviri" className="subsection" theme={theme}>Basit Çeviri</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#dil-algilama" className="subsection" theme={theme}>Dil Algılama</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#belge-cevirisi" className="section" theme={theme}>Belge Çevirisi</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#desteklenen-formatlar" className="subsection" theme={theme}>Desteklenen Formatlar</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#buyuk-belgeler" className="subsection" theme={theme}>Büyük Belgeler</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#api-kullanimi" className="section" theme={theme}>API Kullanımı</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#api-anahtari" className="subsection" theme={theme}>API Anahtarı</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#limitler-kisitlamalar" className="section" theme={theme}>Limitler ve Kısıtlamalar</NavLink>
            </NavItem>
          </NavList>
        </Sidebar>
        
        <MainContent theme={theme}>
          <SectionTitle id="baslangic" theme={theme}>Başlangıç</SectionTitle>
          
          <Paragraph theme={theme}>
            Teknova çeviri platformu, metin ve belge çevirilerinizi hızlı, doğru ve güvenli bir şekilde yapmanız için geliştirilmiş kapsamlı bir araçtır. Bu dokümantasyon, platformun tüm özelliklerini ve nasıl kullanılacağını detaylı olarak açıklamaktadır.
          </Paragraph>
          
          <SubSectionTitle id="kurulum" theme={theme}>Kurulum</SubSectionTitle>
          
          <Paragraph theme={theme}>
            Teknova web tabanlı bir platform olduğu için herhangi bir kurulum gerektirmez. Modern web tarayıcıları (Chrome, Firefox, Safari, Edge) ile sorunsuz çalışır.
          </Paragraph>
          
          <SubSectionTitle id="hesap-olusturma" theme={theme}>Hesap Oluşturma</SubSectionTitle>
          
          <Paragraph theme={theme}>
            Teknova'yı kullanmaya başlamak için bir hesap oluşturmanız gerekir. Ücretsiz hesaplar günlük sınırlı çeviri yapabilirken, premium hesaplar daha fazla özellik ve kapasite sunar.
          </Paragraph>
          
          <List theme={theme}>
            <ListItem theme={theme}>Ana sayfada sağ üst köşedeki "Kayıt Ol" butonuna tıklayın.</ListItem>
            <ListItem theme={theme}>E-posta adresinizi ve şifrenizi girin.</ListItem>
            <ListItem theme={theme}>Hesabınızı doğrulamak için e-posta adresinize gönderilen bağlantıya tıklayın.</ListItem>
            <ListItem theme={theme}>Hesap bilgilerinizi tamamlayın ve kullanmaya başlayın.</ListItem>
          </List>
          
          <SectionTitle id="metin-cevirisi" theme={theme}>Metin Çevirisi</SectionTitle>
          
          <Paragraph theme={theme}>
            Teknova ile metin çevirisi yapmak hızlı ve kolaydır. Platformumuz 40'tan fazla dil çiftini destekler ve çevirilerinizi anında gerçekleştirir.
          </Paragraph>
          
          <SubSectionTitle id="basit-ceviri" theme={theme}>Basit Çeviri</SubSectionTitle>
          
          <Paragraph theme={theme}>
            Ana sayfadaki çeviri kutusunu kullanarak hızlı çeviriler yapabilirsiniz:
          </Paragraph>
          
          <List theme={theme}>
            <ListItem theme={theme}>Sol taraftaki metin kutusuna çevrilecek metni girin.</ListItem>
            <ListItem theme={theme}>Kaynak dili seçin (veya otomatik algıla seçeneğini kullanın).</ListItem>
            <ListItem theme={theme}>Hedef dili seçin.</ListItem>
            <ListItem theme={theme}>Çeviri otomatik olarak sağ tarafta görünecektir.</ListItem>
          </List>
          
          <SubSectionTitle id="dil-algilama" theme={theme}>Dil Algılama</SubSectionTitle>
          
          <Paragraph theme={theme}>
            Kaynak dil olarak "Otomatik Algıla" seçeneğini kullanarak, sistemimizin metninizin dilini otomatik olarak tespit etmesini sağlayabilirsiniz. Bu özellik, özellikle çok dilli belgelerde veya kaynak dilin bilinmediği durumlarda faydalıdır.
          </Paragraph>
          
          <SectionTitle id="belge-cevirisi" theme={theme}>Belge Çevirisi</SectionTitle>
          
          <Paragraph theme={theme}>
            Teknova, çeşitli belge formatlarını destekleyerek tam belge çevirisi yapmanıza olanak tanır. Belge çevirisi yaparken belge formatı korunur.
          </Paragraph>
          
          <SubSectionTitle id="desteklenen-formatlar" theme={theme}>Desteklenen Formatlar</SubSectionTitle>
          
          <Paragraph theme={theme}>
            Platformumuz aşağıdaki belge formatlarını destekler:
          </Paragraph>
          
          <List theme={theme}>
            <ListItem theme={theme}>PDF (.pdf)</ListItem>
            <ListItem theme={theme}>Microsoft Word (.docx, .doc)</ListItem>
            <ListItem theme={theme}>Microsoft PowerPoint (.pptx, .ppt)</ListItem>
            <ListItem theme={theme}>Metin Dosyaları (.txt)</ListItem>
          </List>
          
          <SubSectionTitle id="buyuk-belgeler" theme={theme}>Büyük Belgeler</SubSectionTitle>
          
          <Paragraph theme={theme}>
            Büyük belgelerin (10MB'dan büyük) çevirisi için Premium veya Kurumsal hesap gereklidir. Bu belgeler için çeviri işlemi biraz daha uzun sürebilir ve işlem durumunu hesabınızdan takip edebilirsiniz.
          </Paragraph>
          
          <SectionTitle id="api-kullanimi" theme={theme}>API Kullanımı</SectionTitle>
          
          <Paragraph theme={theme}>
            Teknova API'si, çeviri yeteneklerimizi kendi uygulamalarınıza entegre etmenizi sağlar. API'miz RESTful bir arayüz sunar ve kolayca entegre edilebilir.
          </Paragraph>
          
          <SubSectionTitle id="api-anahtari" theme={theme}>API Anahtarı</SubSectionTitle>
          
          <Paragraph theme={theme}>
            API'yi kullanmaya başlamak için önce bir API anahtarı oluşturmanız gerekir:
          </Paragraph>
          
          <List theme={theme}>
            <ListItem theme={theme}>Hesabınıza giriş yapın ve "Ayarlar" sayfasına gidin.</ListItem>
            <ListItem theme={theme}>"API" sekmesini seçin.</ListItem>
            <ListItem theme={theme}>"Yeni API Anahtarı Oluştur" butonuna tıklayın.</ListItem>
            <ListItem theme={theme}>API anahtarınızı güvenli bir şekilde saklayın ve istek başlıklarında kullanın.</ListItem>
          </List>
          
          <CodeBlock theme={theme}>
{`// Örnek API kullanımı (JavaScript)
const response = await fetch('https://api.teknova.com.tr/v1/translate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    text: 'Hello, world!',
    source_lang: 'en',
    target_lang: 'tr'
  })
});

const result = await response.json();
console.log(result.translated_text); // "Merhaba, dünya!"`}
          </CodeBlock>
          
          <Paragraph theme={theme}>
            Daha detaylı API dokümantasyonu için <a href="/api" style={{ color: theme === 'dark' ? '#60a5fa' : '#2563eb' }}>API sayfamızı</a> ziyaret edin.
          </Paragraph>
          
          <SectionTitle id="limitler-kisitlamalar" theme={theme}>Limitler ve Kısıtlamalar</SectionTitle>
          
          <Paragraph theme={theme}>
            Platformumuzu kullanırken aşağıdaki limit ve kısıtlamaları göz önünde bulundurun:
          </Paragraph>
          
          <List theme={theme}>
            <ListItem theme={theme}>Ücretsiz hesaplar günde 5.000 karakter çevirebilir.</ListItem>
            <ListItem theme={theme}>Ücretsiz hesaplar maksimum 10MB boyutunda belge yükleyebilir.</ListItem>
            <ListItem theme={theme}>API kullanımı sadece Premium ve Kurumsal hesaplar için geçerlidir.</ListItem>
            <ListItem theme={theme}>Aşırı istek gönderme durumunda geçici olarak hizmet kısıtlanabilir.</ListItem>
            <ListItem theme={theme}>Telif hakkı bulunan veya yasadışı içeriklerin çevirisi için platformumuz kullanılamaz.</ListItem>
          </List>
          
          <Paragraph theme={theme}>
            Daha fazla bilgi veya destek için <a href="/contact" style={{ color: theme === 'dark' ? '#60a5fa' : '#2563eb' }}>iletişim sayfamızı</a> ziyaret edin.
          </Paragraph>
        </MainContent>
      </ContentGrid>
    </PageContainer>
  );
};

export default DocsPage; 