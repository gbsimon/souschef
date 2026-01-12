/**
 * Voice Recording Hook
 * Handles audio recording and speech-to-text conversion
 */

import { useState, useRef, useEffect } from 'react';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from 'expo-audio';

export interface VoiceRecordingState {
  isRecording: boolean;
  isProcessing: boolean;
  transcription: string;
  error: string | null;
}

export function useVoiceRecording() {
  const [state, setState] = useState<VoiceRecordingState>({
    isRecording: false,
    isProcessing: false,
    transcription: '',
    error: null,
  });

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recordingStartTimeRef = useRef<number | null>(null);
  const MIN_RECORDING_DURATION = 500; // Minimum 500ms to consider it a valid recording

  // Request permissions on mount
  useEffect(() => {
    requestPermissions();
  }, []);

  async function requestPermissions() {
    try {
      const { status, granted } = await requestRecordingPermissionsAsync();
      if (!granted || status !== 'granted') {
        setState(prev => ({
          ...prev,
          error: 'Microphone permission is required for voice input',
        }));
      }
    } catch (error) {
      console.error('Error requesting audio permissions:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to request microphone permission',
      }));
    }
  }

  async function startRecording() {
    try {
      // Set audio mode for recording
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await recorder.prepareToRecordAsync();
      recorder.record();
      recordingStartTimeRef.current = Date.now();
      setState(prev => ({
        ...prev,
        isRecording: true,
        error: null,
        transcription: '',
      }));
    } catch (error) {
      console.error('Error starting recording:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to start recording',
        isRecording: false,
      }));
    }
  }

  async function stopRecording(): Promise<{ uri: string | null; duration: number } | null> {
    if (!recorder || !recorder.isRecording) {
      return null;
    }

    const startTime = recordingStartTimeRef.current;
    recordingStartTimeRef.current = null;

    try {
      setState(prev => ({ ...prev, isProcessing: true }));

      await recorder.stop();
      const status = recorder.getStatus();
      const duration = status.durationMillis ?? (startTime ? Date.now() - startTime : 0);
      const uri = status.url ?? recorder.uri ?? null;

      // Reset audio mode
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: false,
      });

      setState(prev => ({
        ...prev,
        isRecording: false,
        isProcessing: false,
      }));

      // Return both URI and duration
      return { uri, duration };
    } catch (error) {
      console.error('Error stopping recording:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to stop recording',
        isRecording: false,
        isProcessing: false,
      }));
      return null;
    }
  }

  /**
   * Cancel recording without processing
   */
  async function cancelRecording(): Promise<void> {
    if (!recorder || !recorder.isRecording) {
      return;
    }

    try {
      await recorder.stop();
      recordingStartTimeRef.current = null;

      // Reset audio mode
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: false,
      });

      setState(prev => ({
        ...prev,
        isRecording: false,
        isProcessing: false,
      }));
    } catch (error) {
      console.error('Error canceling recording:', error);
      setState(prev => ({
        ...prev,
        isRecording: false,
        isProcessing: false,
      }));
    }
  }

  /**
   * Transcribe audio file to text
   * For MVP, this is a placeholder that can be replaced with a real service
   * Options: Google Speech-to-Text API, Azure Speech Services, or on-device library
   */
  async function transcribeAudio(uri: string): Promise<string> {
    // TODO: Integrate with speech-to-text service
    // For now, return empty string - will be implemented with actual service
    // Example services:
    // - Google Cloud Speech-to-Text API
    // - Azure Cognitive Services Speech
    // - On-device: @react-native-voice/voice (requires custom dev client)
    
    setState(prev => ({ ...prev, isProcessing: true }));
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setState(prev => ({
      ...prev,
      isProcessing: false,
      transcription: '', // Will be populated by actual service
    }));

    return '';
  }

  function clearTranscription() {
    setState(prev => ({
      ...prev,
      transcription: '',
      error: null,
    }));
  }

  return {
    ...state,
    startRecording,
    stopRecording,
    cancelRecording,
    transcribeAudio,
    clearTranscription,
    MIN_RECORDING_DURATION,
  };
}
