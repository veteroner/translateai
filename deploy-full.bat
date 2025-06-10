@echo off
setlocal enabledelayedexpansion

:: TranslateAI - Komple Deployment Script
:: GitHub Upload + Netlify Deploy
:: Repository: https://github.com/veteroner/translateai

echo ========================================
echo   TRANSLATEAI KOMPLE DEPLOYMENT
echo ========================================
echo.

:: Renk kodları
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "CYAN=[96m"
set "RESET=[0m"

echo %CYAN%1. GitHub'a projeyi yükleme%RESET%
echo %CYAN%2. Netlify'a deployment%RESET%
echo.

:: GitHub upload
echo %BLUE%========== ADIM 1: GITHUB UPLOAD ==========%RESET%
echo.
if exist "github-upload.bat" (
    call github-upload.bat
    if errorlevel 1 (
        echo %RED%GitHub upload başarısız! Netlify deployment atlanıyor.%RESET%
        pause
        exit /b 1
    )
) else (
    echo %RED%HATA: github-upload.bat dosyası bulunamadı!%RESET%
    pause
    exit /b 1
)

echo.
echo %GREEN%✓ GitHub upload başarılı%RESET%
echo.

:: Kullanıcıya seçenek sun
echo %YELLOW%Netlify deployment'a devam etmek istiyor musunuz? (Y/N)%RESET%
set /p "continue=Seçiminiz: "

if /i "%continue%"=="Y" (
    echo.
    echo %BLUE%========== ADIM 2: NETLIFY DEPLOYMENT ==========%RESET%
    echo.
    
    if exist "deploy-netlify.bat" (
        call deploy-netlify.bat
        if errorlevel 1 (
            echo %RED%Netlify deployment başarısız!%RESET%
            pause
            exit /b 1
        )
    ) else (
        echo %RED%HATA: deploy-netlify.bat dosyası bulunamadı!%RESET%
        pause
        exit /b 1
    )
    
    echo.
    echo %GREEN%========================================%RESET%
    echo %GREEN%   TÜM DEPLOYMENT İŞLEMLERİ TAMAMLANDI!%RESET%
    echo %GREEN%========================================%RESET%
    echo.
    echo %GREEN%✓ GitHub Repository: https://github.com/veteroner/translateai%RESET%
    echo %GREEN%✓ Netlify Dashboard: https://app.netlify.com/%RESET%
    echo.
) else (
    echo %YELLOW%Netlify deployment atlandı.%RESET%
    echo %YELLOW%Daha sonra deploy-netlify.bat dosyasını çalıştırabilirsiniz.%RESET%
    echo.
)

echo %CYAN%İşlemler tamamlandı!%RESET%
pause 