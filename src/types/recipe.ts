/**
 * Recipe Data Schema
 * Defines the structure for recipes returned by Nori
 */

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  
  // Ingredients
  ingredients: RecipeIngredient[];
  
  // Cooking instructions
  steps: RecipeStep[];
  
  // Timing information
  prepTime?: number; // in minutes
  cookTime?: number; // in minutes
  totalTime?: number; // in minutes
  
  // Serving information
  servings?: number;
  
  // Dietary information
  dietaryTags: DietaryPreference[];
  allergens: string[]; // List of allergens present
  
  // Source attribution (if available)
  source?: RecipeSource;
  
  // Metadata
  createdAt: string;
  // If this was generated from a user query
  queryContext?: string;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  // Optional notes (e.g., "chopped", "diced")
  notes?: string;
  // If this is a substitution based on preferences
  isSubstitution?: boolean;
  originalIngredient?: string;
}

export interface RecipeStep {
  id: string;
  order: number;
  instruction: string;
  // Optional timing for this step
  duration?: number; // in minutes
  // Optional temperature if applicable
  temperature?: number; // in Fahrenheit or Celsius
  // Optional notes or tips
  notes?: string;
}

export interface RecipeSource {
  type: 'generated' | 'adapted' | 'inspired';
  // If adapted or inspired, include attribution
  attribution?: string;
  url?: string;
}

// For displaying recipe cards in lists
export interface RecipeCard {
  id: string;
  title: string;
  description?: string;
  totalTime?: number;
  servings?: number;
  dietaryTags: DietaryPreference[];
  // Preview image URL (future enhancement)
  imageUrl?: string;
}

// Re-export for convenience
export type { DietaryPreference } from './user';
