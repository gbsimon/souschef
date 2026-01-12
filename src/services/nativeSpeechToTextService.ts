/**
 * Native Speech-to-Text Service
 * Uses react-native-voicekit for on-device speech recognition
 * Supports FR/EN language switching
 */

import { useNativeSpeechRecognition, LanguageCode } from '../hooks/useNativeSpeechRecognition';

export interface TranscriptionResult {
  text: string;
  confidence?: number;
  language?: string;
}

/**
 * Create a native speech recognition instance
 * This should be used in components via the useNativeSpeechRecognition hook
 */
export function createNativeSpeechRecognition(language: LanguageCode = 'en-US') {
  // This is a factory function - actual implementation is in the hook
  // Components should use useNativeSpeechRecognition directly
  return {
    language,
    note: 'Use useNativeSpeechRecognition hook in components',
  };
}

/**
 * Check if native speech recognition is available
 */
export async function isNativeSpeechRecognitionAvailable(): Promise<boolean> {
  try {
    // Check if react-native-voicekit is available
    const { useVoice } = await import('react-native-voicekit');
    return true;
  } catch (error) {
    return false;
  }
}
