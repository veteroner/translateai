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

const PrivacyPolicyPage = () => {
  const { theme } = useTheme();

  return (
    <PageContainer>
      <PageTitle theme={theme}>Gizlilik Politikası</PageTitle>
      
      <LastUpdated theme={theme}>Son güncelleme: 1 Haziran 2024</LastUpdated>
      
      <Paragraph theme={theme}>
        Teknova olarak, gizliliğinize saygı duyuyor ve kişisel verilerinizin korunmasına büyük önem veriyoruz. 
        Bu Gizlilik Politikası, hizmetlerimizi kullanırken toplanan, kullanılan ve paylaşılan kişisel verilerinizle 
        ilgili uygulamalarımızı açıklamaktadır.
      </Paragraph>
      
      <Paragraph theme={theme}>
        Hizmetlerimizi kullanarak, bu politikada belirtilen veri uygulamalarını kabul etmiş olursunuz. 
        Lütfen bu politikayı dikkatlice okuyun. Herhangi bir sorunuz varsa, bizimle iletişime geçmekten çekinmeyin.
      </Paragraph>
      
      <SectionTitle theme={theme}>1. Topladığımız Bilgiler</SectionTitle>
      
      <SubSectionTitle theme={theme}>1.1 Hesap Bilgileri</SubSectionTitle>
      
      <Paragraph theme={theme}>
        Teknova'ya kayıt olduğunuzda aşağıdaki bilgileri toplarız:
      </Paragraph>
      
      <List theme={theme}>
        <ListItem theme={theme}>Ad ve soyadı</ListItem>
        <ListItem theme={theme}>E-posta adresi</ListItem>
        <ListItem theme={theme}>Şifre (şifrelenmiş formatta saklanır)</ListItem>
        <ListItem theme={theme}>Profil fotoğrafı (isteğe bağlı)</ListItem>
        <ListItem theme={theme}>Telefon numarası (isteğe bağlı, iki faktörlü kimlik doğrulama için)</ListItem>
      </List>
      
      <SubSectionTitle theme={theme}>1.2 Çeviri İçeriği</SubSectionTitle>
      
      <Paragraph theme={theme}>
        Hizmetlerimizi kullanırken, çeviri yapmak için gönderdiğiniz metinleri ve belgeleri işleriz. 
        Bu içerikler, hizmetlerimizi sağlamak için gerekli olan süre boyunca sistemlerimizde saklanabilir.
      </Paragraph>
      
      <SubSectionTitle theme={theme}>1.3 Kullanım Verileri</SubSectionTitle>
      
      <Paragraph theme={theme}>
        Platformumuzu nasıl kullandığınızla ilgili aşağıdaki bilgileri toplarız:
      </Paragraph>
      
      <List theme={theme}>
        <ListItem theme={theme}>IP adresi</ListItem>
        <ListItem theme={theme}>Tarayıcı ve cihaz bilgileri</ListItem>
        <ListItem theme={theme}>Erişim tarihi ve saati</ListItem>
        <ListItem theme={theme}>Tıklanan bağlantılar</ListItem>
        <ListItem theme={theme}>Kullanılan çeviri dilleri</ListItem>
        <ListItem theme={theme}>Oturum süresi</ListItem>
      </List>
      
      <SubSectionTitle theme={theme}>1.4 Çerezler</SubSectionTitle>
      
      <Paragraph theme={theme}>
        Teknova, çerezler ve benzer izleme teknolojileri kullanır. Daha fazla bilgi için Çerez Politikamıza bakın.
      </Paragraph>
      
      <SectionTitle theme={theme}>2. Bilgilerinizi Nasıl Kullanıyoruz</SectionTitle>
      
      <Paragraph theme={theme}>
        Topladığımız bilgileri aşağıdaki amaçlar için kullanırız:
      </Paragraph>
      
      <List theme={theme}>
        <ListItem theme={theme}><strong>Hizmet Sağlama:</strong> Çeviri hizmetlerimizi sunmak, hesabınızı yönetmek ve müşteri desteği sağlamak.</ListItem>
        <ListItem theme={theme}><strong>Geliştirme:</strong> Hizmetlerimizi geliştirmek, yeni özellikler tasarlamak ve kullanıcı deneyimini iyileştirmek.</ListItem>
        <ListItem theme={theme}><strong>Kişiselleştirme:</strong> Size daha alakalı içerik ve öneriler sunmak.</ListItem>
        <ListItem theme={theme}><strong>Analiz:</strong> Kullanıcı davranışını analiz etmek ve platform performansını izlemek.</ListItem>
        <ListItem theme={theme}><strong>Güvenlik:</strong> Hesabınızı ve hizmetlerimizi korumak.</ListItem>
      </List>
      
      <SectionTitle theme={theme}>3. Bilgilerinizi Kimlerle Paylaşıyoruz</SectionTitle>
      
      <Paragraph theme={theme}>
        Kişisel verilerinizi aşağıdaki kategorideki üçüncü taraflarla paylaşabiliriz:
      </Paragraph>
      
      <List theme={theme}>
        <ListItem theme={theme}><strong>Hizmet Sağlayıcılar:</strong> Hizmetlerimizi sunmamıza yardımcı olan bulut depolama, ödeme işlemcileri ve analiz sağlayıcıları gibi üçüncü taraf hizmet sağlayıcılar.</ListItem>
        <ListItem theme={theme}><strong>İş Ortakları:</strong> Ortak hizmetler veya promosyonlar sunduğumuz iş ortakları.</ListItem>
        <ListItem theme={theme}><strong>Yasal Gereklilikler:</strong> Yasal bir yükümlülüğe uymak, yasal haklarımızı korumak veya yasalara aykırı faaliyetleri önlemek için gerektiğinde.</ListItem>
      </List>
      
      <Paragraph theme={theme}>
        Teknova, kişisel verilerinizi açık izniniz olmadan üçüncü taraflara satmaz veya kiralamaz.
      </Paragraph>
      
      <SectionTitle theme={theme}>4. Verilerinizin Güvenliği</SectionTitle>
      
      <Paragraph theme={theme}>
        Kişisel verilerinizin güvenliğini sağlamak için endüstri standardı güvenlik önlemleri uyguluyoruz. 
        Bu önlemler arasında şifreleme, güvenli sunucu altyapısı ve düzenli güvenlik denetimleri bulunmaktadır.
      </Paragraph>
      
      <Paragraph theme={theme}>
        Ancak, internet üzerinden veri iletiminin %100 güvenli olmadığını unutmayın. Verilerinizi korumak için 
        tüm çabayı gösterirken, tarafımıza iletilen bilgilerin mutlak güvenliğini garanti edemeyiz.
      </Paragraph>
      
      <SectionTitle theme={theme}>5. Veri Saklama</SectionTitle>
      
      <Paragraph theme={theme}>
        Kişisel verilerinizi, hesabınız aktif olduğu sürece veya hizmetlerimizi sağlamak için gerekli olduğu 
        sürece saklarız. Hesabınızı silmeniz halinde, kişisel verilerinizi makul bir süre içinde sileriz veya 
        anonimleştiririz, ancak yasal yükümlülüklerimizi yerine getirmek veya haklarımızı korumak için gerekli 
        verileri saklama hakkımızı saklı tutarız.
      </Paragraph>
      
      <SectionTitle theme={theme}>6. Çeviri İçeriği ve Gizlilik</SectionTitle>
      
      <Paragraph theme={theme}>
        Çeviri için gönderdiğiniz içeriği gizli tutarız. Çeviri sistemimizi geliştirmek amacıyla bu içeriği 
        kullanabilsek de, içeriğinizi açık bir şekilde tanımlanabilir formda üçüncü taraflarla paylaşmayız.
      </Paragraph>
      
      <Paragraph theme={theme}>
        Premium ve kurumsal hesaplar için gelişmiş veri koruma seçenekleri sunmaktayız, 
        bu seçenekler gönderilen içeriklerinizin eğitim verisi olarak kullanılmamasını sağlar.
      </Paragraph>
      
      <SectionTitle theme={theme}>7. Haklarınız</SectionTitle>
      
      <Paragraph theme={theme}>
        Veri koruma yasaları kapsamında aşağıdaki haklara sahipsiniz:
      </Paragraph>
      
      <List theme={theme}>
        <ListItem theme={theme}><strong>Erişim Hakkı:</strong> Hakkınızda tuttuğumuz kişisel verilere erişim talep etme hakkı.</ListItem>
        <ListItem theme={theme}><strong>Düzeltme Hakkı:</strong> Yanlış veya eksik kişisel verilerinizin düzeltilmesini isteme hakkı.</ListItem>
        <ListItem theme={theme}><strong>Silme Hakkı:</strong> Belirli koşullar altında kişisel verilerinizin silinmesini isteme hakkı.</ListItem>
        <ListItem theme={theme}><strong>İşleme Sınırlandırma Hakkı:</strong> Kişisel verilerinizin işlenmesini sınırlandırma hakkı.</ListItem>
        <ListItem theme={theme}><strong>Veri Taşınabilirliği Hakkı:</strong> Verilerinizi yapılandırılmış, makine tarafından okunabilir bir formatta alma hakkı.</ListItem>
        <ListItem theme={theme}><strong>İtiraz Hakkı:</strong> Meşru menfaatlerimize dayalı olarak verilerinizin işlenmesine itiraz etme hakkı.</ListItem>
      </List>
      
      <Paragraph theme={theme}>
        Bu haklarınızı kullanmak için, lütfen aşağıdaki iletişim bilgilerini kullanarak bizimle iletişime geçin.
      </Paragraph>
      
      <SectionTitle theme={theme}>8. Çocukların Gizliliği</SectionTitle>
      
      <Paragraph theme={theme}>
        Hizmetlerimiz 13 yaşın altındaki çocuklara yönelik değildir. 13 yaşın altındaki çocuklardan bilerek 
        kişisel veri toplamıyoruz. Eğer 13 yaşın altındaki bir çocuğa ait kişisel veri topladığımızı fark edersek, 
        bu bilgileri en kısa sürede sileriz.
      </Paragraph>
      
      <SectionTitle theme={theme}>9. Uluslararası Veri Transferleri</SectionTitle>
      
      <Paragraph theme={theme}>
        Küresel bir hizmet sunduğumuz için, kişisel verileriniz farklı ülkelerdeki sunucularda işlenebilir ve 
        depolanabilir. Veri koruma yasalarının kendi ülkenizden farklı olabileceği ülkelere veri aktarımı 
        yapabiliriz. Her durumda, verilerinizin korunması için uygun önlemleri alacağız.
      </Paragraph>
      
      <SectionTitle theme={theme}>10. Bu Politikadaki Değişiklikler</SectionTitle>
      
      <Paragraph theme={theme}>
        Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler yaptığımızda, 
        platformumuzda bir bildirim yayınlayarak veya size bir e-posta göndererek sizi bilgilendireceğiz. 
        En son politika her zaman web sitemizde yayınlanacaktır.
      </Paragraph>
      
      <SectionTitle theme={theme}>11. İletişim</SectionTitle>
      
      <Paragraph theme={theme}>
        Bu Gizlilik Politikası veya kişisel verilerinizin işlenmesi hakkında herhangi bir sorunuz, 
        endişeniz veya talebiniz varsa, lütfen aşağıdaki bilgileri kullanarak bizimle iletişime geçin:
      </Paragraph>
      
      <Paragraph theme={theme}>
        <strong>Teknova A.Ş.</strong><br />
        E-posta: privacy@teknova.com.tr<br />
        Adres: Teknova Plaza, Mustafa Kemal Mah. 2118. Cad. No: 4 06510 Çankaya/Ankara
      </Paragraph>
      
      <Paragraph theme={theme}>
        Veri Koruma Görevlisi: Ahmet Yılmaz (dpo@teknova.com.tr)
      </Paragraph>
    </PageContainer>
  );
};

export default PrivacyPolicyPage; 