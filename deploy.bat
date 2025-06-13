@echo off
setlocal enabledelayedexpansion

:: TranslateAI - Kapsamlı Deploy Script (GitHub + Netlify)
:: Repo: https://github.com/veteroner/translateai
:: Bu script hem GitHub'a kod yükleme hem de Netlify'a deploy yapmayı destekler

echo ========================================
echo   TRANSLATEAI DEPLOYMENT TOOL
echo ========================================
echo.

:: Renk kodları (Windows 10 ve üzeri için çalışır)
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "CYAN=[96m"
set "RESET=[0m"

:: Log dosyası
set "LOGFILE=deploy-%date:~6,4%%date:~3,2%%date:~0,2%-%time:~0,2%%time:~3,2%%time:~6,2%.log"
set "LOGFILE=%LOGFILE: =0%"

echo %GREEN%Log dosyası: %LOGFILE%%RESET%
echo %date% %time% - DEPLOYMENT BAŞLADI >> %LOGFILE%
echo.

:: Node.js kontrolü
echo %BLUE%Node.js kontrolü yapılıyor...%RESET%
node --version >nul 2>&1
if errorlevel 1 (
    echo %RED%HATA: Node.js yüklü değil!%RESET%
    echo %RED%Lütfen Node.js yükleyin: https://nodejs.org/%RESET%
    echo %date% %time% - HATA: Node.js bulunamadı >> %LOGFILE%
    pause
    exit /b 1
)
echo %GREEN%✓ Node.js mevcut%RESET%
echo %date% %time% - Node.js kontrolü başarılı >> %LOGFILE%
echo.

:: netlify.toml kontrolü
echo %BLUE%netlify.toml dosyası kontrol ediliyor...%RESET%
if not exist "netlify.toml" (
    echo %RED%HATA: netlify.toml dosyası bulunamadı!%RESET%
    echo %date% %time% - HATA: netlify.toml dosyası bulunamadı >> %LOGFILE%
    pause
    exit /b 1
)
echo %GREEN%✓ netlify.toml dosyası mevcut%RESET%
echo %date% %time% - netlify.toml dosyası mevcut >> %LOGFILE%
echo.

:: Menü
echo %CYAN%Deployment seçenekleri:%RESET%
echo %CYAN%1. Sadece Netlify'a deploy et%RESET%
echo %CYAN%2. GitHub'a yükle ve Netlify'a deploy et%RESET%
echo %CYAN%3. Sadece GitHub'a yükle%RESET%
echo.
set /p "deploy_choice=Seçiminiz (1/2/3, varsayılan: 1): "
if "%deploy_choice%"=="" set deploy_choice=1
echo %date% %time% - Kullanıcı seçimi: %deploy_choice% >> %LOGFILE%
echo.

:: GitHub'a yükleme fonksiyonu
if "%deploy_choice%"=="2" goto :github_upload
if "%deploy_choice%"=="3" goto :github_upload
goto :netlify_deploy

:github_upload
if "%deploy_choice%"=="3" (
    echo %BLUE%========== GITHUB UPLOAD ==========%RESET%
) else (
    echo %BLUE%========== ADIM 1: GITHUB UPLOAD ==========%RESET%
)
echo.

:: Git kontrolü
echo %BLUE%Git kontrolü yapılıyor...%RESET%
git --version >nul 2>&1
if errorlevel 1 (
    echo %RED%HATA: Git yüklü değil!%RESET%
    echo %RED%Lütfen Git yükleyin: https://git-scm.com/%RESET%
    echo %date% %time% - HATA: Git bulunamadı >> %LOGFILE%
    pause
    exit /b 1
)
echo %GREEN%✓ Git mevcut%RESET%
echo %date% %time% - Git kontrolü başarılı >> %LOGFILE%

:: Git repository kontrolü
if not exist ".git" (
    echo %YELLOW%Git repository bulunamadı, başlatılıyor...%RESET%
    git init
    if errorlevel 1 (
        echo %RED%HATA: Git repository başlatılamadı!%RESET%
        echo %date% %time% - HATA: Git init başarısız >> %LOGFILE%
        pause
        exit /b 1
    )
    echo %GREEN%✓ Git repository başlatıldı%RESET%
    echo %date% %time% - Git repository başlatıldı >> %LOGFILE%
    
    :: Remote ekle
    git remote add origin https://github.com/veteroner/translateai
    if errorlevel 1 (
        echo %RED%HATA: Git remote eklenemedi!%RESET%
        echo %date% %time% - HATA: Git remote eklenemedi >> %LOGFILE%
        pause
        exit /b 1
    )
    echo %GREEN%✓ Git remote eklendi%RESET%
    echo %date% %time% - Git remote eklendi >> %LOGFILE%
) else (
    echo %GREEN%✓ Git repository mevcut%RESET%
    echo %date% %time% - Git repository mevcut >> %LOGFILE%
    
    :: Remote kontrolü
    git remote get-url origin >nul 2>&1
    if errorlevel 1 (
        echo %YELLOW%Remote origin ekleniyor...%RESET%
        git remote add origin https://github.com/veteroner/translateai
        echo %GREEN%✓ Remote origin eklendi%RESET%
        echo %date% %time% - Remote origin eklendi >> %LOGFILE%
    )
)

:: Commit mesajı
set "default_msg=TranslateAI güncellemesi"
set /p "commit_msg=Commit mesajı (%default_msg%): "
if "%commit_msg%"=="" set "commit_msg=%default_msg%"
echo %date% %time% - Commit mesajı: %commit_msg% >> %LOGFILE%

:: Dosyaları stage et
echo %BLUE%Dosyalar stage ediliyor...%RESET%
git add .
if errorlevel 1 (
    echo %RED%HATA: Dosyalar stage edilemedi!%RESET%
    echo %date% %time% - HATA: git add başarısız >> %LOGFILE%
    pause
    exit /b 1
)
echo %GREEN%✓ Dosyalar stage edildi%RESET%
echo %date% %time% - Dosyalar stage edildi >> %LOGFILE%

:: Commit
echo %BLUE%Commit oluşturuluyor...%RESET%
git commit -m "%commit_msg%"
if errorlevel 1 (
    echo %YELLOW%Commit edilecek değişiklik bulunamadı veya hata oluştu%RESET%
    echo %date% %time% - Commit edilecek değişiklik yok veya hata >> %LOGFILE%
) else (
    echo %GREEN%✓ Commit oluşturuldu%RESET%
    echo %date% %time% - Commit oluşturuldu >> %LOGFILE%
)

:: Branch ayarla
git branch -M main
echo %GREEN%✓ Ana branch 'main' olarak ayarlandı%RESET%
echo %date% %time% - Ana branch 'main' olarak ayarlandı >> %LOGFILE%

:: Push
echo %BLUE%GitHub'a push ediliyor...%RESET%
echo %YELLOW%GitHub kullanıcı adı ve şifreniz/token istenebilir%RESET%
git push -u origin main
if errorlevel 1 (
    echo %RED%HATA: GitHub'a push edilemedi!%RESET%
    echo %RED%Lütfen GitHub kimlik bilgilerinizi kontrol edin%RESET%
    echo %date% %time% - HATA: GitHub push başarısız >> %LOGFILE%
    pause
    if "%deploy_choice%"=="3" exit /b 1
    
    echo %YELLOW%GitHub push başarısız, ancak Netlify deploy devam edecek%RESET%
    echo.
) else (
    echo %GREEN%✓ GitHub'a push edildi%RESET%
    echo %date% %time% - GitHub'a push edildi >> %LOGFILE%
    echo.
)

if "%deploy_choice%"=="3" (
    echo %GREEN%========================================%RESET%
    echo %GREEN%   GITHUB UPLOAD TAMAMLANDI!%RESET%
    echo %GREEN%========================================%RESET%
    echo.
    echo %GREEN%Repository: https://github.com/veteroner/translateai%RESET%
    echo %GREEN%Log dosyası: %LOGFILE%%RESET%
    echo.
    pause
    exit /b 0
)

:netlify_deploy
if "%deploy_choice%"=="2" (
    echo %BLUE%========== ADIM 2: NETLIFY DEPLOYMENT ==========%RESET%
) else (
    echo %BLUE%========== NETLIFY DEPLOYMENT ==========%RESET%
)
echo.

:: Bağımlılık kontrolü
echo %BLUE%Bağımlılıklar kontrol ediliyor...%RESET%
if not exist "node_modules" (
    echo %YELLOW%node_modules bulunamadı, bağımlılıklar yükleniyor...%RESET%
    npm install
    if errorlevel 1 (
        echo %RED%HATA: Bağımlılık yükleme başarısız!%RESET%
        echo %date% %time% - HATA: npm install başarısız >> %LOGFILE%
        pause
        exit /b 1
    )
    echo %GREEN%✓ Bağımlılıklar yüklendi%RESET%
    echo %date% %time% - Bağımlılıklar yüklendi >> %LOGFILE%
) else (
    echo %GREEN%✓ node_modules mevcut%RESET%
    echo %date% %time% - node_modules mevcut >> %LOGFILE%
)
echo.

:: Build işlemi
echo %BLUE%Proje build ediliyor...%RESET%
call npm run build
if errorlevel 1 (
    echo %RED%HATA: Build işlemi başarısız!%RESET%
    echo %date% %time% - HATA: Build işlemi başarısız >> %LOGFILE%
    pause
    exit /b 1
)
echo %GREEN%✓ Build işlemi başarılı%RESET%
echo %date% %time% - Build işlemi başarılı >> %LOGFILE%
echo.

:: Build klasörü kontrolü
if not exist "build" (
    echo %RED%HATA: build klasörü bulunamadı!%RESET%
    echo %date% %time% - HATA: build klasörü bulunamadı >> %LOGFILE%
    pause
    exit /b 1
)
if not exist "build\index.html" (
    echo %RED%HATA: build\index.html bulunamadı!%RESET%
    echo %date% %time% - HATA: build\index.html bulunamadı >> %LOGFILE%
    pause
    exit /b 1
)
echo %GREEN%✓ Build klasörü ve index.html mevcut%RESET%
echo %date% %time% - Build klasörü ve index.html mevcut >> %LOGFILE%
echo.

:: Netlify CLI kontrolü
npx netlify --version >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%Netlify CLI bulunamadı, kuruluyor...%RESET%
    npm install netlify-cli --save-dev
    if errorlevel 1 (
        echo %RED%HATA: Netlify CLI kurulamadı!%RESET%
        echo %date% %time% - HATA: Netlify CLI kurulamadı >> %LOGFILE%
        pause
        exit /b 1
    )
    echo %GREEN%✓ Netlify CLI kuruldu%RESET%
    echo %date% %time% - Netlify CLI kuruldu >> %LOGFILE%
) else (
    echo %GREEN%✓ Netlify CLI mevcut%RESET%
    echo %date% %time% - Netlify CLI mevcut >> %LOGFILE%
)
echo.

:: Netlify login kontrolü
npx netlify status >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%Netlify hesabınızda oturum açmanız gerekiyor.%RESET%
    npx netlify login
    if errorlevel 1 (
        echo %RED%HATA: Netlify login başarısız!%RESET%
        echo %date% %time% - HATA: Netlify login başarısız >> %LOGFILE%
        pause
        exit /b 1
    )
    echo %GREEN%✓ Netlify login başarılı%RESET%
    echo %date% %time% - Netlify login başarılı >> %LOGFILE%
) else (
    echo %GREEN%✓ Netlify hesabı bağlı%RESET%
    echo %date% %time% - Netlify hesabı bağlı >> %LOGFILE%
)
echo.

:: Site seçimi
echo %YELLOW%Site seçimi:%RESET%
echo %YELLOW%1. Yeni site oluştur%RESET%
echo %YELLOW%2. Mevcut siteyi kullan%RESET%
set /p "site_choice=Seçiminiz (1/2, varsayılan: 2): "
if "%site_choice%"=="" set site_choice=2
echo %date% %time% - Site seçimi: %site_choice% >> %LOGFILE%

if "%site_choice%"=="1" (
    echo %BLUE%Yeni Netlify sitesi oluşturuluyor...%RESET%
    npx netlify sites:create
    if errorlevel 1 (
        echo %RED%HATA: Site oluşturulamadı!%RESET%
        echo %date% %time% - HATA: Site oluşturulamadı >> %LOGFILE%
        pause
        exit /b 1
    )
    echo %GREEN%✓ Netlify sitesi oluşturuldu%RESET%
    echo %date% %time% - Netlify sitesi oluşturuldu >> %LOGFILE%
)

:: Deployment seçimi
echo.
echo %YELLOW%Deployment türünü seçin:%RESET%
echo %YELLOW%1. Production (canlı site)%RESET%
echo %YELLOW%2. Preview (önizleme)%RESET%
set /p "deploy_type=Seçiminiz (1/2, varsayılan: 2): "
if "%deploy_type%"=="" set deploy_type=2
echo %date% %time% - Deployment türü: %deploy_type% >> %LOGFILE%

if "%deploy_type%"=="1" (
    echo %BLUE%Production deployment başlatılıyor...%RESET%
    npx netlify deploy --prod --dir=build
    set "deploy_name=production"
) else (
    echo %BLUE%Preview deployment başlatılıyor...%RESET%
    npx netlify deploy --dir=build
    set "deploy_name=preview"
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
echo %GREEN%Deployment türü: %deploy_name%%RESET%
echo %GREEN%Log dosyası: %LOGFILE%%RESET%
echo.
echo %YELLOW%Netlify Dashboard: https://app.netlify.com/%RESET%
echo %YELLOW%GitHub Repository: https://github.com/veteroner/translateai%RESET%
echo.

echo %date% %time% - DEPLOYMENT BAŞARIYLA TAMAMLANDI >> %LOGFILE%
pause 