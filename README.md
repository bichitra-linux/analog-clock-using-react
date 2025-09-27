# Chrono Compass

Chrono Compass is a cross-platform analog clock dashboard that stays in sync with your device time and location. The experience now ships as a Capacitor-powered hybrid app, so you can compile native binaries for Android and iOS while keeping the smooth React UI, location awareness, and reduced-motion preferences.

## ✨ Features

- **Dual-view timekeeping**: a precision analog clock flanked by device and selected-zone digital readouts, plus a breakdown of how far the selected zone is ahead or behind your device time.
- **Timezone picker built into the clock**: tap the “Selected Zone” tile to open a searchable modal and jump across the globe instantly.
- **GPS integration** powered by the browser Geolocation API with comprehensive error handling, accuracy reporting, and retry controls.
- **Responsive, mobile-first layout** with safe-area support for modern devices and fine-tuned glassmorphism styling.
- **Offline-ready experience** that keeps ticking even without connectivity, whether you deploy to the web or package natively.
- **Accessible experience** featuring ARIA roles, reduced-motion fallbacks, and keyboard-friendly controls.

## 🚀 Quick Start

```bash
npm install
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## 🧪 Testing

```bash
npm test
```

Unit tests cover the key dashboard areas and validate the geolocation integration.

## 🕑 Changing Timezones

1. Click or tap the bottom digital tile on the clock labeled “Selected Zone”.
2. Use the modal search to pick any supported timezone.
3. The Date card updates with the region name, identifier, UTC offset, and the difference relative to your device time.

## 📦 Building Native Bundles with Capacitor

1. Build the web assets that Capacitor will embed:

	```bash
	npm run build
	```

2. (First-time setup) add the native platforms after installing the new dependencies:

	```bash
	npx cap add android
	npx cap add ios
	```

3. Sync the compiled assets into the native shells whenever you make changes:

	```bash
	npm run cap:sync
	```

### Android

1. Open the Android project:

	```bash
	npm run cap:open:android
	```

2. Android Studio will launch; from there you can run on an emulator/device or assemble a release APK/AAB.

### iOS

1. Open the iOS workspace:

	```bash
	npm run cap:open:ios
	```

2. Xcode opens ready for simulator testing, signing, and App Store packaging.

> **Tip:** For live-reload during device testing, temporarily set a dev server URL inside `capacitor.config.json`, run `npm start`, and use `npx cap run`.

## 🔒 Permissions & Privacy

- Location access is optional; deny it to keep using the clock without GPS data.
- No location data leaves the device—everything runs locally on the device, whether you build for the web or package natively.

## 🛠 Tech Stack

- React 18 + Hooks
- Custom hooks for device time and GPS management
- PropTypes for runtime safety
- React 18 with Hooks
- Capacitor 5 for native Android/iOS shells
- Custom hooks for device time and GPS management
- PropTypes for runtime safety
- Create React App build pipeline

## 🤝 Contributing

Issues and pull requests are welcome! Please open a ticket describing the enhancement or bugfix you have in mind.
