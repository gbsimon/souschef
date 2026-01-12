/**
 * Loading Indicator Component
 * Shows "Nori is thinking..." indicator during AI response
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function LoadingIndicator() {
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <ActivityIndicator size="small" color="#666" style={styles.spinner} />
        <Text style={styles.text}>Nori is thinking...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    maxWidth: '80%',
  },
  spinner: {
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});
