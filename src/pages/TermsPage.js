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

const TermsPage = () => {
  const { theme } = useTheme();

  return (
    <PageContainer>
      <PageTitle theme={theme}>Kullanım Şartları</PageTitle>
      
      <LastUpdated theme={theme}>Son güncelleme: 1 Haziran 2024</LastUpdated>
      
      <Paragraph theme={theme}>
        Teknova hizmetlerini kullanarak, bu Kullanım Şartları'nı kabul etmiş olursunuz. 
        Lütfen bu şartları dikkatle okuyun. Bu şartları kabul etmiyorsanız, hizmetlerimizi kullanmayın.
      </Paragraph>
      
      <SectionTitle theme={theme}>1. Hizmet Kullanımı</SectionTitle>
      
      <Paragraph theme={theme}>
        Teknova, metin ve belge çevirisi için çevrimiçi bir platform sağlar. Hizmetlerimizi aşağıdaki koşullarla kullanabilirsiniz:
      </Paragraph>
      
      <List theme={theme}>
        <ListItem theme={theme}>Teknova'yı yalnızca yasal amaçlar için kullanmalısınız.</ListItem>
        <ListItem theme={theme}>Hizmetlerimizi kötüye kullanmamalı veya sistemlerimize zarar vermemelisiniz.</ListItem>
        <ListItem theme={theme}>Hesabınızın güvenliğinden ve giriş bilgilerinizin gizliliğinden siz sorumlusunuz.</ListItem>
        <ListItem theme={theme}>Hesabınız altında gerçekleşen tüm etkinliklerden siz sorumlusunuz.</ListItem>
        <ListItem theme={theme}>Teknova kullanımınız, tüm geçerli yasalara ve düzenlemelere uygun olmalıdır.</ListItem>
      </List>
      
      <SectionTitle theme={theme}>2. Hesap Oluşturma</SectionTitle>
      
      <Paragraph theme={theme}>
        Hizmetlerimizin tamamına erişmek için bir hesap oluşturmanız gerekebilir. Hesap oluşturduğunuzda:
      </Paragraph>
      
      <List theme={theme}>
        <ListItem theme={theme}>Doğru, güncel ve eksiksiz bilgiler sağlamalısınız.</ListItem>
        <ListItem theme={theme}>Güçlü ve benzersiz bir şifre seçmelisiniz.</ListItem>
        <ListItem theme={theme}>Hesap bilgilerinizi gizli tutmalısınız.</ListItem>
        <ListItem theme={theme}>13 yaşından büyük olduğunuzu onaylamış olursunuz.</ListItem>
      </List>
      
      <Paragraph theme={theme}>
        Teknova, herhangi bir hesabı herhangi bir zamanda, herhangi bir sebeple veya sebepsiz yere askıya alma 
        veya sonlandırma hakkını saklı tutar.
      </Paragraph>
      
      <SectionTitle theme={theme}>3. Fikri Mülkiyet Hakları</SectionTitle>
      
      <SubSectionTitle theme={theme}>3.1 Teknova'nın Hakları</SubSectionTitle>
      
      <Paragraph theme={theme}>
        Teknova ve içeriği, Teknova veya lisans verenleri tarafından sahip olunan ve korunan fikri mülkiyet 
        haklarına tabidir. Teknova'nın önceden yazılı izni olmadan, hizmetlerimizi veya içeriğimizi kopyalayamaz, 
        değiştiremez, dağıtamaz veya türetilmiş çalışmalar oluşturamazsınız.
      </Paragraph>
      
      <SubSectionTitle theme={theme}>3.2 Kullanıcı İçeriği</SubSectionTitle>
      
      <Paragraph theme={theme}>
        Teknova'ya içerik gönderdiğinizde (çeviri metinleri veya belgeler), bu içeriğin sahibi olarak kalırsınız. 
        Ancak, hizmetlerimizi sunmak, geliştirmek ve tanıtmak için gerekli hakları bize vermiş olursunuz. 
        Bu, içeriğinizi işleme, değiştirme, dağıtma ve görüntüleme hakkını içerir.
      </Paragraph>
      
      <Paragraph theme={theme}>
        Gönderdiğiniz içeriğin yasalara uygun olduğunu, üçüncü taraf haklarını ihlal etmediğini ve 
        bu şartlara uygun olduğunu garanti edersiniz.
      </Paragraph>
      
      <SectionTitle theme={theme}>4. Abonelikler ve Ödemeler</SectionTitle>
      
      <Paragraph theme={theme}>
        Teknova, ücretsiz ve premium hizmetler sunar. Premium hizmetler için ödeme yapmanız gerekir.
      </Paragraph>
      
      <List theme={theme}>
        <ListItem theme={theme}>Abonelik ücretleri, web sitesinde belirtildiği şekilde tahsil edilir.</ListItem>
        <ListItem theme={theme}>Abonelikler, aksini belirtmedikçe otomatik olarak yenilenir.</ListItem>
        <ListItem theme={theme}>Aboneliğinizi istediğiniz zaman iptal edebilirsiniz, ancak iade politikamız geçerlidir.</ListItem>
        <ListItem theme={theme}>Fiyatları değiştirme hakkımızı saklı tutarız, ancak fiyat değişikliklerini önceden bildireceğiz.</ListItem>
      </List>
      
      <SectionTitle theme={theme}>5. İadeler ve İptaller</SectionTitle>
      
      <Paragraph theme={theme}>
        Aboneliğinizi hesap ayarlarınızdan istediğiniz zaman iptal edebilirsiniz. İptal durumunda:
      </Paragraph>
      
      <List theme={theme}>
        <ListItem theme={theme}>Mevcut ödeme döneminin sonuna kadar premium özelliklere erişiminiz devam eder.</ListItem>
        <ListItem theme={theme}>Daha önce ödenen ücretler için geri ödeme yapılmaz (özel durumlarda istisnalar olabilir).</ListItem>
        <ListItem theme={theme}>Teknik sorunlar nedeniyle hizmet alamadığınız durumlar için, destek ekibimizle iletişime geçerek kısmi geri ödeme talep edebilirsiniz.</ListItem>
      </List>
      
      <SectionTitle theme={theme}>6. Hizmet Değişiklikleri</SectionTitle>
      
      <Paragraph theme={theme}>
        Teknova, herhangi bir zamanda hizmetlerini değiştirme, güncelleme veya durdurma hakkını saklı tutar. Önemli değişiklikler 
        hakkında makul bir süre öncesinden bildirim yapmaya çalışacağız, ancak teknik nedenlerden dolayı hizmetimizde 
        önceden bildirim olmadan değişiklikler veya kesintiler olabilir.
      </Paragraph>
      
      <SectionTitle theme={theme}>7. Hizmet Kısıtlamaları</SectionTitle>
      
      <Paragraph theme={theme}>
        Teknova hizmetlerini kullanırken aşağıdaki faaliyetlerde bulunamazsınız:
      </Paragraph>
      
      <List theme={theme}>
        <ListItem theme={theme}>Yasadışı, zararlı, tehditkar, taciz edici, iftira niteliğinde, müstehcen veya başka şekilde sakıncalı içerik göndermek.</ListItem>
        <ListItem theme={theme}>Başkalarının gizlilik veya fikri mülkiyet haklarını ihlal eden içerik göndermek.</ListItem>
        <ListItem theme={theme}>Hizmetlerimize virüs, kötü amaçlı yazılım veya zararlı kod göndermek.</ListItem>
        <ListItem theme={theme}>Hizmetlerimize erişimi engellemek veya kısıtlamak için tasarlanmış herhangi bir eylemde bulunmak.</ListItem>
        <ListItem theme={theme}>Hizmetlerimizi otomatik araçlarla taramak veya veri çıkarmak (Teknova tarafından izin verilen API kullanımı hariç).</ListItem>
        <ListItem theme={theme}>Teknova'yı, başka bir kişi veya kuruluş gibi davranmak için kullanmak.</ListItem>
      </List>
      
      <SectionTitle theme={theme}>8. Sorumluluk Sınırlaması</SectionTitle>
      
      <Paragraph theme={theme}>
        Teknova hizmetleri "olduğu gibi" ve "mevcut olduğu şekilde" sunulmaktadır. Teknova ve bağlı kuruluşları, 
        hizmetlerimizin kesintisiz, güvenli veya hatasız olacağını garanti etmez.
      </Paragraph>
      
      <Paragraph theme={theme}>
        Kanunların izin verdiği azami ölçüde, Teknova veya bağlı kuruluşları, hizmetlerimizin kullanımından kaynaklanan 
        veya bununla bağlantılı olan doğrudan, dolaylı, arızi, özel, sonuç niteliğindeki veya cezai zararlardan sorumlu olmayacaktır.
      </Paragraph>
      
      <Paragraph theme={theme}>
        Çeviri sonuçlarının doğruluğunu garanti etmiyoruz. Çeviri hizmetlerimiz, kritik kararlar, yasal belgeler veya 
        hassas iletişim için bir rehber olarak kullanılmalı ve profesyonel insan çevirmenler tarafından kontrol edilmelidir.
      </Paragraph>
      
      <SectionTitle theme={theme}>9. Tazminat</SectionTitle>
      
      <Paragraph theme={theme}>
        Bu şartları ihlal etmeniz veya Teknova hizmetlerini kullanmanız sonucunda ortaya çıkabilecek her türlü iddia, 
        talep, sorumluluk, zarar, kayıp ve masrafa karşı Teknova'yı, yöneticilerini, çalışanlarını ve temsilcilerini 
        savunmayı, tazmin etmeyi ve zarar görmemelerini sağlamayı kabul edersiniz.
      </Paragraph>
      
      <SectionTitle theme={theme}>10. Anlaşmanın Feshi</SectionTitle>
      
      <Paragraph theme={theme}>
        Teknova, herhangi bir zamanda, herhangi bir sebeple veya sebepsiz yere, bu şartları sonlandırabilir 
        veya hesabınızı askıya alabilir veya sonlandırabilir.
      </Paragraph>
      
      <Paragraph theme={theme}>
        Bu şartların feshedilmesi durumunda, Teknova hizmetlerini kullanma hakkınız sona erer ve 
        hesabınıza erişiminiz kaldırılabilir.
      </Paragraph>
      
      <SectionTitle theme={theme}>11. Genel Hükümler</SectionTitle>
      
      <SubSectionTitle theme={theme}>11.1 Geçerli Kanun</SubSectionTitle>
      
      <Paragraph theme={theme}>
        Bu Kullanım Şartları, Türkiye Cumhuriyeti kanunlarına göre yönetilir ve yorumlanır.
      </Paragraph>
      
      <SubSectionTitle theme={theme}>11.2 Anlaşmanın Bütünlüğü</SubSectionTitle>
      
      <Paragraph theme={theme}>
        Bu Kullanım Şartları, sizinle Teknova arasındaki tam anlaşmayı oluşturur ve bu konuyla ilgili 
        önceki tüm anlaşmaları, önerileri ve iletişimleri geçersiz kılar.
      </Paragraph>
      
      <SubSectionTitle theme={theme}>11.3 Feragat</SubSectionTitle>
      
      <Paragraph theme={theme}>
        Teknova'nın bu şartların herhangi bir hükmünü uygulamaması, o hükümden veya diğer herhangi bir 
        hükümden feragat ettiği anlamına gelmez.
      </Paragraph>
      
      <SubSectionTitle theme={theme}>11.4 Bölünebilirlik</SubSectionTitle>
      
      <Paragraph theme={theme}>
        Bu şartların herhangi bir hükmünün geçersiz veya uygulanamaz olduğu tespit edilirse, 
        kalan hükümler tam olarak yürürlükte ve etkili kalacaktır.
      </Paragraph>
      
      <SectionTitle theme={theme}>12. İletişim</SectionTitle>
      
      <Paragraph theme={theme}>
        Bu Kullanım Şartları hakkında herhangi bir sorunuz varsa, lütfen aşağıdaki bilgileri kullanarak bizimle iletişime geçin:
      </Paragraph>
      
      <Paragraph theme={theme}>
        <strong>Teknova A.Ş.</strong><br />
        E-posta: terms@teknova.com.tr<br />
        Adres: Teknova Plaza, Mustafa Kemal Mah. 2118. Cad. No: 4 06510 Çankaya/Ankara
      </Paragraph>
    </PageContainer>
  );
};

export default TermsPage; 