/**
 * Voice Input Button Component
 * Tap-to-talk button with recording states
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../i18n/useTranslation';

interface VoiceInputButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export default function VoiceInputButton({
  isRecording,
  isProcessing,
  onPress,
  disabled = false,
}: VoiceInputButtonProps) {
  const { t } = useTranslation();
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isRecording && styles.buttonRecording,
        disabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled || isProcessing}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {isProcessing ? (
          <>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.label}>{t.common.processing}</Text>
          </>
        ) : (
          <>
            <Ionicons
              name={isRecording ? 'mic' : 'mic-outline'}
              size={28}
              color="#fff"
            />
            <Text style={styles.label} numberOfLines={1}>
              {isRecording ? t.home.stop : t.home.speak}
            </Text>
            {isRecording && (
              <View style={styles.recordingIndicator}>
                <View style={styles.pulse} />
              </View>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonRecording: {
    backgroundColor: '#FF3B30',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  content: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: 4,
  },
  recordingIndicator: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  pulse: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 40,
    backgroundColor: '#FF3B30',
    opacity: 0.3,
  },
  label: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    maxWidth: 70,
  },
});
