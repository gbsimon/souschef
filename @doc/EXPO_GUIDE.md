# Expo Development Guide

## What is Expo?

Expo is a framework and platform for React Native that makes mobile app development easier. It provides:
- **Managed workflow**: No need to configure Xcode or Android Studio initially
- **Built-in APIs**: Camera, location, notifications, etc. are ready to use
- **Fast refresh**: See changes instantly as you code
- **Easy testing**: Test on real devices via Expo Go app

## Quick Start

### 1. Start the Development Server

```bash
npm start
```

This opens the **Expo DevTools** in your browser (usually `http://localhost:8081`). You'll see:
- A QR code to scan with your phone
- Options to open in iOS Simulator or Android Emulator
- Logs and error messages

### 2. Run on Your Device (Easiest Way)

**Option A: Use Expo Go App (Recommended for beginners)**
1. Install **Expo Go** on your iPhone (App Store) or Android (Play Store)
2. Scan the QR code from the terminal/browser with:
   - **iOS**: Use your Camera app (it will open Expo Go)
   - **Android**: Use the Expo Go app to scan
3. Your app loads on your phone instantly!

**Option B: Use Simulator/Emulator**
- **iOS (Mac only)**: Press `i` in the terminal or click "Run on iOS simulator"
- **Android**: Press `a` in the terminal (requires Android Studio/emulator setup)

### 3. Common Commands

```bash
# Start dev server
npm start

# Start and open iOS simulator
npm run ios

# Start and open Android emulator
npm run android

# Start web version (for testing UI)
npm run web

# Clear cache if things get weird
npm start -- --clear
```

## Development Workflow

### Making Changes

1. **Edit your code** in `src/` directory
2. **Save the file** - Expo automatically reloads (Fast Refresh)
3. **See changes instantly** on your device/simulator

### Hot Reload vs Fast Refresh

- **Fast Refresh**: Preserves component state when possible (default)
- **Full reload**: Press `r` in terminal to reload the entire app
- **Reload manually**: Shake device → "Reload" (or `Cmd+R` on iOS simulator, `R+R` on Android)

### Debugging

**View Logs:**
- Check the terminal where `npm start` is running
- Or open DevTools in browser (usually auto-opens)

**React Native Debugger:**
- Shake device → "Debug Remote JS"
- Opens Chrome DevTools for debugging

**Common Issues:**
- If app doesn't update: Press `r` to reload
- If stuck: Stop server (`Ctrl+C`) and restart with `npm start -- --clear`
- If Metro bundler errors: Clear cache with `npm start -- --clear`

## Project Structure

```
SousChef/
├── App.tsx              # Main app entry point
├── app.json             # Expo configuration
├── package.json         # Dependencies
├── src/
│   ├── screens/         # Your screen components
│   ├── navigation/      # Navigation setup
│   └── config/          # App configuration
└── assets/              # Images, fonts, etc. (create if needed)
```

## Key Files Explained

### `app.json`
- App name, icon, splash screen
- iOS/Android specific settings
- Environment variables (in `extra` field)

### `App.tsx`
- Root component that renders your app
- This is where your navigation starts

### `package.json`
- Lists all dependencies
- Contains scripts (`npm start`, `npm run ios`, etc.)

## Testing on Real Devices

### iOS (iPhone/iPad)
1. Make sure iPhone and Mac are on same WiFi
2. Run `npm start`
3. Scan QR code with Camera app (iOS 11+)
4. App opens in Expo Go

### Android
1. Make sure phone and computer are on same WiFi
2. Run `npm start`
3. Open Expo Go app → Scan QR code
4. Or use USB: Enable USB debugging, then `npm run android`

## Common Tasks

### Adding a New Screen
1. Create file in `src/screens/YourScreen.tsx`
2. Add to navigation in `src/navigation/AppNavigator.tsx`
3. Save → Auto-reloads!

### Adding Dependencies
```bash
# Install a package
npm install package-name

# If it's a native module, you might need to restart
npm start -- --clear
```

### Using Expo APIs
Expo provides many APIs out of the box. Examples:
- `expo-camera` - Camera access
- `expo-location` - GPS
- `expo-speech` - Text-to-speech (useful for voice features!)
- `expo-audio` - Audio playback and recording
- `expo-video` - Video playback

Install with: `npx expo install expo-package-name`

## Tips for Your Project (Nori)

### Voice Features
For voice input (T1.2), you'll likely use:
- `expo-speech` - For text-to-speech (Nori speaking)
- `expo-audio` - For audio recording (user speaking)
- Or consider `@react-native-voice/voice` for speech-to-text

### Environment Variables
Your `src/config/env.ts` reads from `app.json` extra field. To change:
1. Edit `app.json` → `extra` section
2. Restart dev server

### Performance
- Expo is fast for development
- For production, you can create a "development build" or "production build"
- For now, Expo Go is perfect for MVP development

## Troubleshooting

**"Unable to resolve module"**
- Run `npm install`
- Clear cache: `npm start -- --clear`

**App won't load on phone**
- Make sure phone and computer are on same WiFi
- Try restarting Expo Go app
- Check firewall isn't blocking port 8081

**Simulator won't open**
- iOS: Make sure Xcode is installed
- Android: Make sure Android Studio and emulator are set up

**TypeScript errors**
- Check `tsconfig.json` is correct
- Restart TypeScript server in your editor

## Next Steps

1. **Start the server**: `npm start`
2. **Open on device**: Scan QR code with Expo Go
3. **Make a change**: Edit `src/screens/HomeScreen.tsx` and save
4. **See it update**: Watch your device update instantly!

## Resources

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Expo API Reference](https://docs.expo.dev/versions/latest/)

## For Your Project

When you're ready to work on:
- **T1.2 (Auth)**: You'll add screens and navigation
- **T2.1 (Voice)**: You'll install voice packages
- **T3.1 (AI)**: You'll make API calls (network works fine in Expo)

Everything you need is available in Expo's managed workflow!
