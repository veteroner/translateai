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

const ForgotPassword = styled.div`
  margin-top: 1rem;
  text-align: right;
  
  a {
    color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
    font-size: 0.875rem;
    text-decoration: none;
    
    &:hover {
      color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#374151'};
      text-decoration: underline;
    }
  }
`;

const LoginPage = () => {
  const { login, resetPassword } = useAuthContext();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  // Giriş işlemi
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Lütfen e-posta ve şifrenizi girin.');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Giriş hatası:', error);
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('E-posta veya şifre hatalı.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin.');
      } else {
        setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Şifre sıfırlama
  const handleResetPassword = async () => {
    if (!email) {
      setError('Lütfen şifre sıfırlama için e-posta adresinizi girin.');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await resetPassword(email);
      setResetSent(true);
    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error);
      
      if (error.code === 'auth/user-not-found') {
        setError('Bu e-posta adresi ile kayıtlı bir kullanıcı bulunamadı.');
      } else {
        setError('Şifre sıfırlama e-postası gönderilirken bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <PageContainer>
      <FormContainer theme={theme}>
        <FormTitle theme={theme}>Giriş Yap</FormTitle>
        
        {error && <ErrorMessage theme={theme}>{error}</ErrorMessage>}
        {resetSent && (
          <div style={{ 
            backgroundColor: theme === 'dark' ? '#065f46' : '#d1fae5',
            color: theme === 'dark' ? '#d1fae5' : '#065f46',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}>
            Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.
          </div>
        )}
        
        <form onSubmit={handleLogin}>
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
          </FormGroup>
          
          <Button 
            type="submit" 
            disabled={loading}
            theme={theme}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </Button>
          
          <ForgotPassword theme={theme}>
            <button 
              onClick={handleResetPassword}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                fontSize: '0.875rem',
                padding: 0,
                textDecoration: 'none'
              }}
            >
              Şifremi Unuttum
            </button>
          </ForgotPassword>
        </form>
        
        <LinkContainer theme={theme}>
          Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link>
        </LinkContainer>
      </FormContainer>
    </PageContainer>
  );
};

export default LoginPage; 