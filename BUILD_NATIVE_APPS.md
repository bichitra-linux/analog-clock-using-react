# 📱 Building Native Android & iOS Apps

## ✅ Prerequisites Completed

- ✅ React app built successfully
- ✅ Capacitor platforms synced
- ✅ Android project ready in `android/` folder
- ✅ iOS project ready in `ios/` folder (requires macOS)

---

## 🤖 Building for Android

### Option 1: Using Android Studio (Recommended)

#### Step 1: Open Android Project
```bash
npx cap open android
```
**OR manually open:**
1. Launch Android Studio
2. Click "Open an Existing Project"
3. Navigate to: `C:\Users\bichi\OneDrive\Documents\Projects\Portfolio Projects\analog-clock-using-react\android`
4. Click "OK"

#### Step 2: Wait for Gradle Sync
- Android Studio will automatically sync Gradle dependencies
- This may take 2-5 minutes on first load
- Wait for "Gradle sync finished" message in the bottom status bar

#### Step 3: Configure Build Variant
1. Click **Build** → **Select Build Variant**
2. Choose **debug** for testing or **release** for production

#### Step 4: Connect Device or Emulator

**Physical Device:**
1. Enable Developer Options on your Android phone:
   - Go to **Settings** → **About Phone**
   - Tap **Build Number** 7 times
   - Go back to **Settings** → **Developer Options**
   - Enable **USB Debugging**
2. Connect phone via USB
3. Allow USB debugging when prompted on phone

**Emulator:**
1. Click **Device Manager** icon (phone with Android logo)
2. Click **Create Virtual Device**
3. Select a device (e.g., Pixel 5)
4. Download and select a system image (e.g., Android 13/Tiramisu)
5. Click **Finish** and launch the emulator

#### Step 5: Run the App
1. Select your device from the device dropdown (top toolbar)
2. Click the **Run** button (green play icon) or press **Shift + F10**
3. App will build and install on your device

#### Step 6: Test Location Permissions
- When app launches, it will request location permission
- Tap **Allow** or **Allow while using the app**
- For best GPS accuracy, go outdoors

---

### Option 2: Using Command Line

#### Debug Build (APK for Testing)
```bash
# Navigate to android folder
cd android

# Build debug APK
gradlew assembleDebug

# APK location:
# android\app\build\outputs\apk\debug\app-debug.apk
```

#### Release Build (Signed APK)
```bash
# Build release APK (requires signing setup)
gradlew assembleRelease

# APK location:
# android\app\build\outputs\apk\release\app-release.apk
```

#### Install Debug APK on Connected Device
```bash
# Install via ADB
adb install app\build\outputs\apk\debug\app-debug.apk
```

---

### Generating Signed Release APK

#### Step 1: Create Keystore
```bash
keytool -genkey -v -keystore chrono-watch-release.keystore -alias chrono-watch -keyalg RSA -keysize 2048 -validity 10000
```

#### Step 2: Configure Signing
Create `android/key.properties`:
```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=chrono-watch
storeFile=../chrono-watch-release.keystore
```

#### Step 3: Update `android/app/build.gradle`
Add before `android` block:
```gradle
def keystorePropertiesFile = rootProject.file("key.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Add inside `android` block:
```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

#### Step 4: Build Signed APK
```bash
cd android
gradlew assembleRelease
```

---

### Generating AAB (Android App Bundle for Play Store)

```bash
cd android
gradlew bundleRelease

# AAB location:
# android\app\build\outputs\bundle\release\app-release.aab
```

Upload this `.aab` file to Google Play Console.

---

## 🍎 Building for iOS (Requires macOS)

### Prerequisites
- macOS computer
- Xcode installed (from App Store)
- Apple Developer account (for device testing/deployment)

### Step 1: Open iOS Project
```bash
npx cap open ios
```

### Step 2: Configure Signing
1. In Xcode, select the project in the navigator
2. Select the **chrono watch** target
3. Go to **Signing & Capabilities** tab
4. Select your **Team** (Apple Developer account)
5. Xcode will automatically provision the app

### Step 3: Select Device
- Choose **Any iOS Device** or your connected iPhone from the device dropdown

### Step 4: Build and Run
1. Click the **Run** button (play icon) or press **Cmd + R**
2. For first run on physical device:
   - Go to **Settings** → **General** → **VPN & Device Management**
   - Trust the developer certificate

### Step 5: Archive for App Store
1. Select **Any iOS Device (arm64)**
2. **Product** → **Archive**
3. Click **Distribute App**
4. Follow wizard to upload to App Store Connect

---

## 🔄 Updating Native Apps After Code Changes

Whenever you make changes to the React code:

```bash
# Step 1: Build React app
npm run build

# Step 2: Sync to native platforms
npx cap sync

# Step 3: Rebuild in Android Studio / Xcode
# Or use command line:
cd android
gradlew assembleDebug
```

---

## 🎯 Quick Commands Reference

```bash
# Build React app
npm run build

# Sync to all platforms
npx cap sync

# Open Android Studio
npx cap open android

# Open Xcode (macOS only)
npx cap open ios

# Update Capacitor
npm install @capacitor/core@latest @capacitor/android@latest @capacitor/ios@latest
npx cap sync
```

---

## 📋 App Information

- **App Name:** chrono watch
- **Package ID:** com.bichitra.chronowatch.io
- **Android Min SDK:** 22 (Android 5.1)
- **Android Target SDK:** 34 (Android 14)
- **iOS Min Version:** 13.0

---

## 🔐 Permissions Required

### Android (`android/app/src/main/AndroidManifest.xml`)
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### iOS (`ios/App/App/Info.plist`)
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs location access to show your timezone and coordinates.</string>
```

---

## 🐛 Troubleshooting

### Android Studio Not Found
- Install Android Studio from: https://developer.android.com/studio
- Add to PATH or open project manually

### Gradle Sync Failed
```bash
cd android
gradlew clean
gradlew build --refresh-dependencies
```

### Location Not Working on Android
- Ensure location services are enabled on device
- Grant location permission when prompted
- Go outdoors for better GPS signal

### App Not Installing
```bash
# Uninstall old version first
adb uninstall com.bichitra.chronowatch.io

# Then reinstall
adb install app/build/outputs/apk/debug/app-debug.apk
```

---

## 🚀 Next Steps

1. **Test on Android:** Open Android Studio and run the app
2. **Test Location:** Grant permissions and verify GPS accuracy
3. **Test Timezone:** Try changing timezone and verify clock updates
4. **Build Release:** Follow signing instructions above
5. **Publish:** Upload to Google Play Store / Apple App Store

---

## 📱 Expected App Behavior

- **Splash Screen:** Shows app icon while loading
- **Location Request:** Prompts for permission on first launch
- **GPS Accuracy:** Starts at ~100-300m, improves to 10-50m outdoors
- **Offline:** Clock works without internet, timezone requires initial GPS lock
- **Performance:** Smooth animations, low battery usage

---

## 📞 Support

For Capacitor documentation: https://capacitorjs.com/docs
For Android development: https://developer.android.com
For iOS development: https://developer.apple.com/documentation

---

**Note:** You're currently on Windows, so iOS building/testing will require a macOS machine. Android development works perfectly on Windows!
