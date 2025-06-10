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

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
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

const List = styled.ul`
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
`;

const ListItem = styled.li`
  margin-bottom: 0.5rem;
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
  line-height: 1.6;
`;

const LastUpdated = styled.div`
  font-style: italic;
  margin-bottom: 2rem;
  color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
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

const CookiePolicyPage = () => {
  const { theme } = useTheme();

  return (
    <PageContainer>
      <PageTitle theme={theme}>Çerez Politikası</PageTitle>
      
      <LastUpdated theme={theme}>Son güncelleme: 1 Haziran 2024</LastUpdated>
      
      <Paragraph theme={theme}>
        Teknova, web sitemizi ziyaret ettiğinizde çerezler ve benzer teknolojiler kullanır. 
        Bu Çerez Politikası, çerezleri nasıl kullandığımızı ve seçeneklerinizi açıklar.
      </Paragraph>
      
      <SectionTitle theme={theme}>1. Çerez Nedir?</SectionTitle>
      
      <Paragraph theme={theme}>
        Çerezler, web sitesini ziyaret ettiğinizde cihazınıza (bilgisayar, tablet veya mobil cihaz) 
        yerleştirilen küçük metin dosyalarıdır. Çerezler yaygın olarak kullanılır ve web sitesinin 
        düzgün çalışması, kullanıcı deneyiminin iyileştirilmesi ve analiz amaçları için gereklidir.
      </Paragraph>
      
      <Paragraph theme={theme}>
        Ayrıca, web işaretçileri (web beacons), piksel etiketleri ve yerel depolama gibi benzer 
        teknolojileri de kullanabiliriz. Bu teknolojiler, çerezlere benzer şekilde çalışır ve cihazınızda 
        bilgi toplar veya depolar.
      </Paragraph>
      
      <SectionTitle theme={theme}>2. Kullandığımız Çerez Türleri</SectionTitle>
      
      <Paragraph theme={theme}>
        Teknova'da kullandığımız çerezleri aşağıdaki kategorilere ayırıyoruz:
      </Paragraph>
      
      <SubSectionTitle theme={theme}>2.1 Zorunlu Çerezler</SubSectionTitle>
      
      <Paragraph theme={theme}>
        Bu çerezler, web sitemizin temel işlevlerini sağlamak için gereklidir. Bunlar olmadan, 
        hesabınıza giriş yapma veya form doldurma gibi istediğiniz hizmetleri sunamayız. 
        Bu çerezleri devre dışı bırakamazsınız.
      </Paragraph>
      
      <SubSectionTitle theme={theme}>2.2 Performans ve Analitik Çerezleri</SubSectionTitle>
      
      <Paragraph theme={theme}>
        Bu çerezler, web sitemizin nasıl kullanıldığı hakkında bilgi toplar. Örneğin, hangi sayfaların 
        en çok ziyaret edildiğini veya kullanıcıların web sitesinde nasıl gezindiğini anlamamıza yardımcı olurlar. 
        Bu bilgiler, web sitemizi iyileştirmemize yardımcı olur.
      </Paragraph>
      
      <SubSectionTitle theme={theme}>2.3 İşlevsellik Çerezleri</SubSectionTitle>
      
      <Paragraph theme={theme}>
        Bu çerezler, web sitemizde yaptığınız seçimleri hatırlar ve gelişmiş, kişiselleştirilmiş özellikler sunar. 
        Örneğin, dil tercihlerinizi, metin boyutunu veya bölgenizi hatırlayabilirler.
      </Paragraph>
      
      <SubSectionTitle theme={theme}>2.4 Hedefleme/Reklam Çerezleri</SubSectionTitle>
      
      <Paragraph theme={theme}>
        Bu çerezler, size ilgi alanlarınıza göre özelleştirilmiş reklamlar göstermek için kullanılır. 
        Ayrıca, reklam kampanyalarımızın etkinliğini ölçmemize yardımcı olurlar.
      </Paragraph>
      
      <SectionTitle theme={theme}>3. Kullandığımız Belirli Çerezler</SectionTitle>
      
      <Paragraph theme={theme}>
        Aşağıdaki tablo, web sitemizde kullandığımız belirli çerezleri ve amaçlarını listeler:
      </Paragraph>
      
      <Table>
        <thead>
          <tr>
            <Th theme={theme}>Çerez Adı</Th>
            <Th theme={theme}>Türü</Th>
            <Th theme={theme}>Amaç</Th>
            <Th theme={theme}>Süre</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td theme={theme}>teknova_session</Td>
            <Td theme={theme}>Zorunlu</Td>
            <Td theme={theme}>Oturum bilgilerinizi ve kimlik doğrulama durumunuzu korur</Td>
            <Td theme={theme}>Oturum (tarayıcıyı kapattığınızda sona erer)</Td>
          </tr>
          <tr>
            <Td theme={theme}>teknova_auth</Td>
            <Td theme={theme}>Zorunlu</Td>
            <Td theme={theme}>Kimlik doğrulama tokeninizi saklar</Td>
            <Td theme={theme}>30 gün</Td>
          </tr>
          <tr>
            <Td theme={theme}>teknova_preferences</Td>
            <Td theme={theme}>İşlevsellik</Td>
            <Td theme={theme}>Dil, tema ve diğer kullanıcı tercihlerini saklar</Td>
            <Td theme={theme}>1 yıl</Td>
          </tr>
          <tr>
            <Td theme={theme}>_ga</Td>
            <Td theme={theme}>Analitik</Td>
            <Td theme={theme}>Google Analytics tarafından web sitesi kullanımını izlemek için kullanılır</Td>
            <Td theme={theme}>2 yıl</Td>
          </tr>
          <tr>
            <Td theme={theme}>_gid</Td>
            <Td theme={theme}>Analitik</Td>
            <Td theme={theme}>Google Analytics tarafından kullanıcıları ayırt etmek için kullanılır</Td>
            <Td theme={theme}>24 saat</Td>
          </tr>
          <tr>
            <Td theme={theme}>_fbp</Td>
            <Td theme={theme}>Reklam</Td>
            <Td theme={theme}>Facebook tarafından reklam hedefleme için kullanılır</Td>
            <Td theme={theme}>3 ay</Td>
          </tr>
        </tbody>
      </Table>
      
      <SectionTitle theme={theme}>4. Üçüncü Taraf Çerezleri</SectionTitle>
      
      <Paragraph theme={theme}>
        Bazı çerezler üçüncü taraf hizmet sağlayıcılar tarafından yerleştirilir. Bu üçüncü taraflar şunları içerir:
      </Paragraph>
      
      <List theme={theme}>
        <ListItem theme={theme}><strong>Google Analytics:</strong> Web sitesi trafiğini ve kullanımını izlemek için kullanılır.</ListItem>
        <ListItem theme={theme}><strong>Google Ads:</strong> Reklam kampanyalarının etkinliğini izlemek ve hedefli reklamlar göstermek için kullanılır.</ListItem>
        <ListItem theme={theme}><strong>Facebook:</strong> Sosyal medya entegrasyonu ve reklam hedefleme amacıyla kullanılır.</ListItem>
        <ListItem theme={theme}><strong>Hotjar:</strong> Kullanıcı davranışını ve deneyimini anlamak için kullanılır.</ListItem>
      </List>
      
      <Paragraph theme={theme}>
        Bu üçüncü taraflar kendi gizlilik politikalarına sahiptir ve kendi çerezlerini veya benzer teknolojilerini 
        nasıl kullandıklarını anlamak için kendi gizlilik politikalarını incelemenizi öneririz.
      </Paragraph>
      
      <SectionTitle theme={theme}>5. Çerez Yönetimi ve Tercihleriniz</SectionTitle>
      
      <Paragraph theme={theme}>
        Çoğu web tarayıcısı, çerezleri otomatik olarak kabul eder, ancak isterseniz tarayıcı ayarlarınızı 
        değiştirerek çerezleri reddedebilir veya belirli çerezleri engelleyebilirsiniz.
      </Paragraph>
      
      <SubSectionTitle theme={theme}>5.1 Tarayıcı Ayarları</SubSectionTitle>
      
      <Paragraph theme={theme}>
        Çerezleri yönetmek için tarayıcı ayarlarınızı değiştirebilirsiniz. Çoğu tarayıcı, tüm çerezleri kabul etmeyi, 
        çerez alındığında sizi bilgilendirmeyi veya tüm çerezleri reddetmeyi seçmenize olanak tanır. 
        Çerezleri reddetmeyi seçerseniz, web sitesinin bazı bölümlerinin düzgün çalışmayabileceğini unutmayın.
      </Paragraph>
      
      <Paragraph theme={theme}>
        Popüler tarayıcılar için çerez ayarlarını nasıl yöneteceğinize dair talimatlar:
      </Paragraph>
      
      <List theme={theme}>
        <ListItem theme={theme}><strong>Google Chrome:</strong> Ayarlar > Gelişmiş > Gizlilik ve Güvenlik > Site Ayarları > Çerezler</ListItem>
        <ListItem theme={theme}><strong>Mozilla Firefox:</strong> Ayarlar > Gizlilik ve Güvenlik > Çerezler ve Site Verileri</ListItem>
        <ListItem theme={theme}><strong>Safari:</strong> Tercihler > Gizlilik > Çerezler ve Web Sitesi Verileri</ListItem>
        <ListItem theme={theme}><strong>Microsoft Edge:</strong> Ayarlar > Site İzinleri > Çerezler ve Site Verileri</ListItem>
      </List>
      
      <SubSectionTitle theme={theme}>5.2 Çerez Tercihleri Aracı</SubSectionTitle>
      
      <Paragraph theme={theme}>
        Web sitemizde, çerez tercihlerinizi yönetmenize olanak tanıyan bir Çerez Tercihleri aracı sunuyoruz. 
        Bu araç, zorunlu olmayan çerezleri kabul etmeyi veya reddetmeyi seçmenize olanak tanır. 
        Çerez tercihlerinizi değiştirmek için web sitemizin alt kısmındaki "Çerez Tercihleri" bağlantısına tıklayabilirsiniz.
      </Paragraph>
      
      <SectionTitle theme={theme}>6. Hedefli Reklamları Devre Dışı Bırakma</SectionTitle>
      
      <Paragraph theme={theme}>
        Çevrimiçi davranışsal reklamcılık hakkında daha fazla bilgi edinmek ve bu tür reklamlardan çıkmak için aşağıdaki kaynaklara başvurabilirsiniz:
      </Paragraph>
      
      <List theme={theme}>
        <ListItem theme={theme}><a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" style={{color: theme === 'dark' ? '#60a5fa' : '#2563eb'}}>www.youronlinechoices.eu</a></ListItem>
        <ListItem theme={theme}><a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{color: theme === 'dark' ? '#60a5fa' : '#2563eb'}}>www.aboutads.info/choices</a></ListItem>
        <ListItem theme={theme}><a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" style={{color: theme === 'dark' ? '#60a5fa' : '#2563eb'}}>optout.networkadvertising.org</a></ListItem>
      </List>
      
      <SectionTitle theme={theme}>7. Bu Politikadaki Değişiklikler</SectionTitle>
      
      <Paragraph theme={theme}>
        Bu Çerez Politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler olması durumunda, 
        bu web sitesinde bir bildirim yayınlayarak veya size doğrudan bildirim göndererek sizi bilgilendireceğiz. 
        Yine de, bu politikada yapılan değişiklikleri düzenli olarak kontrol etmenizi öneririz.
      </Paragraph>
      
      <SectionTitle theme={theme}>8. İletişim</SectionTitle>
      
      <Paragraph theme={theme}>
        Bu Çerez Politikası hakkında herhangi bir sorunuz veya endişeniz varsa, lütfen aşağıdaki bilgileri kullanarak 
        bizimle iletişime geçin:
      </Paragraph>
      
      <Paragraph theme={theme}>
        <strong>Teknova A.Ş.</strong><br />
        E-posta: privacy@teknova.com.tr<br />
        Adres: Teknova Plaza, Mustafa Kemal Mah. 2118. Cad. No: 4 06510 Çankaya/Ankara
      </Paragraph>
    </PageContainer>
  );
};

export default CookiePolicyPage; 