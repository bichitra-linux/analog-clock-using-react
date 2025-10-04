@echo off
echo ============================================
echo Generate Signed Production APK
echo ============================================
echo.

echo This script will help you create a SIGNED APK for Play Store distribution.
echo.
echo IMPORTANT: You need a keystore file to sign the APK.
echo If you don't have one, this script will help you create it.
echo.

set KEYSTORE_PATH=android\app\chronowatch-release.keystore
set KEY_ALIAS=chronowatch-key

if not exist "%KEYSTORE_PATH%" (
    echo Keystore not found. Creating a new keystore...
    echo.
    echo Please provide the following information:
    echo.

    cd android
    call keytool -genkey -v -keystore app\chronowatch-release.keystore -alias %KEY_ALIAS% -keyalg RSA -keysize 2048 -validity 10000
    cd ..

    if %errorlevel% neq 0 (
        echo Error: Failed to create keystore!
        pause
        exit /b %errorlevel%
    )

    echo.
    echo Keystore created successfully!
    echo IMPORTANT: Keep this keystore file safe and remember your passwords!
    echo.
)

echo Step 1: Building React web app...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Web build failed!
    pause
    exit /b %errorlevel%
)

echo Step 2: Syncing to Android...
call npx cap sync android

echo Step 3: Building signed release APK...
cd android
call gradlew assembleRelease
cd ..

echo.
echo ============================================
echo Build Complete!
echo ============================================
echo.
echo Unsigned APK: android\app\build\outputs\apk\release\app-release.apk
echo.
echo To sign the APK manually, you'll need to:
echo 1. Use the keystore at: %KEYSTORE_PATH%
echo 2. Sign using jarsigner or Android Studio
echo.
echo Or configure automatic signing in android\app\build.gradle
echo.
pause

