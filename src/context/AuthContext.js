import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { userService } from '../services/firebase';
import paymentService from '../services/paymentService';
import { API_CONFIG } from '../config';

// Context oluşturma
const AuthContext = createContext();

// Provider bileşeni
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  
  let auth = null;
  try {
    auth = getAuth();
  } catch (error) {
    console.log('Firebase auth kullanılamıyor, offline modda devam ediliyor');
  }

  // Kullanıcı durumu değiştiğinde çalışır
  useEffect(() => {
    // Offline modda hemen yüklemeyi bitir ve offline kullanıcı ayarla
    if (API_CONFIG.offlineMode) {
      const offlineUser = {
        uid: 'offline-user-id',
        email: 'offline@example.com',
        displayName: 'Offline Kullanıcı'
      };
      
      setUser(offlineUser);
      setUserProfile({
        uid: offlineUser.uid,
        email: offlineUser.email,
        displayName: offlineUser.displayName,
        premium: false,
        preferences: {
          theme: 'light',
          defaultSourceLang: 'auto',
          defaultTargetLang: 'tr'
        }
      });
      setLoading(false);
      return;
    }
    
    // Firebase auth kullanılabilir değilse, yüklemeyi bitir
    if (!auth) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      // Kullanıcı profilini çek
      if (user) {
        try {
          const profile = await userService.getUserProfile(user.uid);
          setUserProfile(profile);
          
          // Abonelik durumunu kontrol et
          await checkSubscriptionStatus(user.uid);
        } catch (error) {
          console.error('Kullanıcı profili alınamadı:', error);
        }
      } else {
        setUserProfile(null);
        setSubscription(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe && unsubscribe();
  }, [auth]);

  // Abonelik durumunu kontrol et
  const checkSubscriptionStatus = async (userId) => {
    try {
      setSubscriptionLoading(true);
      const subscriptionStatus = await paymentService.checkSubscriptionStatus(userId);
      setSubscription(subscriptionStatus);
    } catch (error) {
      console.error('Abonelik durumu kontrol hatası:', error);
    } finally {
      setSubscriptionLoading(false);
    }
  };
  
  // Premium aboneliği satın al
  const purchasePremium = async (paymentDetails) => {
    if (!user) return;
    
    try {
      setSubscriptionLoading(true);
      const result = await paymentService.purchasePremium(user.uid, paymentDetails);
      
      // Kullanıcı profilini güncelle
      setUserProfile(prev => ({
        ...prev,
        premium: true,
        premiumSince: new Date()
      }));
      
      // Abonelik durumunu güncelle
      await checkSubscriptionStatus(user.uid);
      
      return result;
    } catch (error) {
      console.error('Premium satın alma hatası:', error);
      throw error;
    } finally {
      setSubscriptionLoading(false);
    }
  };
  
  // Aboneliği iptal et
  const cancelSubscription = async () => {
    if (!user) return;
    
    try {
      setSubscriptionLoading(true);
      const result = await paymentService.cancelSubscription(user.uid);
      
      // Abonelik durumunu güncelle
      await checkSubscriptionStatus(user.uid);
      
      return result;
    } catch (error) {
      console.error('Abonelik iptal hatası:', error);
      throw error;
    } finally {
      setSubscriptionLoading(false);
    }
  };
  
  // Otomatik yenilemeyi aç/kapat
  const toggleAutoRenew = async (autoRenew) => {
    if (!user) return;
    
    try {
      setSubscriptionLoading(true);
      const result = await paymentService.toggleAutoRenew(user.uid, autoRenew);
      
      // Abonelik durumunu güncelle
      await checkSubscriptionStatus(user.uid);
      
      return result;
    } catch (error) {
      console.error('Otomatik yenileme değiştirme hatası:', error);
      throw error;
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // Kullanıcı kayıt fonksiyonu
  const register = async (email, password, displayName) => {
    try {
      setLoading(true);
      const user = await userService.register(email, password, displayName);
      return user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı giriş fonksiyonu
  const login = async (email, password) => {
    try {
      setLoading(true);
      const user = await userService.login(email, password);
      return user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı çıkış fonksiyonu
  const logout = async () => {
    try {
      setLoading(true);
      await userService.logout();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Şifre sıfırlama
  const resetPassword = async (email) => {
    try {
      await userService.resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  // Kullanıcı tercihlerini güncelle
  const updatePreferences = async (preferences) => {
    if (!user) return;
    
    try {
      await userService.updateUserPreferences(user.uid, preferences);
      
      // User profilini güncelle
      const updatedProfile = { ...userProfile };
      updatedProfile.preferences = {
        ...updatedProfile.preferences,
        ...preferences
      };
      setUserProfile(updatedProfile);
      
    } catch (error) {
      throw error;
    }
  };

  // Kullanım sayacını artır
  const incrementUsage = async () => {
    if (!user) return;
    
    try {
      await userService.incrementUsageCount(user.uid);
    } catch (error) {
      console.error('Kullanım sayacı artırılamadı:', error);
    }
  };

  // Context değeri
  const value = {
    user,
    userProfile,
    subscription,
    loading,
    subscriptionLoading,
    register,
    login,
    logout,
    resetPassword,
    updatePreferences,
    incrementUsage,
    purchasePremium,
    cancelSubscription,
    toggleAutoRenew,
    checkSubscriptionStatus,
    isPremium: userProfile?.premium || (subscription?.active && subscription?.plan === 'premium')
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}; 