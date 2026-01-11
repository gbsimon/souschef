/**
 * User Profile Data Schema
 * Extends the basic auth profile with preferences, allergies, pantry, and appliances
 */

export interface UserPreferences {
  // Dietary preferences (soft filters - suggest substitutions)
  dietaryRestrictions: DietaryPreference[];
  // Preferred cuisines
  preferredCuisines: string[];
  // Cooking skill level
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  // Preferred cooking time (in minutes)
  maxCookingTime?: number;
}

export type DietaryPreference = 
  | 'vegetarian'
  | 'vegan'
  | 'dairy-free'
  | 'gluten-free'
  | 'low-carb'
  | 'keto'
  | 'paleo'
  | 'pescatarian';

export interface Allergy {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  createdAt: string;
}

export interface PantryItem {
  id: string;
  name: string;
  category: PantryCategory;
  // Whether this was inferred or explicitly added
  source: 'user' | 'inferred';
  // Whether user has confirmed this item
  confirmed: boolean;
  // Last time this item was used/confirmed
  lastUsed?: string;
  createdAt: string;
}

export type PantryCategory =
  | 'produce'
  | 'dairy'
  | 'meat'
  | 'poultry'
  | 'seafood'
  | 'grains'
  | 'spices'
  | 'oils'
  | 'canned'
  | 'frozen'
  | 'baking'
  | 'beverages'
  | 'other';

export interface Appliance {
  id: string;
  name: string;
  type: ApplianceType;
  // Whether user has confirmed they have this
  confirmed: boolean;
  createdAt: string;
}

export type ApplianceType =
  | 'air-fryer'
  | 'instant-pot'
  | 'blender'
  | 'food-processor'
  | 'stand-mixer'
  | 'slow-cooker'
  | 'rice-cooker'
  | 'pressure-cooker'
  | 'oven'
  | 'stovetop'
  | 'microwave'
  | 'grill';

export interface ExtendedUserProfile {
  // Basic info (from auth)
  id: string;
  email: string;
  locale: string;
  createdAt: string;
  
  // Extended profile data
  preferences: UserPreferences;
  allergies: Allergy[];
  pantry: PantryItem[];
  appliances: Appliance[];
  
  // Metadata
  updatedAt: string;
}
