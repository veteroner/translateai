@echo off
echo TranslateAI uygulaması başlatılıyor...
echo.

:: Node.js kurulu olup olmadığını kontrol et
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Hata: Node.js bulunamadı!
    echo Lütfen Node.js'i https://nodejs.org adresinden yükleyin.
    pause
    exit /b 1
)

:: Firebase yapılandırma dosyasını kontrol et
if not exist firebase-config.js (
    echo Firebase yapılandırma dosyası bulunamadı.
    echo firebase-config.js dosyasını oluşturun ve Firebase bilgilerinizi ekleyin.
    echo Şimdilik çevrimdışı modda devam ediliyor...
    echo.
)

:: Bağımlılıkları kontrol et ve gerekirse yükle
if not exist node_modules (
    echo Bağımlılıklar bulunamadı. Yükleniyor...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo Bağımlılıklar yüklenirken hata oluştu!
        pause
        exit /b 1
    )
)

:: Çevrimdışı modu etkinleştir
set "REACT_APP_OFFLINE_MODE=true"
echo Çevrimdışı mod etkinleştirildi.

:: Uygulamayı başlat
echo Uygulama başlatılıyor...
npm start

pause 