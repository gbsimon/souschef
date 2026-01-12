# Native Speech Recognition Setup

## Overview

T2.1.1 integrates native iOS/Android speech recognition using `react-native-voicekit`. This requires a custom development client (not Expo Go) because it uses native modules.

## Setup Requirements

### 1. Install Dependencies

```bash
npm install react-native-voicekit
```

### 2. Configure app.json

The plugin is already configured in `app.json`:

```json
{
	"plugins": [
		[
			"react-native-voicekit",
			{
				"speechRecognitionPermission": "Nori needs access to speech recognition...",
				"microphonePermission": "Nori needs access to your microphone..."
			}
		]
	]
}
```

### 3. Prebuild Native Projects

Since this uses native modules, you need to generate native iOS/Android projects:

```bash
npx expo prebuild
```

This creates `ios/` and `android/` directories with native code.

### 4. Install iOS Dependencies

```bash
cd ios && pod install && cd ..
```

### 5. Build Custom Development Client

You can no longer use Expo Go. Instead, build a custom development client:

**For iOS:**

```bash
npx expo run:ios
```

**For Android:**

```bash
npx expo run:android
```

Or use EAS Build:

```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

## Usage

The native speech recognition is integrated via:

- `useNativeSpeechRecognition` hook - for speech-to-text
- `ttsService` - for text-to-speech
- `LanguageSelector` component - for FR/EN switching

## Language Support

- **English (en-US)**: Full support
- **French (fr-FR)**: Full support
- Language can be switched dynamically during use

## Testing

1. Build custom dev client
2. Test speech recognition in English
3. Switch to French and test again
4. Test TTS responses in both languages
5. Verify language switching works end-to-end

## Fallback

If native speech recognition is not available (e.g., in Expo Go), the app falls back to:

- Audio recording with `expo-audio`
- Mock transcription service
- Can be upgraded to cloud-based service (Google Cloud, Azure)

## Troubleshooting

**"Speech recognition not available"**

- Make sure you've run `npx expo prebuild`
- Rebuild the custom dev client
- Check that permissions are granted

**"Module not found: react-native-voicekit"**

- Run `npm install react-native-voicekit`
- Run `npx expo prebuild` again
- Rebuild the app

**Language switching not working**

- Stop current recognition session before switching
- Restart recognition after language change
