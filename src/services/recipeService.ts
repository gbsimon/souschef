/**
 * Recipe Service
 * Handles storage and retrieval of saved recipes
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../types/recipe';
import { SavedRecipe } from '../types/savedRecipe';

const SAVED_RECIPES_KEY = 'saved_recipes';

/**
 * Get all saved recipes for a user
 */
export async function getSavedRecipes(userId: string): Promise<SavedRecipe[]> {
  try {
    const recipesJson = await AsyncStorage.getItem(`${SAVED_RECIPES_KEY}_${userId}`);
    if (recipesJson) {
      return JSON.parse(recipesJson) as SavedRecipe[];
    }
    return [];
  } catch (error) {
    console.error('Error getting saved recipes:', error);
    return [];
  }
}

/**
 * Save a recipe
 */
export async function saveRecipe(
  userId: string,
  recipe: Recipe,
  notes?: string,
  tags?: string[]
): Promise<SavedRecipe> {
  const savedRecipe: SavedRecipe = {
    id: `saved_${Date.now()}`,
    userId,
    recipe,
    savedAt: new Date().toISOString(),
    notes,
    tags,
    cooked: false,
  };

  const recipes = await getSavedRecipes(userId);
  recipes.push(savedRecipe);

  await AsyncStorage.setItem(
    `${SAVED_RECIPES_KEY}_${userId}`,
    JSON.stringify(recipes)
  );

  return savedRecipe;
}

/**
 * Remove a saved recipe
 */
export async function removeSavedRecipe(
  userId: string,
  savedRecipeId: string
): Promise<void> {
  const recipes = await getSavedRecipes(userId);
  const filtered = recipes.filter(r => r.id !== savedRecipeId);

  await AsyncStorage.setItem(
    `${SAVED_RECIPES_KEY}_${userId}`,
    JSON.stringify(filtered)
  );
}

/**
 * Update a saved recipe (notes, tags, cooked status, rating)
 */
export async function updateSavedRecipe(
  userId: string,
  savedRecipeId: string,
  updates: Partial<Pick<SavedRecipe, 'notes' | 'tags' | 'cooked' | 'cookedAt' | 'rating'>>
): Promise<SavedRecipe> {
  const recipes = await getSavedRecipes(userId);
  const recipe = recipes.find(r => r.id === savedRecipeId);

  if (!recipe) {
    throw new Error('Saved recipe not found');
  }

  Object.assign(recipe, updates);
  if (updates.cooked && !recipe.cookedAt) {
    recipe.cookedAt = new Date().toISOString();
  }

  await AsyncStorage.setItem(
    `${SAVED_RECIPES_KEY}_${userId}`,
    JSON.stringify(recipes)
  );

  return recipe;
}

/**
 * Check if a recipe is saved
 */
export async function isRecipeSaved(
  userId: string,
  recipeId: string
): Promise<boolean> {
  const recipes = await getSavedRecipes(userId);
  return recipes.some(r => r.recipe.id === recipeId);
}

/**
 * Get a saved recipe by recipe ID
 */
export async function getSavedRecipeByRecipeId(
  userId: string,
  recipeId: string
): Promise<SavedRecipe | null> {
  const recipes = await getSavedRecipes(userId);
  return recipes.find(r => r.recipe.id === recipeId) || null;
}
