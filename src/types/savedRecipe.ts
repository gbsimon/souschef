/**
 * Saved Recipe Schema
 * Represents a recipe saved by the user
 */

import { Recipe } from './recipe';

export interface SavedRecipe {
  id: string;
  userId: string;
  recipe: Recipe;
  // When the user saved it
  savedAt: string;
  // Optional notes the user added
  notes?: string;
  // Optional tags for organization
  tags?: string[];
  // Whether user has cooked this recipe
  cooked: boolean;
  cookedAt?: string;
  // User's rating (1-5 stars)
  rating?: number;
}
