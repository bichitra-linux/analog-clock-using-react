@echo off
echo ============================================
echo Installing Capacitor Geolocation Plugin
echo ============================================
echo.

echo Installing @capacitor/geolocation...
call npm install @capacitor/geolocation

if %errorlevel% neq 0 (
    echo Error: Failed to install geolocation plugin!
    pause
    exit /b %errorlevel%
)

echo.
echo Plugin installed successfully!
echo.
echo Syncing with Android...
call npx cap sync android

if %errorlevel% neq 0 (
    echo Error: Failed to sync with Android!
    pause
    exit /b %errorlevel%
)

echo.
echo ============================================
echo SUCCESS! Geolocation plugin is ready!
echo ============================================
echo.
echo Next steps:
echo 1. Use the useGeolocation hook in your React components
echo 2. The hook file has been created at: src\hooks\useGeolocation.js
echo 3. Rebuild your app: npm run build
echo.
pause

