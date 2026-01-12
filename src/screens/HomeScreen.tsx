import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, Keyboard, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNativeSpeechRecognition, LanguageCode } from '../hooks/useNativeSpeechRecognition';
import VoiceInputButton from '../components/VoiceInputButton';
import LanguageSelector from '../components/LanguageSelector';
import ChatView from '../components/ChatView';
import { useChat } from '../contexts/ChatContext';
import { sendUserMessage } from '../services/messageService';

/**
 * Home/Ask Screen
 * Main screen where users interact with Nori via voice or text input
 * Uses native speech recognition for real-time transcription
 */
export default function HomeScreen() {
  const [textInput, setTextInput] = useState('');
  const [language, setLanguage] = useState<LanguageCode>('en-US');
  const [isSending, setIsSending] = useState(false);
  const insets = useSafeAreaInsets();
  
  const {
    messages,
    isLoading,
    addUserMessage,
    addNoriMessage,
    setLoading,
  } = useChat();
  
  const {
    isAvailable,
    isListening,
    transcript,
    partialTranscript,
    error,
    startListening,
    stopListening,
    changeLanguage,
  } = useNativeSpeechRecognition(language);

  const handleLanguageChange = (newLanguage: LanguageCode) => {
    setLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  // Update text input when we get a final transcript (for editing before sending)
  // Note: Voice messages auto-send, but we still show transcript in input for visibility
  useEffect(() => {
    if (transcript && !isListening) {
      console.log('[STT] Final transcript received:', transcript);
      // Don't update text input for voice - it auto-sends
      // Only update if user wants to edit before sending (future enhancement)
    }
  }, [transcript, isListening]);

  // Handle sending message (unified for both voice and text)
  const handleSendMessage = async (messageText?: string, sourceOverride?: 'voice' | 'text') => {
    const messageToSend = messageText || textInput.trim();
    
    if (!messageToSend || messageToSend.length === 0) {
      Alert.alert('Empty Message', 'Please enter a message or use voice input.');
      return;
    }

    if (isSending || isLoading) {
      return; // Prevent double-sending
    }

    try {
      setIsSending(true);
      Keyboard.dismiss();

      // Determine source: use override if provided, otherwise infer from context
      const source = sourceOverride || (messageText ? 'voice' : 'text');
      
      // Add user message to chat
      addUserMessage(messageToSend, source);
      
      // Set loading state
      setLoading(true);
      
      console.log('[HomeScreen] Sending message:', { messageToSend, source, language });
      
      const response = await sendUserMessage(messageToSend, source, language);
      
      if (response.success) {
        // Clear text input after successful send
        setTextInput('');
        console.log('[HomeScreen] Message sent successfully:', response.messageId);
        
        // TODO: In T3.1, this will receive AI response with recipes
        // For now, add a placeholder Nori response
        setTimeout(() => {
          setLoading(false);
          addNoriMessage(
            "I'm working on finding the perfect recipes for you! This will be connected to AI orchestration in T3.1.",
            // recipes will be added here in T3.1
          );
        }, 1500);
      } else {
        setLoading(false);
        Alert.alert(
          'Send Failed',
          response.error || 'Failed to send message. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      setLoading(false);
      console.error('[HomeScreen] Error sending message:', error);
      Alert.alert(
        'Error',
        'An error occurred while sending your message. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSending(false);
    }
  };

  // Auto-send when voice transcription completes
  // Voice-first UX: when user stops speaking, automatically send the transcript
  useEffect(() => {
    if (transcript && !isListening && !isSending && transcript.trim().length > 0) {
      // Auto-send voice transcriptions for voice-first UX
      handleSendMessage(transcript, 'voice');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, isListening]);

  // Log partial transcripts for debugging
  useEffect(() => {
    if (partialTranscript) {
      console.log('[STT] Partial transcript:', partialTranscript);
    }
  }, [partialTranscript]);

  const handleVoicePress = async () => {
    // Dismiss keyboard when starting voice input
    Keyboard.dismiss();
    
    if (isListening) {
      // Stop listening (transcript will auto-send via useEffect)
      console.log('[STT] Stopping speech recognition...');
      await stopListening();
      console.log('[STT] Stopped. Final transcript:', transcript);
    } else {
      // Start listening
      console.log('[STT] Starting speech recognition...', { language, isAvailable });
      await startListening();
      console.log('[STT] Started listening');
    }
  };

  const handleTextSend = () => {
    handleSendMessage(undefined, 'text');
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Show error if speech recognition fails
  useEffect(() => {
    if (error) {
      Alert.alert('Speech Recognition Error', error);
    }
  }, [error]);

  // Show alert if native speech recognition is not available
  useEffect(() => {
    if (!isAvailable) {
      Alert.alert(
        'Speech Recognition Not Available',
        'Native speech recognition is not available on this device. Please ensure you are using a custom development client.',
        [{ text: 'OK' }]
      );
    }
  }, [isAvailable]);

  const handleRecipePress = (recipeId: string) => {
    // TODO: Navigate to recipe detail screen (T4.2)
    console.log('[HomeScreen] Recipe pressed:', recipeId);
    Alert.alert('Recipe Detail', `Recipe ${recipeId} will open in T4.2`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Ask Nori</Text>
          <LanguageSelector
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
            disabled={isListening}
            compact={true}
          />
        </View>

        {/* Chat View */}
        <ChatView
          messages={messages}
          isLoading={isLoading}
          onRecipePress={handleRecipePress}
        />

        {/* Real-time Transcription Display (only when listening) */}
        {isListening && (partialTranscript || transcript) && (
          <View style={styles.transcriptionContainer}>
            <Text style={styles.transcriptionLabel}>Listening...</Text>
            <Text style={styles.transcriptionText}>
              {partialTranscript || transcript || 'Speak now...'}
            </Text>
            {partialTranscript && (
              <Text style={styles.partialHint}>(partial results)</Text>
            )}
          </View>
        )}

        {/* Input Area */}
        <View style={[styles.inputArea, { paddingBottom: insets.bottom + 60 }]}>
          {/* Text Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your ingredients here..."
              placeholderTextColor="#999"
              value={textInput}
              onChangeText={setTextInput}
              multiline
              editable={!isListening && !isSending}
              returnKeyType="send"
              blurOnSubmit={false}
              onSubmitEditing={handleTextSend}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!textInput.trim() || isSending || isListening) && styles.sendButtonDisabled,
              ]}
              onPress={handleTextSend}
              disabled={!textInput.trim() || isSending || isListening}
            >
              <Ionicons
                name="send"
                size={20}
                color={(!textInput.trim() || isSending || isListening) ? '#999' : '#007AFF'}
              />
            </TouchableOpacity>
          </View>

          {/* Voice Input Button */}
          <View style={styles.voiceButtonContainer}>
            <VoiceInputButton
              isRecording={isListening}
              isProcessing={isSending || isLoading}
              onPress={handleVoicePress}
              disabled={!isAvailable || !!error || isSending}
            />
            {isListening && (
              <Text style={styles.recordingHint}>
                Tap to stop
              </Text>
            )}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  transcriptionContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    minHeight: 50,
  },
  transcriptionLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
    fontWeight: '600',
  },
  transcriptionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  partialHint: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
  },
  inputArea: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    paddingRight: 8,
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    padding: 12,
    paddingLeft: 16,
    fontSize: 16,
    maxHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: 'transparent',
  },
  sendButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  sendButtonDisabled: {
    opacity: 0.3,
  },
  voiceButtonContainer: {
    alignItems: 'center',
  },
  recordingHint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
});
