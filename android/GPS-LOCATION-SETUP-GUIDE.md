# GPS Location Permissions Setup Guide for ChronoWatch

## ✅ COMPLETED: Android Manifest Permissions

I have successfully added the following GPS location permissions to your AndroidManifest.xml:

```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-feature android:name="android.hardware.location.gps" />
```

These permissions will now allow your app to request location access from users.

---

## 📋 NEXT STEPS: Complete Location Implementation

### Step 1: Install Capacitor Geolocation Plugin

Run this command in your project root (NOT the android folder):

```bash
npm install @capacitor/geolocation
npx cap sync android
```

Or simply run the provided script:
```bash
install-geolocation.bat
```

---

### Step 2: Create a React Hook for Location (useGeolocation.js)

Create this file in your `src/hooks/` directory:

```javascript
import { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Request permission
  const requestPermission = async () => {
    try {
      const permission = await Geolocation.requestPermissions();
      if (permission.location === 'granted') {
        setPermissionGranted(true);
        return true;
      } else {
        setError('Location permission denied');
        return false;
      }
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Check current permission status
  const checkPermissions = async () => {
    try {
      const permission = await Geolocation.checkPermissions();
      setPermissionGranted(permission.location === 'granted');
      return permission.location === 'granted';
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Get current position
  const getCurrentPosition = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if we have permission
      const hasPermission = await checkPermissions();
      
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          setLoading(false);
          return null;
        }
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });

      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        speed: position.coords.speed,
        heading: position.coords.heading,
        timestamp: position.timestamp
      };

      setLocation(locationData);
      setLoading(false);
      return locationData;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  // Watch position (continuous updates)
  const watchPosition = async (callback) => {
    const hasPermission = await checkPermissions();
    
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) return null;
    }

    const watchId = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      },
      (position, err) => {
        if (err) {
          setError(err.message);
          callback(null, err);
          return;
        }

        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };

        setLocation(locationData);
        callback(locationData, null);
      }
    );

    return watchId;
  };

  // Clear watch
  const clearWatch = async (watchId) => {
    if (watchId) {
      await Geolocation.clearWatch({ id: watchId });
    }
  };

  return {
    location,
    error,
    loading,
    permissionGranted,
    requestPermission,
    checkPermissions,
    getCurrentPosition,
    watchPosition,
    clearWatch
  };
};
```

---

### Step 3: Use the Hook in Your Components

Example implementation in your clock component:

```javascript
import React, { useEffect, useState } from 'react';
import { useGeolocation } from './hooks/useGeolocation';

function App() {
  const { 
    location, 
    error, 
    loading, 
    getCurrentPosition,
    requestPermission 
  } = useGeolocation();

  const [timezone, setTimezone] = useState(null);

  useEffect(() => {
    // Request location permission when app starts
    requestPermission();
  }, []);

  const handleGetLocation = async () => {
    const pos = await getCurrentPosition();
    if (pos) {
      console.log('Location:', pos);
      // You can use the coordinates to determine timezone
      // or display location-based time
    }
  };

  return (
    <div className="App">
      <h1>ChronoWatch</h1>
      
      {/* Your existing clock component */}
      
      <div className="location-section">
        <button onClick={handleGetLocation} disabled={loading}>
          {loading ? 'Getting Location...' : 'Get My Location'}
        </button>
        
        {error && <p className="error">Error: {error}</p>}
        
        {location && (
          <div className="location-info">
            <p>Latitude: {location.latitude.toFixed(6)}</p>
            <p>Longitude: {location.longitude.toFixed(6)}</p>
            <p>Accuracy: {location.accuracy.toFixed(2)}m</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
```

---

### Step 4: Alternative - Simple One-Time Location Request

If you just want a simple location request without a hook:

```javascript
import { Geolocation } from '@capacitor/geolocation';

// In your component
const getLocation = async () => {
  try {
    // Request permission
    const permission = await Geolocation.requestPermissions();
    
    if (permission.location === 'granted') {
      // Get current position
      const position = await Geolocation.getCurrentPosition();
      console.log('Location:', position);
      return position;
    } else {
      alert('Location permission denied');
    }
  } catch (error) {
    console.error('Error getting location:', error);
  }
};
```

---

## 🔧 Testing Location Permissions

### On Android Device/Emulator:

1. **First Launch**: The app will show a system dialog asking for location permission
2. **Permission Dialog**: User can choose:
   - "Allow only while using the app"
   - "Allow all the time"
   - "Deny"

3. **If User Denies**: Your app's error handler will catch this and you can show a message

4. **Check Permissions Manually**:
   - Settings → Apps → ChronoWatch → Permissions → Location

---

## 📱 Build and Test

After implementing the code above:

1. **Install the plugin**:
   ```bash
   npm install @capacitor/geolocation
   npx cap sync android
   ```

2. **Build and test**:
   ```bash
   npm run build
   npx cap sync android
   npx cap open android
   ```
   
   Or use the build script:
   ```bash
   build-apk.bat
   ```

3. **Install on device and test** - The permission dialog should appear when you call the location function

---

## 🎯 What I've Done For You

✅ Added GPS permissions to AndroidManifest.xml:
   - ACCESS_COARSE_LOCATION (network-based location)
   - ACCESS_FINE_LOCATION (GPS location)
   - GPS hardware feature declaration

✅ Created installation script: `install-geolocation.bat`

✅ Created this comprehensive guide with:
   - Complete React hook for geolocation
   - Example usage code
   - Testing instructions

---

## ⚠️ Important Notes

1. **Permissions are now declared** in the manifest, so the app CAN request them
2. **You must call the request function** in your React code to trigger the permission dialog
3. **User must grant permission** - your code should handle both granted and denied cases
4. **For Android 10+**: ACCESS_BACKGROUND_LOCATION is needed for background location (add if needed)

---

## 🚀 Quick Start

1. Run: `install-geolocation.bat`
2. Copy the `useGeolocation.js` hook to your `src/hooks/` folder
3. Import and use it in your component
4. Rebuild the app
5. Test on device - permission dialog will appear!

The Android manifest is ready - you just need to add the JavaScript/React code to trigger the permission request! 🎉

