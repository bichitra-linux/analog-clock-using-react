@echo off
echo ============================================
echo Building Production APK for ChronoWatch
echo ============================================
echo.

echo Step 1: Building React web app...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Web build failed!
    pause
    exit /b %errorlevel%
)
echo Web build completed successfully!
echo.

echo Step 2: Syncing web assets to Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo Error: Capacitor sync failed!
    pause
    exit /b %errorlevel%
)
echo Sync completed successfully!
echo.

echo Step 3: Building release APK...
cd android
call gradlew assembleRelease
if %errorlevel% neq 0 (
    echo Error: APK build failed!
    cd ..
    pause
    exit /b %errorlevel%
)
cd ..
echo.

echo ============================================
echo SUCCESS! Production APK has been generated!
echo ============================================
echo.
echo APK Location:
echo android\app\build\outputs\apk\release\app-release.apk
echo.
echo File size:
for %%A in ("android\app\build\outputs\apk\release\app-release.apk") do echo %%~zA bytes
echo.
echo NOTE: This APK is unsigned. For Play Store deployment, you need to sign it.
echo.
pause

