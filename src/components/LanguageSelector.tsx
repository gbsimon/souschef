/**
 * Language Selector Component
 * Allows switching between FR/EN for speech recognition and TTS
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LanguageCode } from '../hooks/useNativeSpeechRecognition';
import { useTranslation } from '../i18n/useTranslation';

interface LanguageSelectorProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
  disabled?: boolean;
  compact?: boolean; // Compact version for top right
}

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
  disabled = false,
  compact = false,
}: LanguageSelectorProps) {
  const { t } = useTranslation();
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <TouchableOpacity
          style={[
            styles.compactButton,
            currentLanguage === 'en-US' && styles.compactButtonActive,
            disabled && styles.buttonDisabled,
          ]}
          onPress={() => onLanguageChange('en-US')}
          disabled={disabled}
        >
          <Text
            style={[
              styles.compactButtonText,
              currentLanguage === 'en-US' && styles.compactButtonTextActive,
            ]}
          >
            EN
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.compactButton,
            currentLanguage === 'fr-FR' && styles.compactButtonActive,
            disabled && styles.buttonDisabled,
          ]}
          onPress={() => onLanguageChange('fr-FR')}
          disabled={disabled}
        >
          <Text
            style={[
              styles.compactButtonText,
              currentLanguage === 'fr-FR' && styles.compactButtonTextActive,
            ]}
          >
            FR
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t.language.label}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            currentLanguage === 'en-US' && styles.buttonActive,
            disabled && styles.buttonDisabled,
          ]}
          onPress={() => onLanguageChange('en-US')}
          disabled={disabled}
        >
          <Text
            style={[
              styles.buttonText,
              currentLanguage === 'en-US' && styles.buttonTextActive,
            ]}
          >
            {t.language.english}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            currentLanguage === 'fr-FR' && styles.buttonActive,
            disabled && styles.buttonDisabled,
          ]}
          onPress={() => onLanguageChange('fr-FR')}
          disabled={disabled}
        >
          <Text
            style={[
              styles.buttonText,
              currentLanguage === 'fr-FR' && styles.buttonTextActive,
            ]}
          >
            {t.language.french}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  buttonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  buttonTextActive: {
    color: '#fff',
  },
  // Compact styles for top right
  compactContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  compactButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    minWidth: 32,
    alignItems: 'center',
  },
  compactButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  compactButtonText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  compactButtonTextActive: {
    color: '#fff',
  },
});
