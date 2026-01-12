/**
 * Environment configuration handler
 * Supports dev/staging/prod environments
 * 
 * To configure, set EXPO_PUBLIC_* variables in .env files
 * or use app.json extra field for native builds
 */

import Constants from 'expo-constants';

type Environment = 'development' | 'staging' | 'production';

interface EnvConfig {
  environment: Environment;
  apiUrl: string;
  apiKey?: string;
  enableAnalytics: boolean;
}

const getEnvironment = (): Environment => {
  const env = Constants.expoConfig?.extra?.environment || 
              (__DEV__ ? 'development' : 'production');
  if (env === 'production') return 'production';
  if (env === 'staging') return 'staging';
  return 'development';
};

// Get config from Expo constants or defaults
const extra = Constants.expoConfig?.extra || {};

export const env: EnvConfig = {
  environment: getEnvironment(),
  apiUrl: extra.apiUrl || 'http://localhost:3000',
  apiKey: extra.apiKey,
  enableAnalytics: extra.enableAnalytics === true || extra.enableAnalytics === 'true',
};

export default env;
