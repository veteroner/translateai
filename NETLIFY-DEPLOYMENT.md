# Netlify Otomatik Deployment Kılavuzu

Bu kılavuz, TranslateAI projenizi Netlify'a otomatik olarak deploy etmek için gerekli adımları açıklar.

## 🚀 Hızlı Başlangıç

### 1. Otomatik Deployment (Tavsiye Edilen)

```bash
# Batch dosyasını çalıştırın
deploy-netlify.bat
```

Bu komut:
- ✅ Tüm gereksinimleri kontrol eder
- ✅ Netlify CLI'ı otomatik kurar
- ✅ Projeyi build eder
- ✅ Netlify'a deploy eder
- ✅ Detaylı log tutar

### 2. Manuel Kurulum

Eğer manuel olarak kurmak isterseniz:

```bash
# 1. Netlify CLI kurulumu
npm install -g netlify-cli

# 2. Netlify'a giriş
netlify login

# 3. Proje build
npm run build

# 4. Deployment
netlify deploy --dir=build --prod
```

## 📋 Gereksinimler

- ✅ Node.js (v14 veya üzeri)
- ✅ npm veya yarn
- ✅ Git (isteğe bağlı)
- ✅ İnternet bağlantısı

## 🔧 Konfigürasyon

### netlify.toml Dosyası

Proje kök dizininde `netlify.toml` dosyası bulunur. Bu dosya:

- **Build komutu**: `npm run build`
- **Publish klasörü**: `build`
- **Node.js versiyonu**: 18
- **Redirect kuralları**: React Router için
- **Güvenlik header'ları**: XSS, CSRF koruması
- **Cache ayarları**: Static dosyalar için

### Environment Variables

Netlify dashboard'da environment variables ekleyebilirsiniz:

1. Netlify Dashboard → Site Settings → Environment Variables
2. Gerekli API key'leri ve konfigürasyonları ekleyin

## 📊 Deployment Türleri

### 1. Production Deployment
```bash
netlify deploy --prod --dir=build
```
- Ana sitenize deploy eder
- Production URL'i kullanır
- SEO ve caching optimizasyonları aktif

### 2. Preview Deployment (Draft)
```bash
netlify deploy --dir=build
```
- Geçici preview URL'i oluşturur
- Test amaçlı kullanım
- Production'ı etkilemez

## 🔄 GitHub Integration

### Otomatik Deployment Kurulumu

1. **Netlify Dashboard**'da sitenizi seçin
2. **Site Settings** → **Build & Deploy**
3. **Continuous Deployment** → **Link to Git provider**
4. GitHub repository'nizi seçin (`https://github.com/veteroner/translateai`)
5. Build settings:
   - **Branch**: `main` veya `master`
   - **Build command**: `npm run build`
   - **Publish directory**: `build`

### Branch Deployment

- **Main branch**: Production'a otomatik deploy
- **Feature branches**: Preview URL'leri oluşturur
- **Pull requests**: Otomatik preview build'ler

## 📝 Log ve Monitoring

### Deployment Logs

Batch dosyası otomatik log tutar:
```
deployment-YYYYMMDD-HHMMSS.log
```

### Netlify Dashboard

- Build logs: Netlify Dashboard → Deploys
- Analytics: Site dashboard
- Functions logs: Functions sekmesi

## 🛠️ Troubleshooting

### Yaygın Sorunlar

#### 1. Node.js Bulunamadı
```bash
# Node.js yükleyin
https://nodejs.org/
```

#### 2. Netlify CLI Authentication Hatası
```bash
netlify logout
netlify login
```

#### 3. Build Hatası
```bash
# Dependencies yeniden yükle
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 4. Permission Hatası
```bash
# PowerShell execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Build Optimizasyonları

#### Bundle Size Azaltma
```javascript
// webpack.config.js veya package.json
{
  "scripts": {
    "build": "webpack --mode production --optimization-minimize"
  }
}
```

#### Environment Variables
```bash
# .env.production
GENERATE_SOURCEMAP=false
INLINE_RUNTIME_CHUNK=false
```

## 🔗 Useful Links

- **Netlify Dashboard**: https://app.netlify.com/
- **GitHub Repository**: https://github.com/veteroner/translateai
- **Netlify Docs**: https://docs.netlify.com/
- **Node.js**: https://nodejs.org/

## 📞 Destek

Deployment ile ilgili sorunlar yaşarsanız:

1. `deployment-*.log` dosyalarını kontrol edin
2. Netlify build logs'larını inceleyin
3. GitHub Issues'da sorun açın

---

**Not**: Bu dosyalar projenizin deployment sürecini otomatikleştirir ve hata ayıklama için gerekli tüm bilgileri sağlar. 