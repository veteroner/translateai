@echo off
setlocal enabledelayedexpansion

:: GitHub Otomatik Upload Batch Dosyası
:: TranslateAI Projesi için
:: GitHub Repo: https://github.com/veteroner/translateai

echo ========================================
echo   GITHUB OTOMATIK UPLOAD BASLIYOR
echo ========================================
echo.

:: Renk kodları
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "RESET=[0m"

:: Repository bilgileri
set "REPO_URL=https://github.com/veteroner/translateai"
set "REPO_NAME=translateai"

:: Log dosyası
set "LOGFILE=github-upload-%date:~0,4%%date:~5,2%%date:~8,2%-%time:~0,2%%time:~3,2%%time:~6,2%.log"
set "LOGFILE=%LOGFILE: =0%"

echo %GREEN%Log dosyası: %LOGFILE%%RESET%
echo.

:: Başlangıç zamanı
echo %date% %time% - GITHUB UPLOAD BAŞLADI >> %LOGFILE%

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

echo %GREEN%✓ Git kontrolü başarılı%RESET%
echo %date% %time% - Git kontrolü başarılı >> %LOGFILE%

:: Git yapılandırması kontrolü
echo %BLUE%Git yapılandırması kontrol ediliyor...%RESET%
git config --global user.name >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%Git kullanıcı adı ayarlanmamış%RESET%
    set /p "git_name=Git kullanıcı adınızı girin: "
    git config --global user.name "!git_name!"
    echo %date% %time% - Git kullanıcı adı ayarlandı: !git_name! >> %LOGFILE%
)

git config --global user.email >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%Git email adresi ayarlanmamış%RESET%
    set /p "git_email=Git email adresinizi girin: "
    git config --global user.email "!git_email!"
    echo %date% %time% - Git email adresi ayarlandı: !git_email! >> %LOGFILE%
)

echo %GREEN%✓ Git yapılandırması tamamlandı%RESET%

:: Mevcut git repository kontrolü
if exist ".git" (
    echo %YELLOW%Mevcut git repository bulundu%RESET%
    echo %date% %time% - Mevcut git repository bulundu >> %LOGFILE%
    
    :: Remote origin kontrolü
    git remote get-url origin >nul 2>&1
    if errorlevel 1 (
        echo %YELLOW%Remote origin ekleniyor...%RESET%
        git remote add origin %REPO_URL%
        echo %date% %time% - Remote origin eklendi >> %LOGFILE%
    ) else (
        echo %GREEN%✓ Remote origin mevcut%RESET%
        echo %date% %time% - Remote origin mevcut >> %LOGFILE%
    )
) else (
    echo %BLUE%Git repository başlatılıyor...%RESET%
    git init
    if errorlevel 1 (
        echo %RED%HATA: Git init başarısız!%RESET%
        echo %date% %time% - HATA: Git init başarısız >> %LOGFILE%
        pause
        exit /b 1
    )
    
    echo %BLUE%Remote origin ekleniyor...%RESET%
    git remote add origin %REPO_URL%
    if errorlevel 1 (
        echo %RED%HATA: Remote origin eklenemedi!%RESET%
        echo %date% %time% - HATA: Remote origin eklenemedi >> %LOGFILE%
        pause
        exit /b 1
    )
    
    echo %GREEN%✓ Git repository başlatıldı%RESET%
    echo %date% %time% - Git repository başlatıldı >> %LOGFILE%
)

:: .gitignore dosyası kontrolü ve oluşturulması
if not exist ".gitignore" (
    echo %BLUE%.gitignore dosyası oluşturuluyor...%RESET%
    echo # Dependencies > .gitignore
    echo node_modules/ >> .gitignore
    echo /.pnp >> .gitignore
    echo .pnp.js >> .gitignore
    echo. >> .gitignore
    echo # Testing >> .gitignore
    echo /coverage >> .gitignore
    echo. >> .gitignore
    echo # Production >> .gitignore
    echo /build >> .gitignore
    echo /dist >> .gitignore
    echo. >> .gitignore
    echo # Environment >> .gitignore
    echo .env >> .gitignore
    echo .env.local >> .gitignore
    echo .env.development.local >> .gitignore
    echo .env.test.local >> .gitignore
    echo .env.production.local >> .gitignore
    echo. >> .gitignore
    echo # Logs >> .gitignore
    echo npm-debug.log* >> .gitignore
    echo yarn-debug.log* >> .gitignore
    echo yarn-error.log* >> .gitignore
    echo *.log >> .gitignore
    echo. >> .gitignore
    echo # IDE >> .gitignore
    echo .vscode/ >> .gitignore
    echo .idea/ >> .gitignore
    echo *.swp >> .gitignore
    echo *.swo >> .gitignore
    echo. >> .gitignore
    echo # OS >> .gitignore
    echo .DS_Store >> .gitignore
    echo Thumbs.db >> .gitignore
    echo. >> .gitignore
    echo # Python >> .gitignore
    echo .venv/ >> .gitignore
    echo __pycache__/ >> .gitignore
    echo *.pyc >> .gitignore
    
    echo %GREEN%✓ .gitignore dosyası oluşturuldu%RESET%
    echo %date% %time% - .gitignore dosyası oluşturuldu >> %LOGFILE%
) else (
    echo %GREEN%✓ .gitignore dosyası mevcut%RESET%
    echo %date% %time% - .gitignore dosyası mevcut >> %LOGFILE%
)

:: Commit mesajı için kullanıcıdan giriş al
set "DEFAULT_COMMIT_MSG=TranslateAI güncellemesi"
set /p "COMMIT_MSG=Commit mesajı (%DEFAULT_COMMIT_MSG%): "
if "%COMMIT_MSG%"=="" set "COMMIT_MSG=%DEFAULT_COMMIT_MSG%"

:: Dosyaları staging area'ya ekleme
echo %BLUE%Dosyalar staging area'ya ekleniyor...%RESET%
git add .
if errorlevel 1 (
    echo %RED%HATA: Dosyalar staging area'ya eklenemedi!%RESET%
    echo %date% %time% - HATA: git add başarısız >> %LOGFILE%
    pause
    exit /b 1
)

echo %GREEN%✓ Dosyalar staging area'ya eklendi%RESET%
echo %date% %time% - Dosyalar staging area'ya eklendi >> %LOGFILE%

:: Değişiklik kontrolü
git diff --cached --quiet
if not errorlevel 1 (
    echo %YELLOW%Commit edilecek değişiklik bulunamadı%RESET%
    echo %date% %time% - Commit edilecek değişiklik yok >> %LOGFILE%
) else (
    echo %BLUE%Commit oluşturuluyor...%RESET%
    git commit -m "%COMMIT_MSG%"
    if errorlevel 1 (
        echo %RED%HATA: Commit oluşturulamadı!%RESET%
        echo %date% %time% - HATA: Commit başarısız >> %LOGFILE%
        pause
        exit /b 1
    )
    
    echo %GREEN%✓ Commit başarıyla oluşturuldu%RESET%
    echo %date% %time% - Commit başarıyla oluşturuldu >> %LOGFILE%
)

:: Branch kontrolü ve ayarlama
echo %BLUE%Branch kontrol ediliyor...%RESET%
git branch -M main
echo %date% %time% - Ana branch 'main' olarak ayarlandı >> %LOGFILE%

:: GitHub'a push etme
echo %BLUE%GitHub'a push ediliyor...%RESET%
echo %YELLOW%GitHub kullanıcı adı ve şifreniz/token'ınız istenebilir%RESET%
git push -u origin main
if errorlevel 1 (
    echo %RED%HATA: GitHub'a push edilemedi!%RESET%
    echo %RED%Lütfen GitHub kullanıcı adı/şifre veya access token'ınızı kontrol edin%RESET%
    echo %YELLOW%GitHub Personal Access Token oluşturmak için:%RESET%
    echo %YELLOW%https://github.com/settings/tokens%RESET%
    echo %date% %time% - HATA: GitHub push başarısız >> %LOGFILE%
    pause
    exit /b 1
)

echo.
echo %GREEN%========================================%RESET%
echo %GREEN%   GITHUB UPLOAD BAŞARIYLA TAMAMLANDI!%RESET%
echo %GREEN%========================================%RESET%
echo.
echo %GREEN%Repository URL: %REPO_URL%%RESET%
echo %GREEN%Branch: main%RESET%
echo %GREEN%Commit mesajı: %COMMIT_MSG%%RESET%
echo %GREEN%Log dosyası: %LOGFILE%%RESET%
echo %date% %time% - GitHub upload başarıyla tamamlandı >> %LOGFILE%

:: Repository durumu
echo.
echo %BLUE%Repository durumu:%RESET%
git status

echo.
echo %YELLOW%Upload tamamlandı! GitHub repository'nizi kontrol edin:%RESET%
echo %YELLOW%%REPO_URL%%RESET%
echo.
echo %BLUE%Şimdi Netlify deployment için deploy-netlify.bat dosyasını çalıştırabilirsiniz%RESET%
echo.

pause 