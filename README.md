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

The app supports different environments (development, staging, production). 

**⚠️ Required: OpenAI API Key**

To use the AI features, you need to set up your OpenAI API key:

1. Create a `.env` file in the root directory:
   ```bash
   echo "EXPO_PUBLIC_OPENAI_API_KEY=your-api-key-here" > .env
   ```

2. Get your API key from https://platform.openai.com/api-keys

3. Restart the Expo dev server

See [`@doc/ENV_SETUP.md`](./@doc/ENV_SETUP.md) for detailed instructions.

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
