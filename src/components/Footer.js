import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

// Styled Components
const FooterContainer = styled.footer`
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#f9fafb'};
  padding: 2rem 1rem;
  border-top: 1px solid ${props => props.theme === 'dark' ? '#374151' : '#e5e7eb'};
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
`;

const FooterLink = styled(Link)`
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
  text-decoration: none;
  font-size: 0.875rem;
  
  &:hover {
    color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
    text-decoration: underline;
  }
`;

const ExternalLink = styled.a`
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
  text-decoration: none;
  font-size: 0.875rem;
  
  &:hover {
    color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
    text-decoration: underline;
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme === 'dark' ? '#374151' : '#e5e7eb'};
  color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
  font-size: 0.875rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const SocialIcon = styled.a`
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
  
  &:hover {
    color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const Footer = () => {
  const { theme } = useTheme();
  
  return (
    <FooterContainer theme={theme}>
      <FooterContent>
        <FooterSection>
          <SectionTitle theme={theme}>Teknova</SectionTitle>
          <FooterLink to="/" theme={theme}>Ana Sayfa</FooterLink>
          <FooterLink to="/about" theme={theme}>Hakkında</FooterLink>
          <FooterLink to="/contact" theme={theme}>İletişim</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <SectionTitle theme={theme}>Hizmetler</SectionTitle>
          <FooterLink to="/pricing" theme={theme}>Fiyatlandırma</FooterLink>
          <FooterLink to="/business" theme={theme}>Kurumsal</FooterLink>
          <FooterLink to="/api" theme={theme}>API</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <SectionTitle theme={theme}>Kaynaklar</SectionTitle>
          <FooterLink to="/blog" theme={theme}>Blog</FooterLink>
          <FooterLink to="/docs" theme={theme}>Dokümantasyon</FooterLink>
          <ExternalLink href="https://github.com/teknova" target="_blank" rel="noopener noreferrer" theme={theme}>GitHub</ExternalLink>
        </FooterSection>
        
        <FooterSection>
          <SectionTitle theme={theme}>Yasal</SectionTitle>
          <FooterLink to="/privacy" theme={theme}>Gizlilik Politikası</FooterLink>
          <FooterLink to="/terms" theme={theme}>Kullanım Şartları</FooterLink>
          <FooterLink to="/cookies" theme={theme}>Çerez Politikası</FooterLink>
        </FooterSection>
      </FooterContent>
      
      <Copyright theme={theme}>
        © 2025 Teknova. Tüm hakları saklıdır.
        
        <SocialLinks>
          <SocialIcon href="https://twitter.com/teknova" target="_blank" rel="noopener noreferrer" theme={theme} aria-label="Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.162 5.656c-0.764 0.341-1.591 0.574-2.457 0.676 0.884-0.53 1.558-1.367 1.877-2.362-0.826 0.492-1.739 0.845-2.705 1.036-0.775-0.828-1.879-1.346-3.101-1.346-2.344 0-4.244 1.9-4.244 4.244 0 0.333 0.034 0.656 0.103 0.968-3.524-0.176-6.651-1.864-8.743-4.431-0.366 0.628-0.577 1.358-0.577 2.137 0 1.473 0.75 2.774 1.886 3.534-0.694-0.020-1.345-0.213-1.914-0.529v0.051c0 2.057 1.464 3.773 3.402 4.161-0.355 0.097-0.729 0.147-1.116 0.147-0.273 0-0.538-0.024-0.797-0.073 0.543 1.687 2.108 2.916 3.965 2.951-1.453 1.137-3.283 1.816-5.274 1.816-0.343 0-0.68-0.020-1.012-0.059 1.879 1.207 4.114 1.908 6.51 1.908 7.816 0 12.090-6.476 12.090-12.090 0-0.184-0.003-0.368-0.011-0.551 0.833-0.6 1.549-1.35 2.119-2.207z"></path>
            </svg>
          </SocialIcon>
          
          <SocialIcon href="https://facebook.com/teknova" target="_blank" rel="noopener noreferrer" theme={theme} aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.469h3.047v-2.643c0-3.008 1.793-4.669 4.533-4.669 1.312 0 2.686 0.234 2.686 0.234v2.953h-1.514c-1.491 0-1.956 0.925-1.956 1.875v2.25h3.328l-0.532 3.469h-2.797v8.385c5.738-0.901 10.127-5.864 10.127-11.854z"></path>
            </svg>
          </SocialIcon>
          
          <SocialIcon href="https://linkedin.com/company/teknova" target="_blank" rel="noopener noreferrer" theme={theme} aria-label="LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.999 3h-16c-0.553 0-1 0.447-1 1v16c0 0.553 0.447 1 1 1h16c0.553 0 1-0.447 1-1v-16c0-0.553-0.447-1-1-1zM8.999 18.999h-3v-9h3v9zM7.499 8.999c-0.828 0-1.5-0.672-1.5-1.5 0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5c0 0.828-0.672 1.5-1.5 1.5zM19 18.999h-3v-4.5c0-1.105-0.895-2-2-2s-2 0.895-2 2v4.5h-3v-9h3v1.5c0.719-0.896 1.822-1.5 3-1.5 2.209 0 4 1.791 4 4v5z"></path>
            </svg>
          </SocialIcon>
        </SocialLinks>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer; 