import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { API_CONFIG } from '../config';

/**
 * Giriş yapılmadan erişilemeyen sayfalar için özel yönlendirme bileşeni
 * Kullanıcı giriş yapmamışsa giriş sayfasına yönlendirir.
 * Offline modda ise doğrudan erişime izin verir.
 */
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  
  // Offline modda ise doğrudan erişime izin ver
  if (API_CONFIG.offlineMode) {
    return children;
  }

  // Yükleme durumunda bir yükleme göstergesi göster
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  // Kullanıcı giriş yapmadıysa giriş sayfasına yönlendir
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Kullanıcı giriş yaptıysa çocuk bileşenleri render et
  return children;
};

export default PrivateRoute; 