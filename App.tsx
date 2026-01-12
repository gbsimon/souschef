import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { UserDataProvider } from './src/contexts/UserDataContext';
import { ChatProvider } from './src/contexts/ChatContext';
import { TranslationProvider } from './src/i18n/useTranslation';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <TranslationProvider>
      <AuthProvider>
        <UserDataProvider>
          <ChatProvider>
            <>
              <AppNavigator />
              <StatusBar style="auto" />
            </>
          </ChatProvider>
        </UserDataProvider>
      </AuthProvider>
    </TranslationProvider>
  );
}
