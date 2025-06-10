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

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const BlogCard = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px ${props => props.theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const BlogImage = styled.div`
  height: 200px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
`;

const BlogContent = styled.div`
  padding: 1.5rem;
`;

const BlogTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
`;

const BlogMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
`;

const BlogExcerpt = styled.p`
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const ReadMoreButton = styled.button`
  background-color: ${props => props.theme === 'dark' ? '#3b82f6' : '#2563eb'};
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#60a5fa' : '#1d4ed8'};
  }
`;

const FeaturedPost = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px ${props => props.theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
  margin-bottom: 3rem;
  
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

const FeaturedImage = styled.div`
  height: 300px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  
  @media (min-width: 768px) {
    height: 100%;
  }
`;

const FeaturedContent = styled.div`
  padding: 2rem;
`;

const FeaturedTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
`;

const FeaturedMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
`;

const FeaturedExcerpt = styled.p`
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const BlogPage = () => {
  const { theme } = useTheme();
  
  const blogPosts = [
    {
      id: 1,
      title: 'Yapay Zeka ve Çeviri Teknolojilerinde Son Gelişmeler',
      date: '15 Mayıs 2024',
      author: 'Ahmet Yılmaz',
      excerpt: 'Yapay zeka teknolojilerindeki son gelişmeler, özellikle doğal dil işleme alanında çeviri kalitesini nasıl artırıyor? Bu yazıda, en yeni yapay zeka modellerinin çeviri sektörüne etkilerini inceliyoruz.',
      image: 'https://images.unsplash.com/photo-1677442135568-6014ba0423f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8QUl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'
    },
    {
      id: 2,
      title: 'Çoklu Belge Çevirisi: Verimli İş Akışları Oluşturma',
      date: '28 Nisan 2024',
      author: 'Ayşe Kaya',
      excerpt: 'Büyük çapta belge çevirileri için en iyi uygulamalar ve iş akışları. Kurumsal müşterilerimizin büyük projelerini nasıl daha verimli yönetebileceklerine dair ipuçları.',
      image: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRvY3VtZW50c3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
    },
    {
      id: 3,
      title: 'Terminoloji Yönetimi ve Tutarlı Çeviriler',
      date: '10 Nisan 2024',
      author: 'Mehmet Demir',
      excerpt: 'Başarılı yerelleştirme projelerinin anahtarı: Tutarlı terminoloji yönetimi. Kurumsal kimliğinizi koruyan ve marka tutarlılığı sağlayan çeviri stratejileri.',
      image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHdvcmRzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'
    },
    {
      id: 4,
      title: 'API Entegrasyonu ile Otomatik Çeviri Süreçleri',
      date: '22 Mart 2024',
      author: 'Zeynep Aydın',
      excerpt: 'Teknova API\'sini kullanarak kendi sistemlerinizle nasıl entegrasyon sağlayabilir ve çeviri süreçlerinizi otomatikleştirebilirsiniz? Adım adım rehberimizle tanışın.',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29kZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
    },
    {
      id: 5,
      title: 'E-Ticaret Siteleri İçin Çeviri Optimizasyonu',
      date: '15 Mart 2024',
      author: 'Ali Yıldız',
      excerpt: 'Global pazarlara açılmak isteyen e-ticaret siteleri için çeviri stratejileri. Ürün açıklamalarından müşteri deneyimine, tüm içeriklerin çevirisinde dikkat edilmesi gerekenler.',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWNvbW1lcmNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'
    },
    {
      id: 6,
      title: 'Yasal Belgeler ve Hassas Çeviri Gereksinimleri',
      date: '2 Mart 2024',
      author: 'Selin Taner',
      excerpt: 'Yasal ve resmi belgelerin çevirisinde dikkat edilmesi gereken hususlar ve yasal gerekliliklere uygun çeviri süreçlerinin yönetimi.',
      image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bGVnYWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'
    }
  ];

  const featuredPost = {
    id: 0,
    title: 'Teknova Yapay Zeka Modelimiz ile Çevirilerde Yeni Bir Çağ Başlıyor',
    date: '1 Haziran 2024',
    author: 'Ahmet Yılmaz',
    excerpt: 'Bugün, yapay zeka destekli çeviri teknolojimizde devrim niteliğinde bir güncellemeyi duyurmaktan heyecan duyuyoruz! Yeni nesil modelimiz, önceki versiyona göre %40 daha doğru çeviriler sunuyor ve 15 yeni dil desteği getiriyor. Teknova AI 2.0 olarak adlandırdığımız bu güncelleme, özellikle teknik metinler, yasal belgeler ve edebi çevirilerde benzersiz doğruluk ve doğallık sağlıyor. Yeni modelimiz, dil nüanslarını ve kültürel bağlamları anlama konusunda çığır açan gelişmeler içeriyor. Kullanıcılarımız artık daha az düzeltme gereksinimi ile daha hızlı ve kaliteli çeviriler alabilecekler.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YWklMjB0cmFuc2xhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
  };

  return (
    <PageContainer>
      <PageTitle theme={theme}>Blog</PageTitle>
      
      <FeaturedPost theme={theme}>
        <FeaturedImage theme={theme} image={featuredPost.image} />
        <FeaturedContent>
          <FeaturedTitle theme={theme}>{featuredPost.title}</FeaturedTitle>
          <FeaturedMeta theme={theme}>
            <span>{featuredPost.date}</span>
            <span>Yazar: {featuredPost.author}</span>
          </FeaturedMeta>
          <FeaturedExcerpt theme={theme}>{featuredPost.excerpt}</FeaturedExcerpt>
          <ReadMoreButton theme={theme}>Devamını Oku</ReadMoreButton>
        </FeaturedContent>
      </FeaturedPost>
      
      <BlogGrid>
        {blogPosts.map(post => (
          <BlogCard key={post.id} theme={theme}>
            <BlogImage theme={theme} image={post.image} />
            <BlogContent>
              <BlogTitle theme={theme}>{post.title}</BlogTitle>
              <BlogMeta theme={theme}>
                <span>{post.date}</span>
                <span>Yazar: {post.author}</span>
              </BlogMeta>
              <BlogExcerpt theme={theme}>{post.excerpt}</BlogExcerpt>
              <ReadMoreButton theme={theme}>Devamını Oku</ReadMoreButton>
            </BlogContent>
          </BlogCard>
        ))}
      </BlogGrid>
    </PageContainer>
  );
};

export default BlogPage; 