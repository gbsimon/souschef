/**
 * Authentication service
 * Handles sign up, login, logout, and session management
 */

import * as SecureStore from 'expo-secure-store';
import { UserProfile, SignUpData, LoginData } from '../types/auth';

const USER_TOKEN_KEY = 'user_token';
const USER_PROFILE_KEY = 'user_profile';

/**
 * Sign up a new user
 * In MVP, this is a simple local storage implementation
 * In production, this would call an API
 */
export async function signUp(data: SignUpData): Promise<UserProfile> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // In production, this would call your backend API
  // For MVP, we'll create a local user profile
  const user: UserProfile = {
    id: `user_${Date.now()}`,
    email: data.email,
    locale: 'en-US', // Default locale, can be updated later
    createdAt: new Date().toISOString(),
  };

  // Store token and profile securely
  const token = `token_${user.id}`;
  await SecureStore.setItemAsync(USER_TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_PROFILE_KEY, JSON.stringify(user));

  return user;
}

/**
 * Login an existing user
 */
export async function login(data: LoginData): Promise<UserProfile> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // In production, this would call your backend API
  // For MVP, we'll check if user exists in storage or create one
  const existingProfile = await SecureStore.getItemAsync(USER_PROFILE_KEY);
  
  if (existingProfile) {
    const user = JSON.parse(existingProfile) as UserProfile;
    // In production, verify password with backend
    if (user.email === data.email) {
      const token = `token_${user.id}`;
      await SecureStore.setItemAsync(USER_TOKEN_KEY, token);
      return user;
    }
  }

  // If no existing user, create one (for MVP simplicity)
  // In production, this would return an error
  return signUp(data);
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync(USER_TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_PROFILE_KEY);
}

/**
 * Get current user session
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const profileJson = await SecureStore.getItemAsync(USER_PROFILE_KEY);
    if (profileJson) {
      return JSON.parse(profileJson) as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await SecureStore.getItemAsync(USER_TOKEN_KEY);
  return !!token;
}

/**
 * Update user profile
 */
export async function updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error('No user logged in');
  }

  const updatedUser: UserProfile = {
    ...currentUser,
    ...updates,
  };

  await SecureStore.setItemAsync(USER_PROFILE_KEY, JSON.stringify(updatedUser));
  return updatedUser;
}
