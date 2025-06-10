import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { useAuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';
import Modal from '../components/ui/Modal';

// Styled Components
const PageContainer = styled.div`
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
`;

const Subtitle = styled.p`
  text-align: center;
  margin-bottom: 3rem;
  font-size: 1.25rem;
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
`;

const PlansContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 3rem;
`;

const PlanCard = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 350px;
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px ${props => props.theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
  display: flex;
  flex-direction: column;
  border: ${props => props.featured ? 
    `2px solid ${props.theme === 'dark' ? '#3b82f6' : '#2563eb'}` : 
    `1px solid ${props.theme === 'dark' ? '#374151' : '#e5e7eb'}`
  };
  transform: ${props => props.featured ? 'scale(1.05)' : 'scale(1)'};
  z-index: ${props => props.featured ? '1' : '0'};
  
  @media (max-width: 768px) {
    transform: scale(1);
  }
`;

const PlanName = styled.h2`
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 1rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
`;

const FeaturedBadge = styled.span`
  background-color: ${props => props.theme === 'dark' ? '#3b82f6' : '#2563eb'};
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  display: inline-block;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 600;
  text-transform: uppercase;
`;

const PriceContainer = styled.div`
  margin: 1.5rem 0;
  text-align: center;
`;

const Price = styled.span`
  font-size: 3rem;
  font-weight: 700;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
`;

const Currency = styled.span`
  font-size: 1.5rem;
  vertical-align: top;
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
`;

const Period = styled.span`
  color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
  font-size: 1rem;
`;

const FeaturesList = styled.ul`
  margin: 1.5rem 0;
  list-style-type: none;
  padding: 0;
  flex: 1;
`;

const Feature = styled.li`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
  
  &:before {
    content: "✓";
    color: ${props => props.theme === 'dark' ? '#10b981' : '#059669'};
    font-weight: bold;
    margin-right: 0.5rem;
  }
`;

const NotIncluded = styled.li`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  color: ${props => props.theme === 'dark' ? '#9ca3af' : '#9ca3af'};
  text-decoration: line-through;
  
  &:before {
    content: "✕";
    color: ${props => props.theme === 'dark' ? '#ef4444' : '#dc2626'};
    font-weight: bold;
    margin-right: 0.5rem;
  }
`;

const Button = styled.button`
  background-color: ${props => props.featured ? 
    (props.theme === 'dark' ? '#3b82f6' : '#2563eb') : 
    (props.theme === 'dark' ? '#374151' : '#f3f4f6')
  };
  color: ${props => props.featured ? 
    'white' : 
    (props.theme === 'dark' ? '#f3f4f6' : '#111827')
  };
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  margin-top: auto;
  
  &:hover {
    background-color: ${props => props.featured ? 
      (props.theme === 'dark' ? '#60a5fa' : '#1d4ed8') : 
      (props.theme === 'dark' ? '#4b5563' : '#e5e7eb')
    };
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  width: 100%;
`;

const ComparisonSection = styled.div`
  margin-top: 4rem;
`;

const ComparisonTitle = styled.h2`
  font-size: 1.75rem;
  text-align: center;
  margin-bottom: 2rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 3rem;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#f3f4f6'};
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
  font-weight: 600;
  
  &:first-child {
    border-top-left-radius: 0.5rem;
  }
  
  &:last-child {
    border-top-right-radius: 0.5rem;
  }
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#374151' : '#e5e7eb'};
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
`;

const FAQSection = styled.div`
  margin-top: 4rem;
`;

const FAQTitle = styled.h2`
  font-size: 1.75rem;
  text-align: center;
  margin-bottom: 2rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
`;

const FAQContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
`;

const FAQItem = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px ${props => props.theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
`;

const FAQQuestion = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
`;

const FAQAnswer = styled.p`
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
  line-height: 1.6;
`;

const PricingPage = () => {
  const { theme } = useTheme();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const handlePlanSelect = (plan) => {
    if (!user) {
      // Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
      navigate('/login', { state: { returnPath: '/pricing' } });
      return;
    }
    
    if (plan.name === 'Kurumsal') {
      // Kurumsal plan için iletişim sayfasına yönlendir
      navigate('/contact');
      return;
    }
    
    if (plan.name === 'Ücretsiz') {
      // Ücretsiz plan için modal gösterme
      return;
    }
    
    // Ödeme modalını aç
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };
  
  const handlePaymentSuccess = () => {
    // Ödeme başarılı olduğunda modalı kapat
    setTimeout(() => {
      setShowPaymentModal(false);
      // Kullanıcıyı ana sayfaya yönlendir
      navigate('/');
    }, 2000);
  };
  
  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
  };
  
  const plans = [
    {
      name: 'Ücretsiz',
      price: '0',
      period: 'sonsuza dek',
      features: [
        'Günlük 5.000 karakter çeviri',
        'Metin çevirisi',
        'PDF ve Word belgeleri (10MB)',
        'Temel dil desteği (10+ dil)',
        'Tarayıcı üzerinden erişim'
      ],
      notIncluded: [
        'API erişimi',
        'Gelişmiş dil desteği',
        'Öncelikli destek',
        'Çeviri geçmişi (7 gün)'
      ],
      featured: false,
      button: user ? 'Mevcut Plan' : 'Ücretsiz Başla'
    },
    {
      name: 'Premium',
      price: '49',
      period: 'aylık',
      features: [
        'Sınırsız karakter çeviri',
        'Tüm belge formatları (100MB)',
        'Gelişmiş dil desteği (40+ dil)',
        'API erişimi',
        'Özelleştirilmiş çeviriler',
        'Terminoloji yönetimi',
        'Çeviri geçmişi (sınırsız)',
        '7/24 öncelikli destek'
      ],
      notIncluded: [],
      featured: true,
      button: user ? 'Yükselt' : 'Premium\'a Geç'
    },
    {
      name: 'Kurumsal',
      price: 'Özel',
      period: '',
      features: [
        'Sınırsız karakter çeviri',
        'Tüm belgeler için tam destek',
        'Özel yapay zeka modelleri',
        'Gelişmiş API erişimi',
        'Özel terminoloji yönetimi',
        'Ekip işbirliği özellikleri',
        'Özel entegrasyonlar',
        'Özel SLA ve destek'
      ],
      notIncluded: [],
      featured: false,
      button: 'İletişime Geç'
    }
  ];
  
  const faqs = [
    {
      question: 'Ücretsiz plan ile ne kadar çeviri yapabilirim?',
      answer: 'Ücretsiz planda günlük 5.000 karakter çeviri yapabilirsiniz. Bu yaklaşık olarak 1-2 sayfalık bir belgeye denk gelmektedir.'
    },
    {
      question: 'Ödeme yaptıktan sonra Premium plana hemen geçiş yapabilir miyim?',
      answer: 'Evet, ödemeniz onaylandıktan hemen sonra Premium plan özelliklerine erişim sağlayabilirsiniz. Herhangi bir aktivasyon bekleme süresi yoktur.'
    },
    {
      question: 'Premium plan için aylık ödeme dışında farklı ödeme seçenekleri var mı?',
      answer: 'Evet, Premium plan için yıllık ödeme seçeneğimiz de bulunmaktadır. Yıllık ödeme yaparak %20 indirim kazanabilirsiniz.'
    },
    {
      question: 'API erişimi ile neler yapabilirim?',
      answer: 'Premium ve Kurumsal planlarda sunulan API erişimi ile kendi uygulamalarınıza çeviri özelliği ekleyebilir, otomatik çeviri işlemleri oluşturabilir ve özel sistemlerle entegrasyon sağlayabilirsiniz.'
    },
    {
      question: 'İstediğim zaman planlar arasında geçiş yapabilir miyim?',
      answer: 'Evet, istediğiniz zaman planlar arasında geçiş yapabilirsiniz. Ücretsiz plandan Premium\'a yükseltme anında gerçekleşir. Premium\'dan Ücretsiz\'e geçmek isterseniz, mevcut abonelik sürenizin sonunda gerçekleşir.'
    }
  ];
  
  return (
    <PageContainer>
      <PageTitle theme={theme}>Fiyatlandırma</PageTitle>
      <Subtitle theme={theme}>İhtiyaçlarınıza uygun, ekonomik çeviri planlarımız</Subtitle>
      
      <PlansContainer>
        {plans.map((plan, index) => (
          <PlanCard key={index} theme={theme} featured={plan.featured}>
            {plan.featured && <FeaturedBadge theme={theme}>En Popüler</FeaturedBadge>}
            <PlanName theme={theme}>{plan.name}</PlanName>
            
            <PriceContainer>
              {plan.name !== 'Kurumsal' ? (
                <>
                  <Currency theme={theme}>₺</Currency>
                  <Price theme={theme}>{plan.price}</Price>
                  {plan.period && <Period theme={theme}>/{plan.period}</Period>}
                </>
              ) : (
                <Price theme={theme}>{plan.price}</Price>
              )}
            </PriceContainer>
            
            <FeaturesList>
              {plan.features.map((feature, i) => (
                <Feature key={i} theme={theme}>{feature}</Feature>
              ))}
              
              {plan.notIncluded.map((feature, i) => (
                <NotIncluded key={i} theme={theme}>{feature}</NotIncluded>
              ))}
            </FeaturesList>
            
            {plan.name === 'Kurumsal' ? (
              <StyledLink to="/contact">
                <Button featured={plan.featured} theme={theme}>
                  {plan.button}
                </Button>
              </StyledLink>
            ) : (
              <Button 
                featured={plan.featured} 
                theme={theme}
                onClick={() => handlePlanSelect(plan)}
              >
                {plan.button}
              </Button>
            )}
          </PlanCard>
        ))}
      </PlansContainer>
      
      <ComparisonSection>
        <ComparisonTitle theme={theme}>Plan Karşılaştırması</ComparisonTitle>
        
        <Table>
          <thead>
            <tr>
              <Th theme={theme}>Özellik</Th>
              <Th theme={theme}>Ücretsiz</Th>
              <Th theme={theme}>Premium</Th>
              <Th theme={theme}>Kurumsal</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td theme={theme}>Günlük Çeviri Limiti</Td>
              <Td theme={theme}>5.000 karakter</Td>
              <Td theme={theme}>Sınırsız</Td>
              <Td theme={theme}>Sınırsız</Td>
            </tr>
            <tr>
              <Td theme={theme}>Desteklenen Diller</Td>
              <Td theme={theme}>10+ dil</Td>
              <Td theme={theme}>40+ dil</Td>
              <Td theme={theme}>40+ dil</Td>
            </tr>
            <tr>
              <Td theme={theme}>Belge Çevirisi</Td>
              <Td theme={theme}>Temel (PDF, Word)</Td>
              <Td theme={theme}>Tüm formatlar</Td>
              <Td theme={theme}>Tüm formatlar + Özel</Td>
            </tr>
            <tr>
              <Td theme={theme}>Maksimum Dosya Boyutu</Td>
              <Td theme={theme}>10MB</Td>
              <Td theme={theme}>100MB</Td>
              <Td theme={theme}>Özel limit</Td>
            </tr>
            <tr>
              <Td theme={theme}>Çeviri Geçmişi</Td>
              <Td theme={theme}>7 gün</Td>
              <Td theme={theme}>Sınırsız</Td>
              <Td theme={theme}>Sınırsız</Td>
            </tr>
            <tr>
              <Td theme={theme}>API Erişimi</Td>
              <Td theme={theme}>-</Td>
              <Td theme={theme}>Var</Td>
              <Td theme={theme}>Gelişmiş</Td>
            </tr>
            <tr>
              <Td theme={theme}>Müşteri Desteği</Td>
              <Td theme={theme}>E-posta</Td>
              <Td theme={theme}>7/24 öncelikli</Td>
              <Td theme={theme}>Özel temsilci</Td>
            </tr>
          </tbody>
        </Table>
      </ComparisonSection>
      
      <FAQSection>
        <FAQTitle theme={theme}>Sıkça Sorulan Sorular</FAQTitle>
        
        <FAQContainer>
          {faqs.map((faq, index) => (
            <FAQItem key={index} theme={theme}>
              <FAQQuestion theme={theme}>{faq.question}</FAQQuestion>
              <FAQAnswer theme={theme}>{faq.answer}</FAQAnswer>
            </FAQItem>
          ))}
        </FAQContainer>
      </FAQSection>
      
      <Modal
        isOpen={showPaymentModal}
        onClose={handlePaymentCancel}
        width="600px"
      >
        {selectedPlan && (
          <PaymentForm 
            planType={selectedPlan.name.toLowerCase()} 
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        )}
      </Modal>
    </PageContainer>
  );
};

export default PricingPage; 