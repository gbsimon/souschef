/**
 * Native Speech Recognition Hook
 * Uses react-native-voicekit for on-device speech-to-text
 * Supports FR/EN language switching
 */

import { useState, useEffect, useRef } from 'react';
import { useVoice, VoiceMode } from 'react-native-voicekit';
import { Platform } from 'react-native';

export type LanguageCode = 'en-US' | 'fr-FR';

export interface NativeSpeechState {
  isAvailable: boolean;
  isListening: boolean;
  transcript: string;
  partialTranscript: string;
  error: string | null;
  language: LanguageCode;
}

export function useNativeSpeechRecognition(initialLanguage: LanguageCode = 'en-US') {
  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
  const [error, setError] = useState<string | null>(null);

  const {
    available,
    listening,
    transcript,
    partialResults,
    startListening,
    stopListening,
  } = useVoice({
    locale: language,
    mode: VoiceMode.Default,
    enablePartialResults: true,
  });

  // Update language when it changes
  useEffect(() => {
    if (listening) {
      // Stop current session before changing language
      stopListening();
    }
  }, [language]);

  const start = async () => {
    try {
      setError(null);
      await startListening();
    } catch (err: any) {
      setError(err.message || 'Failed to start speech recognition');
      console.error('Speech recognition error:', err);
    }
  };

  const stop = async () => {
    try {
      await stopListening();
    } catch (err: any) {
      setError(err.message || 'Failed to stop speech recognition');
      console.error('Speech recognition error:', err);
    }
  };

  const changeLanguage = (newLanguage: LanguageCode) => {
    setLanguage(newLanguage);
  };

  return {
    isAvailable: available,
    isListening: listening,
    transcript: transcript || '',
    partialTranscript: partialResults?.[0] || '',
    error,
    language,
    startListening: start,
    stopListening: stop,
    changeLanguage,
  };
}
