# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VEGO is a React Native (Expo) mobile app for discovering and managing EV charging stations in Uruguay. Spanish-language UI throughout. Built with Expo SDK 54, React 19, TypeScript 5.9.

## Commands

```bash
npx expo start          # Start dev server
npx expo start --ios    # Start on iOS simulator
npx expo start --android # Start on Android emulator
npx expo start --web    # Start web version
```

No test runner, linter, or formatter is currently configured.

## Architecture

**Routing:** Expo Router (file-based) with two route groups:
- `(auth)` — welcome, login, register screens
- `(tabs)` — map, favorites, profile tabs
- `station/[id]` — dynamic station detail page

Auth guard in `app/_layout.tsx` redirects based on Firebase auth state.

**Data flow:** Services (Firebase) → Hooks (subscriptions) → Zustand Stores → Components

- `services/` — Firebase abstraction layer (auth.ts, stations.ts, firebase.ts)
- `hooks/` — useAuth (auth state listener), useLocation (GPS subscription), useStations (Firestore real-time listener + auto-seed)
- `stores/` — Zustand stores for auth state and station state (includes haversine distance calc for nearest station)

**Backend:** Firebase (Firestore + Auth with email/password). Config in `services/firebase.ts` needs real credentials. Station data auto-seeds from `data/ute-stations.json` when Firestore is empty.

## Key Types (types/index.ts)

- `Station` — id, name, address, lat/lng, status (`available`|`occupied`|`broken`), connectorType, power, operator, lastCheckin
- `User` — uid, email, displayName, photoURL, ecoPoints, createdAt
- `CheckIn` — userId, userName, status, timestamp, estimatedDuration

## Styling

Uses `StyleSheet.create()` with design tokens from `constants/theme.ts`. Primary color: `#00C853` (green). NativeWind/TailwindCSS is installed but not actively used in components — styles are inline via the theme constants.

## Conventions

- PascalCase for component files, camelCase for functions/variables
- Components grouped by feature under `components/` (Map/, Station/)
- All UI strings are hardcoded in Spanish (no i18n library)
- Error handling via try/catch with `Alert.alert()`
- Location falls back to Montevideo coordinates if permission denied
