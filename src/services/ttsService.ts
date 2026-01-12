/**
 * Text-to-Speech Service
 * Uses expo-speech for native iOS/Android TTS
 * Supports FR/EN language switching
 */

import * as Speech from 'expo-speech';

export type LanguageCode = 'en-US' | 'fr-FR';

const LANGUAGE_MAP: Record<LanguageCode, string> = {
  'en-US': 'en-US',
  'fr-FR': 'fr-FR',
};

/**
 * Speak text using native TTS
 */
export async function speak(
  text: string,
  language: LanguageCode = 'en-US',
  options?: {
    pitch?: number;
    rate?: number;
    volume?: number;
  }
): Promise<void> {
  const languageCode = LANGUAGE_MAP[language];
  
  return new Promise((resolve, reject) => {
    Speech.speak(text, {
      language: languageCode,
      pitch: options?.pitch || 1.0,
      rate: options?.rate || 0.9,
      volume: options?.volume || 1.0,
      onDone: () => resolve(),
      onError: (error) => reject(error),
    });
  });
}

/**
 * Stop current speech
 */
export function stopSpeaking(): void {
  Speech.stop();
}

/**
 * Check if TTS is available
 */
export function isTTSAvailable(): boolean {
  return Speech.isAvailableAsync().then(() => true).catch(() => false);
}

/**
 * Get available voices for a language
 */
export async function getAvailableVoices(language?: LanguageCode): Promise<Speech.Voice[]> {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    if (language) {
      const langCode = LANGUAGE_MAP[language];
      return voices.filter(v => v.language.startsWith(langCode.split('-')[0]));
    }
    return voices;
  } catch (error) {
    console.error('Error getting available voices:', error);
    return [];
  }
}
