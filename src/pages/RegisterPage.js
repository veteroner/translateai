import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
`;

const FormContainer = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#1e2130' : '#ffffff'};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
`;

const FormTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${props => props.theme === 'dark' ? '#e5e7eb' : '#374151'};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme === 'dark' ? '#3a3f55' : '#d1d5db'};
  border-radius: 8px;
  background-color: ${props => props.theme === 'dark' ? '#2a2f45' : '#f9fafb'};
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme === 'dark' ? '#3b82f6' : '#2563eb'};
    box-shadow: 0 0 0 2px ${props => props.theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.3)'};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: ${props => props.theme === 'dark' ? '#3b82f6' : '#2563eb'};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#2563eb' : '#1d4ed8'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#7f1d1d' : '#fee2e2'};
  color: ${props => props.theme === 'dark' ? '#fee2e2' : '#7f1d1d'};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
`;

const LinkContainer = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
  
  a {
    color: ${props => props.theme === 'dark' ? '#3b82f6' : '#2563eb'};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const PasswordRequirements = styled.ul`
  margin-top: 0.5rem;
  padding-left: 1.25rem;
  font-size: 0.75rem;
  color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
`;

const RequirementItem = styled.li`
  margin-bottom: 0.25rem;
  color: ${props => props.met 
    ? props.theme === 'dark' ? '#34d399' : '#059669' 
    : props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
`;

const RegisterPage = () => {
  const { register } = useAuthContext();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Şifre gereksinimleri
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  // Kayıt işlemi
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Form doğrulama
    if (!displayName || !email || !password || !confirmPassword) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    
    if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      setError('Şifreniz belirtilen gereksinimleri karşılamıyor.');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await register(email, password, displayName);
      navigate('/');
    } catch (error) {
      console.error('Kayıt hatası:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        setError('Bu e-posta adresi zaten kullanılıyor.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Geçersiz e-posta adresi.');
      } else if (error.code === 'auth/weak-password') {
        setError('Şifre çok zayıf.');
      } else {
        setError('Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <PageContainer>
      <FormContainer theme={theme}>
        <FormTitle theme={theme}>Kayıt Ol</FormTitle>
        
        {error && <ErrorMessage theme={theme}>{error}</ErrorMessage>}
        
        <form onSubmit={handleRegister}>
          <FormGroup>
            <Label htmlFor="displayName" theme={theme}>Ad Soyad</Label>
            <Input 
              id="displayName"
              type="text" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Adınız ve soyadınız"
              theme={theme}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email" theme={theme}>E-posta</Label>
            <Input 
              id="email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresiniz"
              theme={theme}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password" theme={theme}>Şifre</Label>
            <Input 
              id="password"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifreniz"
              theme={theme}
              required
            />
            <PasswordRequirements theme={theme}>
              <RequirementItem theme={theme} met={hasMinLength}>En az 8 karakter</RequirementItem>
              <RequirementItem theme={theme} met={hasUpperCase}>En az bir büyük harf</RequirementItem>
              <RequirementItem theme={theme} met={hasLowerCase}>En az bir küçük harf</RequirementItem>
              <RequirementItem theme={theme} met={hasNumber}>En az bir rakam</RequirementItem>
              <RequirementItem theme={theme} met={hasSpecialChar}>En az bir özel karakter</RequirementItem>
            </PasswordRequirements>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="confirmPassword" theme={theme}>Şifre Tekrar</Label>
            <Input 
              id="confirmPassword"
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Şifrenizi tekrar girin"
              theme={theme}
              required
            />
          </FormGroup>
          
          <Button 
            type="submit" 
            disabled={loading}
            theme={theme}
          >
            {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
          </Button>
        </form>
        
        <LinkContainer theme={theme}>
          Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
        </LinkContainer>
      </FormContainer>
    </PageContainer>
  );
};

export default RegisterPage; 