import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../firebase-config';

// Firebase'i başlatmayı dene
let app, auth, db;
let firebaseInitialized = false; // Firebase kullanımını devre dışı bırakmak için false olarak ayarlandı

// Firebase başlatma işlemi offline mod için devre dışı
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  firebaseInitialized = true;
  console.log('Firebase başarıyla başlatıldı');
} catch (error) {
  console.error('Firebase başlatma hatası:', error);
  firebaseInitialized = false;
  console.log('Firebase devre dışı, offline modda çalışılıyor');
}

export { app, auth, db, firebaseInitialized }; 