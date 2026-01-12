import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../i18n/useTranslation';

/**
 * Settings Screen
 * Shows user profile and settings options
 */
export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const handleLogout = () => {
    Alert.alert(
      t.settings.logOut,
      t.settings.logOutConfirm,
      [
        { text: t.alerts.cancel, style: 'cancel' },
        {
          text: t.settings.logOut,
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert(t.alerts.error, t.settings.logOutError);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.settings.account}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t.settings.email}</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t.settings.locale}</Text>
          <Text style={styles.infoValue}>{user?.locale || 'en-US'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.settings.settings}</Text>
        <Text style={styles.comingSoon}>{t.settings.comingSoon}</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>{t.settings.logOut}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  comingSoon: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
