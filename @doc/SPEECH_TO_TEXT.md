# Speech-to-Text Integration Guide

## Current Status

T2.1 implements the voice recording infrastructure with a placeholder for speech-to-text conversion. The recording functionality is complete and works on iOS and Android, but transcription requires integration with a speech recognition service.

## What's Implemented

✅ Audio recording with `expo-audio`
✅ Press-and-hold microphone button
✅ Recording state management
✅ Permission handling (iOS and Android)
✅ UI for transcription display
✅ Error handling

## What Needs Integration

❌ Speech-to-text service integration
- The `transcribeAudio()` function in `src/services/speechToTextService.ts` is a placeholder
- The `useVoiceRecording` hook records audio but doesn't transcribe yet

## Integration Options

### Option 1: Google Cloud Speech-to-Text API (Recommended for MVP)

**Pros:**
- High accuracy
- Good language support
- Easy to integrate
- Free tier available

**Cons:**
- Requires API key and billing setup
- Network dependency

**Implementation:**
1. Set up Google Cloud project and enable Speech-to-Text API
2. Get API key or use service account
3. Update `src/services/speechToTextService.ts` with API calls
4. Add API key to environment config

**Example Code:**
```typescript
// In speechToTextService.ts
export async function transcribeAudio(
  audioUri: string,
  languageCode: string = 'en-US'
): Promise<TranscriptionResult> {
  // Read audio file
  const audioData = await FileSystem.readAsStringAsync(audioUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Call Google Cloud Speech-to-Text API
  const response = await fetch(
    `https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: languageCode,
        },
        audio: {
          content: audioData,
        },
      }),
    }
  );

  const data = await response.json();
  return {
    text: data.results[0]?.alternatives[0]?.transcript || '',
    confidence: data.results[0]?.alternatives[0]?.confidence,
  };
}
```

### Option 2: Azure Cognitive Services Speech

**Pros:**
- Good accuracy
- Multiple language support
- Azure integration if using Azure backend

**Cons:**
- Requires Azure account
- Network dependency

**Implementation:**
Similar to Google Cloud, but using Azure endpoints and authentication.

### Option 3: On-Device Solution (Future Enhancement)

**Pros:**
- Works offline
- No API costs
- Privacy-friendly

**Cons:**
- Requires custom dev client (not Expo Go)
- Larger app size
- May have lower accuracy

**Libraries:**
- `@react-native-voice/voice` - Requires custom dev client
- `react-native-speech-recognition` - Requires native modules

**Note:** On-device solutions require ejecting from Expo managed workflow or using Expo's custom development client.

## Next Steps

1. Choose a speech-to-text service (recommend Google Cloud for MVP)
2. Set up API credentials
3. Update `src/services/speechToTextService.ts` with actual implementation
4. Update `src/hooks/useVoiceRecording.ts` to call transcription service
5. Update `src/screens/HomeScreen.tsx` to display transcribed text in input field
6. Test on iOS and Android devices

## Testing

Once integrated:
1. Test recording on iOS device
2. Test recording on Android device
3. Verify transcription accuracy
4. Test error handling (no network, API errors)
5. Verify transcribed text appears in input field

## Current Behavior

- Recording works: ✅
- Audio is saved: ✅
- Transcription: ⚠️ Placeholder (shows alert)
- Text in input: ⚠️ Not yet connected

## Acceptance Criteria Status

- ✅ Voice input works on iOS and Android (recording)
- ⚠️ Transcribed text appears in input field (needs service integration)
