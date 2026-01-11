# Nori (SousChef)

A cozy, voice-first cooking assistant that helps people cook with what they have.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Studio (for Android development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on iOS:
```bash
npm run ios
```

4. Run on Android:
```bash
npm run android
```

## Environment Configuration

The app supports different environments (development, staging, production). Configuration is managed through `app.json` extra field or environment variables.

To configure:
- Edit `app.json` extra field for default values
- Use `.env` files for local overrides (requires `react-native-config` or similar)

## Project Structure

```
src/
  ├── config/          # Environment and app configuration
  ├── navigation/      # Navigation setup (React Navigation)
  └── screens/         # Screen components
```

## Development

This project uses:
- React Native with Expo
- TypeScript
- React Navigation (Stack + Tabs)

## License

Private project
