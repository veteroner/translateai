import React, { createContext, useState, useContext, useEffect } from 'react';
import { translationHistoryService } from '../services/firebase';
import { useAuthContext } from './AuthContext';
import { APP_CONFIG, API_CONFIG } from '../config';

// Context oluşturma
const TranslationHistoryContext = createContext();

// Provider bileşeni
export const TranslationHistoryProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [translations, setTranslations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Kullanıcı değiştiğinde çevirileri yükle
  useEffect(() => {
    if (!user) {
      setTranslations([]);
      setFavorites([]);
      return;
    }
    
    // Offline modda ise boş listeler kullan
    if (API_CONFIG.offlineMode) {
      // Yerel depolamadan çevirileri yüklemeyi dene
      const savedItems = localStorage.getItem('translations') 
        ? JSON.parse(localStorage.getItem('translations')) 
        : [];
      
      setTranslations(savedItems);
      setFavorites(savedItems.filter(item => item.isFavorite));
      return;
    }
    
    const loadTranslations = async () => {
      setLoading(true);
      try {
        // Firebase'in kapalı olup olmadığını kontrol et
        if (typeof translationHistoryService.getUserTranslations !== 'function') {
          console.log('Firebase servisleri kullanılamıyor, offline modda devam ediliyor');
          return;
        }
        
        const userTranslations = await translationHistoryService.getUserTranslations(
          user.uid, 
          APP_CONFIG.saveHistoryCount
        );
        setTranslations(userTranslations);
        
        const userFavorites = await translationHistoryService.getFavoriteTranslations(
          user.uid
        );
        setFavorites(userFavorites);
      } catch (error) {
        console.error('Çeviri geçmişi yüklenirken hata:', error);
        // Hata durumunda yerel depolamadan yüklemeyi dene
        const savedItems = localStorage.getItem('translations') 
          ? JSON.parse(localStorage.getItem('translations')) 
          : [];
        
        setTranslations(savedItems);
        setFavorites(savedItems.filter(item => item.isFavorite));
      } finally {
        setLoading(false);
      }
    };
    
    loadTranslations();
  }, [user]);
  
  // Çeviriyi geçmişe ekle
  const addToHistory = async (translationData) => {
    if (!user) return null;
    
    try {
      // Yeni çeviri nesnesi oluştur
      const newTranslation = {
        id: Date.now().toString(), // Geçici ID
        userId: user.uid,
        sourceText: translationData.sourceText,
        translatedText: translationData.translatedText,
        sourceLang: translationData.sourceLang,
        targetLang: translationData.targetLang,
        timestamp: new Date(),
        isFavorite: false
      };
      
      let translationId = newTranslation.id;
      
      // Offline modda yerel depolamaya kaydet
      if (API_CONFIG.offlineMode) {
        const savedItems = localStorage.getItem('translations') 
          ? JSON.parse(localStorage.getItem('translations')) 
          : [];
        
        savedItems.unshift(newTranslation);
        
        // Maksimum öğe sayısını kontrol et
        if (savedItems.length > APP_CONFIG.saveHistoryCount) {
          savedItems.pop();
        }
        
        localStorage.setItem('translations', JSON.stringify(savedItems));
      } 
      // Online modda Firebase'e kaydet
      else if (typeof translationHistoryService.saveTranslation === 'function') {
        translationId = await translationHistoryService.saveTranslation(
          user.uid,
          translationData
        );
        newTranslation.id = translationId;
      }
      
      // En yeni çeviri en başta olacak şekilde ekle
      setTranslations(prev => [newTranslation, ...prev]);
      
      // Liste maksimum boyutu aşarsa son elemanı çıkar
      if (translations.length >= APP_CONFIG.saveHistoryCount) {
        setTranslations(prev => prev.slice(0, APP_CONFIG.saveHistoryCount));
      }
      
      return translationId;
    } catch (error) {
      console.error('Çeviri kaydedilirken hata:', error);
      throw error;
    }
  };
  
  // Çeviriyi favorilere ekle/çıkar
  const toggleFavorite = async (translationId, isFavorite) => {
    if (!user) return;
    
    try {
      // Offline modda yerel depolamayı güncelle
      if (API_CONFIG.offlineMode) {
        const savedItems = localStorage.getItem('translations') 
          ? JSON.parse(localStorage.getItem('translations')) 
          : [];
        
        const updatedItems = savedItems.map(item => 
          item.id === translationId ? { ...item, isFavorite } : item
        );
        
        localStorage.setItem('translations', JSON.stringify(updatedItems));
      } 
      // Online modda Firebase'i güncelle
      else if (typeof translationHistoryService.toggleFavorite === 'function') {
        await translationHistoryService.toggleFavorite(translationId, isFavorite);
      }
      
      // Çeviri listesini güncelle
      setTranslations(prev => 
        prev.map(t => 
          t.id === translationId 
            ? { ...t, isFavorite } 
            : t
        )
      );
      
      // Favorileri güncelle
      if (isFavorite) {
        const translation = translations.find(t => t.id === translationId);
        if (translation) {
          setFavorites(prev => [{ ...translation, isFavorite: true }, ...prev]);
        }
      } else {
        setFavorites(prev => prev.filter(t => t.id !== translationId));
      }
    } catch (error) {
      console.error('Favori değiştirilirken hata:', error);
      throw error;
    }
  };
  
  // Çeviriyi sil
  const deleteTranslation = async (translationId) => {
    if (!user) return;
    
    try {
      // Offline modda yerel depolamayı güncelle
      if (API_CONFIG.offlineMode) {
        const savedItems = localStorage.getItem('translations') 
          ? JSON.parse(localStorage.getItem('translations')) 
          : [];
        
        const updatedItems = savedItems.filter(item => item.id !== translationId);
        localStorage.setItem('translations', JSON.stringify(updatedItems));
      } 
      // Online modda Firebase'i güncelle
      else if (typeof translationHistoryService.deleteTranslation === 'function') {
        await translationHistoryService.deleteTranslation(translationId);
      }
      
      // Çeviriyi listelerden kaldır
      setTranslations(prev => prev.filter(t => t.id !== translationId));
      setFavorites(prev => prev.filter(t => t.id !== translationId));
    } catch (error) {
      console.error('Çeviri silinirken hata:', error);
      throw error;
    }
  };
  
  // Context değeri
  const value = {
    translations,
    favorites,
    loading,
    addToHistory,
    toggleFavorite,
    deleteTranslation
  };
  
  return (
    <TranslationHistoryContext.Provider value={value}>
      {children}
    </TranslationHistoryContext.Provider>
  );
};

// Custom hook
export const useTranslationHistory = () => {
  const context = useContext(TranslationHistoryContext);
  if (context === undefined) {
    throw new Error('useTranslationHistory must be used within a TranslationHistoryProvider');
  }
  return context;
}; 