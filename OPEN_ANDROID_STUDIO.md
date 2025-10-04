# 🚀 Quick Start: Opening Android Project

## Option 1: Manual Open (Recommended for Windows)

### Step-by-Step Instructions:

1. **Launch Android Studio**
   - Find Android Studio in your Start Menu
   - Or run `studio64.exe` from Android Studio installation folder
   - Typical location: `C:\Program Files\Android\Android Studio\bin\studio64.exe`

2. **Open Project**
   - Click **"Open"** or **"Open an Existing Project"**
   - Navigate to your project's Android folder:
     ```
     C:\Users\bichi\OneDrive\Documents\Projects\Portfolio Projects\analog-clock-using-react\android
     ```
   - Click **"OK"**

3. **Wait for Gradle Sync**
   - Android Studio will automatically sync Gradle (2-5 minutes first time)
   - Look for "Gradle sync finished" in the bottom status bar
   - ✅ Success when you see no errors in the Build window

4. **Connect Device or Start Emulator**
   - **Physical Device:** Connect via USB (enable USB debugging first)
   - **Emulator:** Click Device Manager → Create/Launch emulator

5. **Run the App**
   - Select device from dropdown (top toolbar)
   - Click green **Run** button (▶️) or press **Shift + F10**
   - App installs and launches on device

---

## Option 2: Set CAPACITOR_ANDROID_STUDIO_PATH

If you want `npx cap open android` to work:

### Windows PowerShell:
```powershell
# Temporary (current session only)
$env:CAPACITOR_ANDROID_STUDIO_PATH = "C:\Program Files\Android\Android Studio\bin\studio64.exe"

# Permanent (system-wide)
[System.Environment]::SetEnvironmentVariable('CAPACITOR_ANDROID_STUDIO_PATH', 'C:\Program Files\Android\Android Studio\bin\studio64.exe', 'User')
```

### Windows CMD:
```cmd
# Temporary
set CAPACITOR_ANDROID_STUDIO_PATH=C:\Program Files\Android\Android Studio\bin\studio64.exe

# Permanent
setx CAPACITOR_ANDROID_STUDIO_PATH "C:\Program Files\Android\Android Studio\bin\studio64.exe"
```

After setting the path:
```bash
npx cap open android
```

---

## Option 3: Alternative Command Line Build

If Android Studio has issues, you can build from command line:

```bash
# Navigate to android folder
cd android

# Build debug APK
.\gradlew assembleDebug

# The APK will be at:
# android\app\build\outputs\apk\debug\app-debug.apk

# Install on connected device
adb install app\build\outputs\apk\debug\app-debug.apk

# Or install and run
adb install -r app\build\outputs\apk\debug\app-debug.apk
adb shell am start -n com.bichitra.chronowatch.io/.MainActivity
```

---

## 📁 Android Project Location

```
C:\Users\bichi\OneDrive\Documents\Projects\Portfolio Projects\analog-clock-using-react\android
```

Copy this path and use it in Android Studio's "Open" dialog.

---

## 🔍 Finding Android Studio

### Common Installation Paths:

```
C:\Program Files\Android\Android Studio\
C:\Program Files (x86)\Android\Android Studio\
C:\Users\bichi\AppData\Local\Android\Android Studio\
```

### Executable File:
```
bin\studio64.exe
```

### If Not Installed:
Download from: https://developer.android.com/studio

---

## ✅ What to Expect

1. **First Open:** Gradle sync takes 2-5 minutes
2. **Build Time:** First build ~3-5 minutes, subsequent builds ~30 seconds
3. **App Size:** ~15-20 MB APK
4. **Permissions:** App will request location permission on launch

---

## 🎯 Quick Test Steps

1. Open Android Studio → Open android folder
2. Wait for Gradle sync
3. Connect phone or launch emulator
4. Click Run button
5. Grant location permission
6. Watch the clock and location appear!

---

## 💡 Pro Tips

- **Faster Builds:** Use debug variant during development
- **Better Performance:** Test on physical device, not just emulator
- **GPS Testing:** Go outdoors for accurate location (10-20m accuracy)
- **Clean Build:** If errors occur, try Build → Clean Project → Rebuild Project

---

**Ready to build!** Open Android Studio and point it to the `android` folder. 🚀
