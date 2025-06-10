import React, { useState } from 'react';
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

const ContactSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ContactForm = styled.form`
  flex: 3;
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px ${props => props.theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
`;

const ContactInfo = styled.div`
  flex: 2;
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px ${props => props.theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#374151'};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid ${props => props.theme === 'dark' ? '#4b5563' : '#d1d5db'};
  background-color: ${props => props.theme === 'dark' ? '#374151' : '#ffffff'};
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme === 'dark' ? '#60a5fa' : '#3b82f6'};
    box-shadow: 0 0 0 3px ${props => props.theme === 'dark' ? 'rgba(96, 165, 250, 0.3)' : 'rgba(59, 130, 246, 0.3)'};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid ${props => props.theme === 'dark' ? '#4b5563' : '#d1d5db'};
  background-color: ${props => props.theme === 'dark' ? '#374151' : '#ffffff'};
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
  resize: vertical;
  min-height: 150px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme === 'dark' ? '#60a5fa' : '#3b82f6'};
    box-shadow: 0 0 0 3px ${props => props.theme === 'dark' ? 'rgba(96, 165, 250, 0.3)' : 'rgba(59, 130, 246, 0.3)'};
  }
`;

const Button = styled.button`
  background-color: ${props => props.theme === 'dark' ? '#3b82f6' : '#2563eb'};
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#60a5fa' : '#1d4ed8'};
  }
  
  &:disabled {
    background-color: ${props => props.theme === 'dark' ? '#6b7280' : '#9ca3af'};
    cursor: not-allowed;
  }
`;

const InfoTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
`;

const InfoItem = styled.div`
  margin-bottom: 1.5rem;
`;

const InfoLabel = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#374151'};
`;

const InfoValue = styled.div`
  color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
`;

const SocialMediaLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const SocialLink = styled.a`
  color: ${props => props.theme === 'dark' ? '#60a5fa' : '#2563eb'};
  font-size: 1.5rem;
  
  &:hover {
    color: ${props => props.theme === 'dark' ? '#93c5fd' : '#3b82f6'};
  }
`;

const SuccessMessage = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#065f46' : '#d1fae5'};
  color: ${props => props.theme === 'dark' ? '#d1fae5' : '#065f46'};
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
`;

const ContactPage = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simüle edilmiş form gönderimi
    setTimeout(() => {
      console.log('Form data:', formData);
      setSuccess(true);
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // 5 saniye sonra başarı mesajını kaldır
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    }, 1500);
  };
  
  return (
    <PageContainer>
      <PageTitle theme={theme}>İletişim</PageTitle>
      
      <ContactSection>
        <ContactForm theme={theme} onSubmit={handleSubmit}>
          {success && (
            <SuccessMessage theme={theme}>
              Mesajınız başarıyla gönderilmiştir. En kısa sürede size dönüş yapacağız.
            </SuccessMessage>
          )}
          
          <FormGroup>
            <Label theme={theme}>Ad Soyad</Label>
            <Input 
              type="text" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              required
              theme={theme}
            />
          </FormGroup>
          
          <FormGroup>
            <Label theme={theme}>E-posta Adresi</Label>
            <Input 
              type="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              required
              theme={theme}
            />
          </FormGroup>
          
          <FormGroup>
            <Label theme={theme}>Konu</Label>
            <Input 
              type="text" 
              name="subject" 
              value={formData.subject}
              onChange={handleChange}
              required
              theme={theme}
            />
          </FormGroup>
          
          <FormGroup>
            <Label theme={theme}>Mesaj</Label>
            <Textarea 
              name="message" 
              value={formData.message}
              onChange={handleChange}
              required
              theme={theme}
            />
          </FormGroup>
          
          <Button type="submit" disabled={isSubmitting} theme={theme}>
            {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
          </Button>
        </ContactForm>
        
        <ContactInfo theme={theme}>
          <InfoTitle theme={theme}>İletişim Bilgileri</InfoTitle>
          
          <InfoItem>
            <InfoLabel theme={theme}>Adres</InfoLabel>
            <InfoValue theme={theme}>
              Teknova Plaza, Levent Mah.<br />
              Büyükdere Cad. No:128<br />
              Şişli, İstanbul 34394
            </InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel theme={theme}>Telefon</InfoLabel>
            <InfoValue theme={theme}>+90 (212) 555 12 34</InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel theme={theme}>E-posta</InfoLabel>
            <InfoValue theme={theme}>info@teknova.com.tr</InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel theme={theme}>Çalışma Saatleri</InfoLabel>
            <InfoValue theme={theme}>
              Pazartesi - Cuma: 09:00 - 18:00<br />
              Hafta sonu kapalı
            </InfoValue>
          </InfoItem>
          
          <SocialMediaLinks>
            <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer" theme={theme}>
              <i className="fab fa-facebook"></i>
            </SocialLink>
            <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer" theme={theme}>
              <i className="fab fa-twitter"></i>
            </SocialLink>
            <SocialLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer" theme={theme}>
              <i className="fab fa-linkedin"></i>
            </SocialLink>
            <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer" theme={theme}>
              <i className="fab fa-instagram"></i>
            </SocialLink>
          </SocialMediaLinks>
        </ContactInfo>
      </ContactSection>
    </PageContainer>
  );
};

export default ContactPage; 