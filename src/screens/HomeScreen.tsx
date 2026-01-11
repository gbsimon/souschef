import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Home/Ask Screen
 * This is the main screen where users interact with Nori
 * Placeholder for now - will be expanded with voice/text input and chat UI
 */
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ask Nori</Text>
      <Text style={styles.subtitle}>Tap to speak or type your ingredients</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
