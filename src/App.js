import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { TranslationHistoryProvider } from './context/TranslationHistoryContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import FavoritesPage from './pages/FavoritesPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PricingPage from './pages/PricingPage';
import BlogPage from './pages/BlogPage';
import BusinessPage from './pages/BusinessPage';
import ApiPage from './pages/ApiPage';
import DocsPage from './pages/DocsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import PrivateRoute from './components/PrivateRoute';
import { ROUTER_CONFIG, API_CONFIG } from './config';
import './styles/global.css';

// React Router gelecek özellikleri uyarılarını kaldırmak için
// v7_startTransition ve v7_relativeSplatPath bayrağını ayarlama
import { startTransition, Suspense } from 'react';
import { 
  createBrowserRouter, 
  RouterProvider, 
  createRoutesFromElements 
} from 'react-router-dom';

// React Router future flags'i etkinleştirmek için
const future = {
  v7_startTransition: ROUTER_CONFIG.v7_startTransition,
  v7_relativeSplatPath: ROUTER_CONFIG.v7_relativeSplatPath
};

// Styled Components
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${props => props.theme === 'dark' ? '#111827' : '#f9fafb'};
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#111827'};
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

// Router'ı React.StrictMode içinde oluşturuyoruz
const RouterContent = ({ theme }) => (
  <AppContainer theme={theme}>
    <Header />
    <MainContent>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/api" element={<ApiPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookies" element={<CookiePolicyPage />} />
        <Route 
          path="/history" 
          element={
            <PrivateRoute>
              <HistoryPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/favorites" 
          element={
            <PrivateRoute>
              <FavoritesPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          } 
        />
      </Routes>
    </MainContent>
    <Footer />
  </AppContainer>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TranslationHistoryProvider>
          <AppContent />
        </TranslationHistoryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// App içeriğini theme ile sarmalıyoruz
function AppContent() {
  const { theme } = useTheme();
  
  // İki farklı Router kullanımı:
  // 1. Eski stil BrowserRouter - future flags'i desteklemez
  // 2. Modern createBrowserRouter - future flags'i destekler
  
  // Eğer v7 özelliklerini kullanmak istemiyorsak:
  if (!ROUTER_CONFIG.v7_startTransition && !ROUTER_CONFIG.v7_relativeSplatPath) {
    return (
      <Router>
        <RouterContent theme={theme} />
      </Router>
    );
  }
  
  // Future flags'i etkinleştirmek için yeni Router API'sini kullanıyoruz
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<RouterContent theme={theme} />} path="*" />
    ),
    { future }
  );
  
  return (
    <Suspense fallback="Yükleniyor...">
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App; 