/**
 * User Data Context
 * Provides user profile data (preferences, allergies, pantry, appliances) throughout the app
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import {
  ExtendedUserProfile,
  UserPreferences,
  Allergy,
  PantryItem,
  Appliance,
} from '../types/user';
import * as userDataService from '../services/userDataService';

interface UserDataContextType {
  profile: ExtendedUserProfile | null;
  isLoading: boolean;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  saveAllergy: (allergy: Omit<Allergy, 'id' | 'createdAt'>) => Promise<void>;
  removeAllergy: (allergyId: string) => Promise<void>;
  savePantryItem: (item: Omit<PantryItem, 'id' | 'createdAt'>) => Promise<void>;
  confirmPantryItem: (itemId: string, confirmed: boolean) => Promise<void>;
  removePantryItem: (itemId: string) => Promise<void>;
  saveAppliance: (appliance: Omit<Appliance, 'id' | 'createdAt'>) => Promise<void>;
  confirmAppliance: (applianceId: string, confirmed: boolean) => Promise<void>;
  removeAppliance: (applianceId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<ExtendedUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadProfile();
    } else {
      setProfile(null);
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  async function loadProfile() {
    if (!user) return;

    try {
      let userProfile = await userDataService.getUserProfile(user.id);
      
      // Initialize profile if it doesn't exist
      if (!userProfile) {
        userProfile = await userDataService.initializeUserProfile(
          user.id,
          user.email,
          user.locale
        );
      }

      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function updatePreferences(preferences: Partial<UserPreferences>) {
    if (!user) throw new Error('User not authenticated');
    
    const updated = await userDataService.updatePreferences(user.id, preferences);
    setProfile(updated);
  }

  async function saveAllergy(allergy: Omit<Allergy, 'id' | 'createdAt'>) {
    if (!user) throw new Error('User not authenticated');
    
    const updated = await userDataService.saveAllergy(user.id, allergy);
    setProfile(updated);
  }

  async function removeAllergy(allergyId: string) {
    if (!user) throw new Error('User not authenticated');
    
    const updated = await userDataService.removeAllergy(user.id, allergyId);
    setProfile(updated);
  }

  async function savePantryItem(item: Omit<PantryItem, 'id' | 'createdAt'>) {
    if (!user) throw new Error('User not authenticated');
    
    const updated = await userDataService.savePantryItem(user.id, item);
    setProfile(updated);
  }

  async function confirmPantryItem(itemId: string, confirmed: boolean) {
    if (!user) throw new Error('User not authenticated');
    
    const updated = await userDataService.confirmPantryItem(user.id, itemId, confirmed);
    setProfile(updated);
  }

  async function removePantryItem(itemId: string) {
    if (!user) throw new Error('User not authenticated');
    
    const updated = await userDataService.removePantryItem(user.id, itemId);
    setProfile(updated);
  }

  async function saveAppliance(appliance: Omit<Appliance, 'id' | 'createdAt'>) {
    if (!user) throw new Error('User not authenticated');
    
    const updated = await userDataService.saveAppliance(user.id, appliance);
    setProfile(updated);
  }

  async function confirmAppliance(applianceId: string, confirmed: boolean) {
    if (!user) throw new Error('User not authenticated');
    
    const updated = await userDataService.confirmAppliance(user.id, applianceId, confirmed);
    setProfile(updated);
  }

  async function removeAppliance(applianceId: string) {
    if (!user) throw new Error('User not authenticated');
    
    const updated = await userDataService.removeAppliance(user.id, applianceId);
    setProfile(updated);
  }

  async function refreshProfile() {
    await loadProfile();
  }

  return (
    <UserDataContext.Provider
      value={{
        profile,
        isLoading,
        updatePreferences,
        saveAllergy,
        removeAllergy,
        savePantryItem,
        confirmPantryItem,
        removePantryItem,
        saveAppliance,
        confirmAppliance,
        removeAppliance,
        refreshProfile,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}
