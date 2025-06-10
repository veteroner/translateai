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

const Paragraph = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-size: 1.1rem;
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#374151'};
`;

const TeamContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 2rem;
  margin-bottom: 3rem;
`;

const TeamMember = styled.div`
  flex: 1;
  min-width: 250px;
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px ${props => props.theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
`;

const MemberImage = styled.div`
  height: 200px;
  background-color: ${props => props.theme === 'dark' ? '#374151' : '#e5e7eb'};
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
`;

const MemberInfo = styled.div`
  padding: 1.5rem;
`;

const MemberName = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
`;

const MemberTitle = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
  margin-bottom: 1rem;
`;

const MemberBio = styled.p`
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
`;

const AboutPage = () => {
  const { theme } = useTheme();

  return (
    <PageContainer>
      <PageTitle theme={theme}>Hakkımızda</PageTitle>
      
      <Paragraph theme={theme}>
        Teknova, dil bariyerlerini yıkmak ve global iletişimi kolaylaştırmak amacıyla 2023 yılında kurulmuş bir teknoloji şirketidir. 
        Yapay zeka destekli çeviri çözümlerimiz ile kullanıcılarımıza hızlı, doğru ve güvenilir dil hizmetleri sunuyoruz.
      </Paragraph>
      
      <Paragraph theme={theme}>
        Misyonumuz, ileri teknoloji ve doğal dil işleme sistemleri kullanarak diller arasındaki engelleri kaldırmak ve herkesin 
        ana dilinde bilgiye erişimini kolaylaştırmaktır. Vizyonumuz ise, yapay zeka destekli çeviri alanında lider konuma gelerek 
        global iletişime yön veren bir teknoloji markası olmaktır.
      </Paragraph>
      
      <SectionTitle theme={theme}>Neden Biz?</SectionTitle>
      
      <Paragraph theme={theme}>
        <strong>İleri Teknoloji:</strong> En son yapay zeka ve doğal dil işleme teknolojilerini kullanarak yüksek doğrulukta çeviriler sunuyoruz.
      </Paragraph>
      
      <Paragraph theme={theme}>
        <strong>Çoklu Dosya Desteği:</strong> PDF, Word, PowerPoint gibi farklı formatlardaki belgeleri kolayca çevirebilirsiniz.
      </Paragraph>
      
      <Paragraph theme={theme}>
        <strong>Kullanıcı Odaklı Tasarım:</strong> Kolay kullanılabilir arayüzümüz sayesinde teknik bilgiye gerek kalmadan profesyonel çeviriler elde edebilirsiniz.
      </Paragraph>
      
      <Paragraph theme={theme}>
        <strong>Gizlilik ve Güvenlik:</strong> Verilerinizin güvenliği bizim için en önemli önceliktir. Tüm çevirileriniz güvenli bir şekilde saklanır ve korunur.
      </Paragraph>
      
      <SectionTitle theme={theme}>Ekibimiz</SectionTitle>
      
      <TeamContainer>
        <TeamMember theme={theme}>
          <MemberImage theme={theme} image="https://randomuser.me/api/portraits/men/32.jpg" />
          <MemberInfo>
            <MemberName theme={theme}>Ahmet Yılmaz</MemberName>
            <MemberTitle theme={theme}>Kurucu & CEO</MemberTitle>
            <MemberBio theme={theme}>
              10 yılı aşkın yazılım ve yapay zeka deneyimi ile Teknova'yı kurmuştur. Öncesinde Google ve Microsoft'ta çalışmıştır.
            </MemberBio>
          </MemberInfo>
        </TeamMember>
        
        <TeamMember theme={theme}>
          <MemberImage theme={theme} image="https://randomuser.me/api/portraits/women/44.jpg" />
          <MemberInfo>
            <MemberName theme={theme}>Ayşe Kaya</MemberName>
            <MemberTitle theme={theme}>CTO</MemberTitle>
            <MemberBio theme={theme}>
              Doğal dil işleme ve makine öğrenimi konusunda uzman. Çeviri teknolojilerimizin teknik altyapısını yönetmektedir.
            </MemberBio>
          </MemberInfo>
        </TeamMember>
        
        <TeamMember theme={theme}>
          <MemberImage theme={theme} image="https://randomuser.me/api/portraits/men/59.jpg" />
          <MemberInfo>
            <MemberName theme={theme}>Mehmet Demir</MemberName>
            <MemberTitle theme={theme}>Ürün Müdürü</MemberTitle>
            <MemberBio theme={theme}>
              Kullanıcı deneyimi ve ürün geliştirme konusunda 8 yıllık tecrübesi ile ürünlerimizin geliştirilmesine liderlik etmektedir.
            </MemberBio>
          </MemberInfo>
        </TeamMember>
      </TeamContainer>
      
      <SectionTitle theme={theme}>Tarihçemiz</SectionTitle>
      
      <Paragraph theme={theme}>
        2023 yılında yapay zeka odaklı çeviri hizmetleri sunmak üzere yola çıkan şirketimiz, kısa sürede büyüyerek sektörde önemli bir oyuncu haline gelmiştir. 
        Başlangıçta sadece metin çevirisi ile hizmet verirken, zamanla belge çevirisi, sesli çeviri ve gerçek zamanlı çeviri gibi farklı çözümler de 
        portföyümüze eklenmiştir.
      </Paragraph>
      
      <Paragraph theme={theme}>
        Bugün Teknova olarak, 15+ dilde profesyonel çeviri hizmetleri sunuyor ve her gün binlerce kullanıcının iletişim kurmasına 
        yardımcı oluyoruz. Geleceğe yönelik hedeflerimiz arasında yeni diller eklemek, yapay zeka modellerimizi geliştirmek ve 
        mobil uygulamamızı hayata geçirmek bulunmaktadır.
      </Paragraph>
    </PageContainer>
  );
};

export default AboutPage; 