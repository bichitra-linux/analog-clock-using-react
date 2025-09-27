# Chrono Compass

Chrono Compass is a cross-platform analog clock dashboard that stays in sync with your device time and location. It ships as an installable Progressive Web App (PWA), delivers silky smooth updates with sub-second alignment, and gracefully handles location permissions, offline usage, and reduced-motion preferences.

## ✨ Features

- **Device-synced analog clock + dedicated digital readout** with micro-adjusted tick scheduling for zero drift.
- **GPS integration** powered by the browser Geolocation API with comprehensive error handling, accuracy reporting, and retry controls.
- **Responsive, mobile-first layout** with safe-area support for modern devices and fine-tuned glassmorphism styling.
- **Offline-ready PWA**: install it on desktop or mobile and keep the clock running without connectivity.
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

## 📦 Production Build

```bash
npm run build
```

This outputs an optimized bundle in the `build` directory, ready for static hosting.

## 📱 Install as a PWA

1. Open the production build (`npm run build` + serve) or `npm start` in Chrome/Edge.
2. Use the browser menu → “Install Chrono Compass”.
3. Launch the standalone app from your home screen or apps list.

## 🔒 Permissions & Privacy

- Location access is optional; deny it to keep using the clock without GPS data.
- No location data leaves the device—everything runs locally in the browser.

## 🛠 Tech Stack

- React 18 + Hooks
- Custom hooks for device time and GPS management
- PropTypes for runtime safety
- Create React App toolchain with service worker enhancements

## 🤝 Contributing

Issues and pull requests are welcome! Please open a ticket describing the enhancement or bugfix you have in mind.
