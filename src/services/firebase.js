import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { FIREBASE_CONFIG } from '../config';

// Firebase'i başlatmayı dene
let app, auth, db;
let firebaseInitialized = false; // Firebase kullanımını devre dışı bırakmak için false olarak ayarlandı

/* Firebase başlatma işlemi devre dışı bırakıldı
try {
  app = initializeApp(FIREBASE_CONFIG);
  auth = getAuth(app);
  db = getFirestore(app);
  firebaseInitialized = true;
  console.log('Firebase başarıyla başlatıldı');
} catch (error) {
  console.error('Firebase başlatma hatası:', error);
  // Hata durumunda boş servisler oluştur - offline mod için
  firebaseInitialized = false;
}
*/

console.log('Firebase devre dışı, offline modda çalışılıyor');

// Dummy veri oluşturma fonksiyonu - offline mod için
const createDummyData = (dataType, params = {}) => {
  switch (dataType) {
    case 'user':
      return {
        uid: 'offline-user-id',
        email: params.email || 'offline@example.com',
        displayName: params.displayName || 'Offline Kullanıcı',
        createdAt: new Date().toISOString(),
        premium: false,
        usageCount: 0,
        preferences: {
          theme: 'light',
          defaultSourceLang: 'auto',
          defaultTargetLang: 'tr'
        }
      };
    case 'translation':
      return {
        id: `offline-trans-${Date.now()}`,
        userId: 'offline-user-id',
        sourceText: params.sourceText || '',
        translatedText: params.translatedText || '',
        sourceLang: params.sourceLang || 'auto',
        targetLang: params.targetLang || 'tr',
        timestamp: new Date().toISOString(),
        isFavorite: false
      };
    default:
      return {};
  }
};

// Kullanıcı Yönetimi
const userService = {
  // Kullanıcı kaydı
  register: async (email, password, displayName) => {
    if (!firebaseInitialized) {
      console.log('Firebase devre dışı, offline modda kayıt yapılıyor');
      localStorage.setItem('offlineUser', JSON.stringify(createDummyData('user', { email, displayName })));
      return createDummyData('user', { email, displayName });
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Profil güncelleme
      await updateProfile(user, {
        displayName: displayName
      });
      
      // Kullanıcı dokümanı oluşturma
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: email,
        displayName: displayName,
        createdAt: Timestamp.now(),
        premium: false,
        usageCount: 0,
        preferences: {
          theme: 'light',
          defaultSourceLang: 'auto',
          defaultTargetLang: 'tr'
        }
      });
      
      return user;
    } catch (error) {
      console.error('Kayıt hatası:', error);
      throw error;
    }
  },
  
  // Kullanıcı girişi
  login: async (email, password) => {
    if (!firebaseInitialized) {
      console.log('Firebase devre dışı, offline modda giriş yapılıyor');
      const offlineUser = localStorage.getItem('offlineUser') 
        ? JSON.parse(localStorage.getItem('offlineUser')) 
        : createDummyData('user', { email });
      return offlineUser;
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Giriş hatası:', error);
      throw error;
    }
  },
  
  // Çıkış
  logout: async () => {
    if (!firebaseInitialized) {
      console.log('Firebase devre dışı, offline modda çıkış yapılıyor');
      localStorage.removeItem('offlineUser');
      return;
    }
    
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Çıkış hatası:', error);
      throw error;
    }
  },
  
  // Şifre sıfırlama
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error);
      throw error;
    }
  },
  
  // Kullanıcı bilgilerini getir
  getUserProfile: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        throw new Error('Kullanıcı bulunamadı');
      }
    } catch (error) {
      console.error('Kullanıcı bilgisi alma hatası:', error);
      throw error;
    }
  },
  
  // Kullanıcı ayarlarını güncelle
  updateUserPreferences: async (userId, preferences) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        'preferences': preferences
      });
    } catch (error) {
      console.error('Kullanıcı tercihleri güncelleme hatası:', error);
      throw error;
    }
  },
  
  // Kullanıcı kullanım sayacını artır
  incrementUsageCount: async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const currentCount = userDoc.data().usageCount || 0;
        await updateDoc(userRef, {
          usageCount: currentCount + 1
        });
      }
    } catch (error) {
      console.error('Kullanım sayacı artırma hatası:', error);
      throw error;
    }
  }
};

// Çeviri geçmişi
const translationHistoryService = {
  // Çeviri kaydet
  saveTranslation: async (userId, translationData) => {
    if (!firebaseInitialized) {
      console.log('Firebase devre dışı, yerel depolamaya kaydediliyor');
      const translationItem = createDummyData('translation', translationData);
      const savedItems = localStorage.getItem('translations') ? JSON.parse(localStorage.getItem('translations')) : [];
      savedItems.unshift(translationItem); // Yeni öğeyi başa ekle
      
      // Maksimum 50 öğe sakla
      if (savedItems.length > 50) {
        savedItems.pop();
      }
      
      localStorage.setItem('translations', JSON.stringify(savedItems));
      return translationItem.id;
    }
    
    try {
      const translationRef = doc(collection(db, 'translations'));
      await setDoc(translationRef, {
        userId: userId,
        sourceText: translationData.sourceText,
        translatedText: translationData.translatedText,
        sourceLang: translationData.sourceLang,
        targetLang: translationData.targetLang,
        timestamp: Timestamp.now(),
        isFavorite: false
      });
      return translationRef.id;
    } catch (error) {
      console.error('Çeviri kaydetme hatası:', error);
      throw error;
    }
  },
  
  // Kullanıcının çevirilerini getir
  getUserTranslations: async (userId, limitCount = 50) => {
    if (!firebaseInitialized) {
      console.log('Firebase devre dışı, yerel depolamadan getiriliyor');
      return localStorage.getItem('translations') 
        ? JSON.parse(localStorage.getItem('translations'))
        : [];
    }
    
    try {
      const q = query(
        collection(db, 'translations'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const translations = [];
      
      querySnapshot.forEach((doc) => {
        if (translations.length < limitCount) {
          translations.push({
            id: doc.id,
            ...doc.data()
          });
        }
      });
      
      return translations;
    } catch (error) {
      console.error('Çeviri geçmişi alma hatası:', error);
      throw error;
    }
  },
  
  // Favori olarak işaretle/işareti kaldır
  toggleFavorite: async (translationId, isFavorite) => {
    try {
      await updateDoc(doc(db, 'translations', translationId), {
        isFavorite: isFavorite
      });
    } catch (error) {
      console.error('Favori güncelleme hatası:', error);
      throw error;
    }
  },
  
  // Çeviriyi sil
  deleteTranslation: async (translationId) => {
    try {
      await deleteDoc(doc(db, 'translations', translationId));
    } catch (error) {
      console.error('Çeviri silme hatası:', error);
      throw error;
    }
  },
  
  // Favori çevirileri getir
  getFavoriteTranslations: async (userId) => {
    try {
      const q = query(
        collection(db, 'translations'),
        where('userId', '==', userId),
        where('isFavorite', '==', true),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const favorites = [];
      
      querySnapshot.forEach((doc) => {
        favorites.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return favorites;
    } catch (error) {
      console.error('Favori çevirileri alma hatası:', error);
      throw error;
    }
  }
};

export { userService, translationHistoryService }; 