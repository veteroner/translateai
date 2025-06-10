@echo off
setlocal enabledelayedexpansion

:: Netlify Otomatik Deployment Batch Dosyası
:: TranslateAI Projesi için
:: GitHub Repo: https://github.com/veteroner/translateai

echo ========================================
echo   NETLIFY OTOMATIK DEPLOYMENT BASLIYOR
echo ========================================
echo.

:: Renk kodları
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "RESET=[0m"

:: Log dosyası
set "LOGFILE=deployment-%date:~0,4%%date:~5,2%%date:~8,2%-%time:~0,2%%time:~3,2%%time:~6,2%.log"
set "LOGFILE=%LOGFILE: =0%"

echo %GREEN%Log dosyası: %LOGFILE%%RESET%
echo.

:: Başlangıç zamanı
echo %date% %time% - DEPLOYMENT BAŞLADI >> %LOGFILE%

:: Node.js ve npm kontrolü
echo %BLUE%Node.js ve npm kontrolü yapılıyor...%RESET%
node --version >nul 2>&1
if errorlevel 1 (
    echo %RED%HATA: Node.js yüklü değil!%RESET%
    echo %RED%Lütfen Node.js yükleyin: https://nodejs.org/%RESET%
    echo %date% %time% - HATA: Node.js bulunamadı >> %LOGFILE%
    pause
    exit /b 1
)

npm --version >nul 2>&1
if errorlevel 1 (
    echo %RED%HATA: npm yüklü değil!%RESET%
    echo %date% %time% - HATA: npm bulunamadı >> %LOGFILE%
    pause
    exit /b 1
)

echo %GREEN%✓ Node.js ve npm kontrolü başarılı%RESET%
echo %date% %time% - Node.js ve npm kontrolü başarılı >> %LOGFILE%

:: Git durumu kontrolü
echo %BLUE%Git durumu kontrol ediliyor...%RESET%
git status >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%Uyarı: Git repository bulunamadı%RESET%
    echo %date% %time% - Uyarı: Git repository bulunamadı >> %LOGFILE%
) else (
    echo %GREEN%✓ Git repository bulundu%RESET%
    echo %date% %time% - Git repository bulundu >> %LOGFILE%
)

:: Netlify CLI kontrolü ve kurulumu
echo %BLUE%Netlify CLI kontrolü yapılıyor...%RESET%
netlify --version >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%Netlify CLI bulunamadı, kuruluyor...%RESET%
    echo %date% %time% - Netlify CLI kuruluyor >> %LOGFILE%
    npm install -g netlify-cli
    if errorlevel 1 (
        echo %RED%HATA: Netlify CLI kurulumu başarısız!%RESET%
        echo %date% %time% - HATA: Netlify CLI kurulumu başarısız >> %LOGFILE%
        pause
        exit /b 1
    )
    echo %GREEN%✓ Netlify CLI başarıyla kuruldu%RESET%
    echo %date% %time% - Netlify CLI başarıyla kuruldu >> %LOGFILE%
) else (
    echo %GREEN%✓ Netlify CLI zaten kurulu%RESET%
    echo %date% %time% - Netlify CLI zaten kurulu >> %LOGFILE%
)

:: Netlify authentication kontrolü
echo %BLUE%Netlify authentication kontrolü...%RESET%
netlify status >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%Netlify authentication gerekli...%RESET%
    echo %YELLOW%Tarayıcıda açılan sayfadan giriş yapın%RESET%
    echo %date% %time% - Netlify authentication başlatıldı >> %LOGFILE%
    netlify login
    if errorlevel 1 (
        echo %RED%HATA: Netlify authentication başarısız!%RESET%
        echo %date% %time% - HATA: Netlify authentication başarısız >> %LOGFILE%
        pause
        exit /b 1
    )
    echo %GREEN%✓ Netlify authentication başarılı%RESET%
    echo %date% %time% - Netlify authentication başarılı >> %LOGFILE%
) else (
    echo %GREEN%✓ Netlify authentication mevcut%RESET%
    echo %date% %time% - Netlify authentication mevcut >> %LOGFILE%
)

:: Bağımlılıkları yükleme
echo %BLUE%Bağımlılıklar kontrol ediliyor...%RESET%
if not exist "node_modules" (
    echo %YELLOW%node_modules bulunamadı, bağımlılıklar yükleniyor...%RESET%
    echo %date% %time% - Bağımlılıklar yükleniyor >> %LOGFILE%
    npm install
    if errorlevel 1 (
        echo %RED%HATA: Bağımlılık yükleme başarısız!%RESET%
        echo %date% %time% - HATA: Bağımlılık yükleme başarısız >> %LOGFILE%
        pause
        exit /b 1
    )
    echo %GREEN%✓ Bağımlılıklar başarıyla yüklendi%RESET%
    echo %date% %time% - Bağımlılıklar başarıyla yüklendi >> %LOGFILE%
) else (
    echo %GREEN%✓ node_modules mevcut%RESET%
    echo %date% %time% - node_modules mevcut >> %LOGFILE%
)

:: Proje build etme
echo %BLUE%Proje build ediliyor...%RESET%
echo %date% %time% - Build işlemi başladı >> %LOGFILE%
npm run build
if errorlevel 1 (
    echo %RED%HATA: Build işlemi başarısız!%RESET%
    echo %date% %time% - HATA: Build işlemi başarısız >> %LOGFILE%
    pause
    exit /b 1
)

echo %GREEN%✓ Build işlemi başarılı%RESET%
echo %date% %time% - Build işlemi başarılı >> %LOGFILE%

:: Build dosyaları kontrolü
if not exist "build" (
    echo %RED%HATA: Build klasörü bulunamadı!%RESET%
    echo %date% %time% - HATA: Build klasörü bulunamadı >> %LOGFILE%
    pause
    exit /b 1
)

if not exist "build\index.html" (
    echo %RED%HATA: index.html build klasöründe bulunamadı!%RESET%
    echo %date% %time% - HATA: index.html build klasöründe bulunamadı >> %LOGFILE%
    pause
    exit /b 1
)

echo %GREEN%✓ Build dosyaları doğrulandı%RESET%
echo %date% %time% - Build dosyaları doğrulandı >> %LOGFILE%

:: Netlify sitesi kontrolü
echo %BLUE%Netlify site durumu kontrol ediliyor...%RESET%
netlify sites:list >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%Netlify site bilgisi alınamadı%RESET%
    echo %date% %time% - Netlify site bilgisi alınamadı >> %LOGFILE%
)

:: Deployment seçeneği
echo.
echo %YELLOW%Deployment seçeneği:%RESET%
echo %YELLOW%1. Production deployment (ana site)%RESET%
echo %YELLOW%2. Draft deployment (önizleme)%RESET%
echo.
set /p "choice=Seçiminizi yapın (1/2, default: 2): "

if "%choice%"=="" set choice=2
if "%choice%"=="1" (
    echo %BLUE%Production deployment başlatılıyor...%RESET%
    echo %date% %time% - Production deployment başlatıldı >> %LOGFILE%
    netlify deploy --prod --dir=build
    set "deploy_type=production"
) else (
    echo %BLUE%Draft deployment başlatılıyor...%RESET%
    echo %date% %time% - Draft deployment başlatıldı >> %LOGFILE%
    netlify deploy --dir=build
    set "deploy_type=draft"
)

if errorlevel 1 (
    echo %RED%HATA: Deployment başarısız!%RESET%
    echo %date% %time% - HATA: Deployment başarısız >> %LOGFILE%
    pause
    exit /b 1
)

echo.
echo %GREEN%========================================%RESET%
echo %GREEN%   DEPLOYMENT BAŞARIYLA TAMAMLANDI!%RESET%
echo %GREEN%========================================%RESET%
echo.
echo %GREEN%Deployment türü: %deploy_type%%RESET%
echo %GREEN%Build klasörü: build%RESET%
echo %GREEN%Log dosyası: %LOGFILE%%RESET%
echo %date% %time% - Deployment başarıyla tamamlandı (%deploy_type%) >> %LOGFILE%

:: Site bilgileri
echo.
echo %BLUE%Site bilgileri:%RESET%
netlify status

echo.
echo %YELLOW%Deployment tamamlandı! Tarayıcıda sitenizi kontrol edin.%RESET%
echo %YELLOW%Netlify Dashboard: https://app.netlify.com/%RESET%
echo.

pause 