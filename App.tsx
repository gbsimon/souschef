import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { UserDataProvider } from './src/contexts/UserDataContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <UserDataProvider>
        <>
          <AppNavigator />
          <StatusBar style="auto" />
        </>
      </UserDataProvider>
    </AuthProvider>
  );
}
