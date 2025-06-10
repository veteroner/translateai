import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Styled Components
const HeaderContainer = styled.header`
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color 0.3s ease;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
    margin-left: 0.5rem;
  }
  
  svg {
    width: 32px;
    height: 32px;
    fill: ${props => props.theme === 'dark' ? '#3b82f6' : '#2563eb'};
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 1.2rem;
    }
    
    svg {
      width: 28px;
      height: 28px;
    }
  }
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    display: ${props => props.isMobileMenuOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    padding: 1rem;
    background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    gap: 1rem;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: color 0.2s, background-color 0.2s;
  
  &:hover, &.active {
    color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
    background-color: ${props => props.theme === 'dark' ? '#374151' : '#f3f4f6'};
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: 500;
  transition: all 0.2s;
  
  &.primary {
    background-color: ${props => props.theme === 'dark' ? '#3b82f6' : '#2563eb'};
    color: white;
    border: none;
    
    &:hover {
      background-color: ${props => props.theme === 'dark' ? '#2563eb' : '#1d4ed8'};
    }
  }
  
  &.secondary {
    background-color: transparent;
    color: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
    border: 1px solid ${props => props.theme === 'dark' ? '#374151' : '#e5e7eb'};
    
    &:hover {
      background-color: ${props => props.theme === 'dark' ? '#374151' : '#f3f4f6'};
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  
  svg {
    width: 24px;
    height: 24px;
    fill: ${props => props.theme === 'dark' ? '#d1d5db' : '#4b5563'};
  }
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Header = () => {
  const { user, logout } = useAuthContext();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  return (
    <HeaderContainer theme={theme}>
      <HeaderContent>
        <Logo to="/" theme={theme}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
          </svg>
          <h1>Translate AI</h1>
        </Logo>

        <MobileMenuButton 
          onClick={toggleMobileMenu} 
          aria-label="Menüyü Aç/Kapat"
          theme={theme}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </MobileMenuButton>

        <NavLinks isMobileMenuOpen={isMobileMenuOpen} theme={theme}>
          <NavLink to="/" theme={theme}>Ana Sayfa</NavLink>
          <NavLink to="/about" theme={theme}>Hakkında</NavLink>
          <NavLink to="/pricing" theme={theme}>Fiyatlandırma</NavLink>
          <NavLink to="/contact" theme={theme}>İletişim</NavLink>
          
          {user ? (
            <>
              <NavLink to="/history" theme={theme}>Geçmiş</NavLink>
              <NavLink to="/favorites" theme={theme}>Favoriler</NavLink>
              <NavLink to="/settings" theme={theme}>Ayarlar</NavLink>
            </>
          ) : null}
          
          <Button 
            className="secondary"
            onClick={toggleTheme}
            aria-label={`${theme === 'dark' ? 'Aydınlık' : 'Karanlık'} temaya geç`}
            theme={theme}
          >
            {theme === 'dark' ? '☀️ Aydınlık' : '🌙 Karanlık'}
          </Button>
          
          {user ? (
            <Button 
              className="secondary" 
              onClick={handleLogout}
              theme={theme}
            >
              Çıkış Yap
            </Button>
          ) : (
            <AuthButtons>
              <Button 
                className="secondary" 
                onClick={() => navigate('/login')}
                theme={theme}
              >
                Giriş Yap
              </Button>
              <Button 
                className="primary" 
                onClick={() => navigate('/register')}
                theme={theme}
              >
                Kayıt Ol
              </Button>
            </AuthButtons>
          )}
        </NavLinks>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 