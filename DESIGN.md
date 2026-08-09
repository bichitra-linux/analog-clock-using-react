---
name: Chrono Watch
source: Stitch project "Chrono Watch Mobile World Clock" (projects/2429509935513412089)
---

# Chrono Watch — Design System

Futuristic Precision aesthetic: atmospheric midnight tones, neon cyan/purple luminosity,
glassmorphic containers, tactile engineered controls. Dark mode only, mobile-first.

## Colors

| Token | Value |
|---|---|
| surface / background | `#051424` |
| surface-dim | `#051424` |
| surface-container-lowest | `#010f1f` |
| surface-container-low | `#0d1c2d` |
| surface-container | `#122131` |
| surface-container-high | `#1c2b3c` |
| surface-container-highest / surface-variant | `#273647` |
| surface-bright | `#2c3a4c` |
| on-surface | `#d4e4fa` |
| on-surface-variant | `#bbc9cd` |
| outline | `#859397` |
| outline-variant | `#3c494c` |
| primary | `#8aebff` |
| primary-container / electric cyan | `#22d3ee` |
| on-primary | `#00363e` |
| on-primary-container | `#005763` |
| secondary | `#ddb7ff` |
| secondary-container / vibrant purple | `#a855f7` (seed) / `#6f00be` |
| on-secondary | `#490080` |
| tertiary | `#d5dcf6` |
| error | `#ffb4ab` |
| error-container | `#93000a` |
| on-error | `#690005` |
| surface-tint | `#2fd9f4` |

Glass surfaces: 10% white fill, 15% white border (cards); 15% fill + 40px blur (modals).
Active state glow: `0 0 15px rgba(34, 211, 238, 0.3)`.

## Typography

| Style | Family | Size | Weight | Line | Track |
|---|---|---|---|---|---|
| display-time | Inter | 64px | 700 | 1 | -0.02em |
| display-time-mobile | Inter | 48px | 700 | 1 | — |
| headline-lg | Inter | 32px | 600 | 40px | — |
| headline-md | Inter | 24px | 600 | 32px | — |
| body-lg | Inter | 18px | 400 | 28px | — |
| body-md | Inter | 16px | 400 | 24px | — |
| label-mono | JetBrains Mono | 12px | 500 | 16px | 0.05em |

Inter = UI/text. JetBrains Mono = technical metadata (offsets, coordinates, UTC).

## Spacing (4px base)

- base 4px, xs 8px, sm 16px, md 24px, lg 40px, xl 64px
- gutter 16px, mobile side margin 20px
- Vertical rhythm: 40–64px between major clock zones, 16–24px inside card lists
- Interactive elements ≥ 44px tall

## Elevation

- Level 0: solid `#0F172A`/`#051424` background
- Level 1 (cards/lists): glass 10% white + 20px backdrop blur + 1px border
- Level 2 (modals/overlays): glass 15% white + 40px backdrop blur
- Active: cyan outer glow `0 0 15px rgba(34,211,238,.3)`

## Shapes

- Cards: 16px radius; buttons: 24px; search inputs: pill; clock face: 100% circle
- Tokens: sm 4px, md 12px, lg 16px, xl 24px, full 9999px

## Components

- **Analog clock face**: minimalist; cyan hour/minute hands, thin purple second hand;
  no numerals; tick marks every 5-minute interval
- **Glass cards** (city listings): city name (headline-md), time (display-time-mobile),
  time difference (label-mono)
- **Buttons**: high-saturation cyan; press scale 0.96
- **Search modal**: full-screen glass overlay, blurred bg; list rows separated by
  1px 5%-white bottom borders
- **Timezone chips**: small translucent capsules ("Home", "Work", "Travel",
  "+14HRS", "Tomorrow", "Current Location")
- **Inputs**: glass background, cyan glow on focus
- **Bottom nav**: 4 tabs — Clocks, Alarms, Stopwatch, Timer; icons + labels

## Screens (Stitch inventory)

- Dashboard (+ Smooth Sweep / Ticking / Sleep Mode variants): header (location icon,
  "CHRONO WATCH", settings gear), status line ("Synchronized — Precision Horology"),
  clock zone, Device Time card, Selected Zone card (+XHRS chip), Current Position card,
  3D Fix card (Acc + refresh), bottom nav
- World View: search bar, popular cities row, Pinned Locations cards
  (chip: "Tomorrow, +14 HRS" | "Current Location" | "Today, -5 HRS", time + AM/PM), ADD
- Timezone Picker / Search Results: search-first; Nearby (current position) +
  Popular Destinations (+XHRS chips, live time)
- Timezone Detail: big digital time, date, SUNRISE/SUNSET tiles, DIFFERENCE FROM
  LOCAL, Set as Home, Remove City
- Location Details: Location Intel card, mono LAT/LON, Altitude, Precision ±m,
  Temporal Zone (Zone Name / UTC Offset / Daylight Saving), Process Data Locally,
  Update Location
- Settings: Time Display (24h, Show Seconds), Audio sliders, GPS & Location
  (Accuracy: High/Balanced/Battery Saver, Update Frequency)
- Alarms: list with day-dot repeat, alarm_on/off state, "Upcoming — next alarm in Xh",
  add FAB; New/Edit Alarm: wheel time picker + AM/PM, repeat chips, label, sound, vibrate
- Ringtone: Select Ringtone list + preview modal
- Stopwatch: mm:ss.cc display, Lap/Stop/Reset, lap table (Lap Times / Overall Time)
- Timer: mm:ss, "Ends HH:MM", quick presets (1/5/10/30m), play/pause, reset
- States: Onboarding, permission popups (GPS/Location/Notification), Offline,
  Sync Error, Delete Confirmation, Empty states

## Implementation notes (this codebase)

- Token source of truth: `src/index.css` CSS custom properties
- Dark theme only; `prefers-color-scheme` no longer switches to light
- Inter + JetBrains Mono loaded via Google Fonts in `public/index.html`
- Reduced-motion: disable decorative animation, keep tick smoothing
- Touch: 44px min targets, `scale(0.96)` active feedback
