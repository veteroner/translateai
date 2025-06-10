import { db, firebaseInitialized } from '../config/firebase';
import { doc, setDoc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
import { userService } from './firebase';

const paymentService = {
  // Premium abonelik satın alma
  purchasePremium: async (userId, paymentDetails) => {
    if (!firebaseInitialized) {
      console.log('Firebase devre dışı, premium abonelik simüle ediliyor');
      localStorage.setItem('premium', JSON.stringify({
        active: true,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        plan: 'premium',
        autoRenew: true
      }));
      
      return {
        success: true,
        message: 'Premium abonelik başarıyla etkinleştirildi',
        subscriptionId: 'offline-subscription'
      };
    }
    
    try {
      // Ödeme işlemi burada gerçekleştirilecek (Stripe, iyzico vb.)
      // Bu örnek için başarılı olduğunu varsayıyoruz
      
      // Abonelik bilgilerini kaydet
      const subscriptionRef = doc(db, 'subscriptions', userId);
      
      // Abonelik bitiş tarihi (30 gün sonra)
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      
      await setDoc(subscriptionRef, {
        userId: userId,
        plan: 'premium',
        startDate: Timestamp.now(),
        endDate: Timestamp.fromDate(endDate),
        status: 'active',
        autoRenew: true,
        paymentMethod: paymentDetails.paymentMethod,
        lastFour: paymentDetails.lastFour || '0000',
        price: 49
      });
      
      // Kullanıcı profilini güncelle
      await updateDoc(doc(db, 'users', userId), {
        premium: true,
        premiumSince: Timestamp.now()
      });
      
      return {
        success: true,
        message: 'Premium abonelik başarıyla etkinleştirildi',
        subscriptionId: userId
      };
    } catch (error) {
      console.error('Abonelik satın alma hatası:', error);
      throw error;
    }
  },
  
  // Abonelik durumunu kontrol et
  checkSubscriptionStatus: async (userId) => {
    if (!firebaseInitialized) {
      const premium = localStorage.getItem('premium');
      if (!premium) return { active: false };
      
      const premiumData = JSON.parse(premium);
      return {
        active: premiumData.active,
        plan: premiumData.plan,
        endDate: new Date(premiumData.endDate),
        autoRenew: premiumData.autoRenew
      };
    }
    
    try {
      const subscriptionDoc = await getDoc(doc(db, 'subscriptions', userId));
      
      if (subscriptionDoc.exists()) {
        const subscription = subscriptionDoc.data();
        const now = new Date();
        const endDate = subscription.endDate.toDate();
        
        return {
          active: now < endDate && subscription.status === 'active',
          plan: subscription.plan,
          endDate: endDate,
          autoRenew: subscription.autoRenew
        };
      } else {
        return { active: false };
      }
    } catch (error) {
      console.error('Abonelik durumu kontrol hatası:', error);
      throw error;
    }
  },
  
  // Otomatik yenilemeyi aç/kapat
  toggleAutoRenew: async (userId, autoRenew) => {
    if (!firebaseInitialized) {
      const premium = localStorage.getItem('premium');
      if (!premium) return;
      
      const premiumData = JSON.parse(premium);
      premiumData.autoRenew = autoRenew;
      localStorage.setItem('premium', JSON.stringify(premiumData));
      
      return { success: true };
    }
    
    try {
      await updateDoc(doc(db, 'subscriptions', userId), {
        autoRenew: autoRenew
      });
      
      return { success: true };
    } catch (error) {
      console.error('Otomatik yenileme ayarı hatası:', error);
      throw error;
    }
  },
  
  // Aboneliği iptal et
  cancelSubscription: async (userId) => {
    if (!firebaseInitialized) {
      const premium = localStorage.getItem('premium');
      if (!premium) return;
      
      const premiumData = JSON.parse(premium);
      premiumData.autoRenew = false;
      localStorage.setItem('premium', JSON.stringify(premiumData));
      
      return { success: true, message: 'Aboneliğiniz dönem sonunda iptal edilecektir' };
    }
    
    try {
      // Aboneliği iptal et ama dönem sonuna kadar aktif kalsın
      await updateDoc(doc(db, 'subscriptions', userId), {
        autoRenew: false,
        canceledAt: Timestamp.now()
      });
      
      return { 
        success: true, 
        message: 'Aboneliğiniz dönem sonunda iptal edilecektir' 
      };
    } catch (error) {
      console.error('Abonelik iptal hatası:', error);
      throw error;
    }
  }
};

export default paymentService; 