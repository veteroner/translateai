# TranslateAI - Yapay Zeka Destekli Çeviri Uygulaması

Modern ve kullanıcı dostu arayüzü ile metin çevirisi yapmanızı sağlayan bir web uygulaması.

## Özellikler

- Gerçek zamanlı metin çevirisi
- Dil otomatik algılama
- Sesli okuma desteği
- Çeviri geçmişi ve favoriler
- Karanlık/Aydınlık tema desteği
- Kullanıcı hesapları ve tercih yönetimi

## Kurulum

### Gereksinimler

- Node.js (v14 veya üzeri)
- npm veya yarn

### Adımlar

1. Projeyi klonlayın:
```
git clone https://github.com/yourusername/TranslateAI.git
cd TranslateAI
```

2. Bağımlılıkları yükleyin:
```
npm install
```

3. Firebase yapılandırmasını ayarlayın:
   - `firebase-config.js` dosyasını kendi Firebase projenizin bilgileriyle güncelleyin
   - Firebase konsolundan Authentication ve Firestore servislerini etkinleştirin

4. Uygulamayı başlatın:
```
npm start
```
veya
```
start.bat
```

## Çevrimdışı Mod

Uygulama varsayılan olarak çevrimdışı modda çalışır. Bu modda:
- Çeviriler simüle edilir
- Tarayıcının kendi TTS özellikleri kullanılır
- Firebase gerektiren özellikler devre dışı kalır

## Hata Giderme

### Firebase Authentication Hatası

`Firebase: Error (auth/invalid-api-key)` hatası alıyorsanız:

1. `firebase-config.js` dosyasını kontrol edin ve geçerli API anahtarınızı girin
2. Firebase projenizin etkin olduğundan emin olun
3. Uygulamanızın Firebase Authentication servisini kullanma izni olduğunu kontrol edin

## Lisans

MIT 