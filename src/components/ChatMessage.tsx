/**
 * Chat Message Component
 * Displays individual messages in the chat
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChatMessage as ChatMessageType } from '../types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.noriContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.noriBubble,
        ]}
      >
        {message.text && (
          <Text
            style={[
              styles.text,
              isUser ? styles.userText : styles.noriText,
            ]}
          >
            {message.text}
          </Text>
        )}
        <Text
          style={[
            styles.timestamp,
            isUser ? styles.userTimestamp : styles.noriTimestamp,
          ]}
        >
          {time}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  noriContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  noriBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  userText: {
    color: '#fff',
  },
  noriText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 2,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  noriTimestamp: {
    color: '#999',
  },
});
