/**
 * User Data Service
 * Handles storage and retrieval of user profile data (preferences, allergies, pantry, appliances)
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ExtendedUserProfile,
  UserPreferences,
  Allergy,
  PantryItem,
  Appliance,
} from '../types/user';

const USER_PROFILE_KEY = 'user_extended_profile';

/**
 * Get extended user profile
 */
export async function getUserProfile(userId: string): Promise<ExtendedUserProfile | null> {
  try {
    const profileJson = await AsyncStorage.getItem(`${USER_PROFILE_KEY}_${userId}`);
    if (profileJson) {
      return JSON.parse(profileJson) as ExtendedUserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

/**
 * Create or update extended user profile
 */
export async function saveUserProfile(profile: ExtendedUserProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(
      `${USER_PROFILE_KEY}_${profile.id}`,
      JSON.stringify(profile)
    );
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
}

/**
 * Initialize user profile with defaults
 */
export async function initializeUserProfile(
  userId: string,
  email: string,
  locale: string
): Promise<ExtendedUserProfile> {
  const profile: ExtendedUserProfile = {
    id: userId,
    email,
    locale,
    createdAt: new Date().toISOString(),
    preferences: {
      dietaryRestrictions: [],
      preferredCuisines: [],
      skillLevel: 'intermediate',
    },
    allergies: [],
    pantry: [],
    appliances: [],
    updatedAt: new Date().toISOString(),
  };

  await saveUserProfile(profile);
  return profile;
}

/**
 * Update user preferences
 */
export async function updatePreferences(
  userId: string,
  preferences: Partial<UserPreferences>
): Promise<ExtendedUserProfile> {
  const profile = await getUserProfile(userId);
  if (!profile) {
    throw new Error('User profile not found');
  }

  profile.preferences = {
    ...profile.preferences,
    ...preferences,
  };
  profile.updatedAt = new Date().toISOString();

  await saveUserProfile(profile);
  return profile;
}

/**
 * Add or update allergy
 */
export async function saveAllergy(
  userId: string,
  allergy: Omit<Allergy, 'id' | 'createdAt'>
): Promise<ExtendedUserProfile> {
  const profile = await getUserProfile(userId);
  if (!profile) {
    throw new Error('User profile not found');
  }

  const newAllergy: Allergy = {
    ...allergy,
    id: `allergy_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  // Remove existing allergy with same name, then add new one
  profile.allergies = profile.allergies.filter(a => a.name !== allergy.name);
  profile.allergies.push(newAllergy);
  profile.updatedAt = new Date().toISOString();

  await saveUserProfile(profile);
  return profile;
}

/**
 * Remove allergy
 */
export async function removeAllergy(
  userId: string,
  allergyId: string
): Promise<ExtendedUserProfile> {
  const profile = await getUserProfile(userId);
  if (!profile) {
    throw new Error('User profile not found');
  }

  profile.allergies = profile.allergies.filter(a => a.id !== allergyId);
  profile.updatedAt = new Date().toISOString();

  await saveUserProfile(profile);
  return profile;
}

/**
 * Add or update pantry item
 */
export async function savePantryItem(
  userId: string,
  item: Omit<PantryItem, 'id' | 'createdAt'>
): Promise<ExtendedUserProfile> {
  const profile = await getUserProfile(userId);
  if (!profile) {
    throw new Error('User profile not found');
  }

  const newItem: PantryItem = {
    ...item,
    id: `pantry_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  // Remove existing item with same name, then add new one
  profile.pantry = profile.pantry.filter(p => p.name !== item.name);
  profile.pantry.push(newItem);
  profile.updatedAt = new Date().toISOString();

  await saveUserProfile(profile);
  return profile;
}

/**
 * Confirm or deny inferred pantry item
 */
export async function confirmPantryItem(
  userId: string,
  itemId: string,
  confirmed: boolean
): Promise<ExtendedUserProfile> {
  const profile = await getUserProfile(userId);
  if (!profile) {
    throw new Error('User profile not found');
  }

  const item = profile.pantry.find(p => p.id === itemId);
  if (item) {
    item.confirmed = confirmed;
    item.lastUsed = new Date().toISOString();
    profile.updatedAt = new Date().toISOString();
    await saveUserProfile(profile);
  }

  return profile;
}

/**
 * Remove pantry item
 */
export async function removePantryItem(
  userId: string,
  itemId: string
): Promise<ExtendedUserProfile> {
  const profile = await getUserProfile(userId);
  if (!profile) {
    throw new Error('User profile not found');
  }

  profile.pantry = profile.pantry.filter(p => p.id !== itemId);
  profile.updatedAt = new Date().toISOString();

  await saveUserProfile(profile);
  return profile;
}

/**
 * Add or update appliance
 */
export async function saveAppliance(
  userId: string,
  appliance: Omit<Appliance, 'id' | 'createdAt'>
): Promise<ExtendedUserProfile> {
  const profile = await getUserProfile(userId);
  if (!profile) {
    throw new Error('User profile not found');
  }

  const newAppliance: Appliance = {
    ...appliance,
    id: `appliance_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  // Remove existing appliance with same name, then add new one
  profile.appliances = profile.appliances.filter(a => a.name !== appliance.name);
  profile.appliances.push(newAppliance);
  profile.updatedAt = new Date().toISOString();

  await saveUserProfile(profile);
  return profile;
}

/**
 * Confirm or deny inferred appliance
 */
export async function confirmAppliance(
  userId: string,
  applianceId: string,
  confirmed: boolean
): Promise<ExtendedUserProfile> {
  const profile = await getUserProfile(userId);
  if (!profile) {
    throw new Error('User profile not found');
  }

  const appliance = profile.appliances.find(a => a.id === applianceId);
  if (appliance) {
    appliance.confirmed = confirmed;
    profile.updatedAt = new Date().toISOString();
    await saveUserProfile(profile);
  }

  return profile;
}

/**
 * Remove appliance
 */
export async function removeAppliance(
  userId: string,
  applianceId: string
): Promise<ExtendedUserProfile> {
  const profile = await getUserProfile(userId);
  if (!profile) {
    throw new Error('User profile not found');
  }

  profile.appliances = profile.appliances.filter(a => a.id !== applianceId);
  profile.updatedAt = new Date().toISOString();

  await saveUserProfile(profile);
  return profile;
}
