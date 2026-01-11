# Data Schemas - Nori (SousChef) MVP

This document defines the core data structures used throughout the application.

## User Profile Schema

### ExtendedUserProfile
The complete user profile extending the basic auth profile.

```typescript
interface ExtendedUserProfile {
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
```

### UserPreferences
Dietary preferences and cooking preferences (soft filters - suggest substitutions).

```typescript
interface UserPreferences {
  dietaryRestrictions: DietaryPreference[];
  preferredCuisines: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  maxCookingTime?: number; // in minutes
}
```

**Dietary Preferences:**
- `vegetarian`, `vegan`, `dairy-free`, `gluten-free`
- `low-carb`, `keto`, `paleo`, `pescatarian`

### Allergy
Hard filters - allergens that must be completely avoided.

```typescript
interface Allergy {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  createdAt: string;
}
```

### PantryItem
Items in the user's pantry, with inference tracking.

```typescript
interface PantryItem {
  id: string;
  name: string;
  category: PantryCategory;
  source: 'user' | 'inferred'; // How this item was added
  confirmed: boolean; // Whether user confirmed this item
  lastUsed?: string;
  createdAt: string;
}
```

**Pantry Categories:**
- `produce`, `dairy`, `meat`, `poultry`, `seafood`
- `grains`, `spices`, `oils`, `canned`, `frozen`
- `baking`, `beverages`, `other`

### Appliance
Cooking appliances available to the user.

```typescript
interface Appliance {
  id: string;
  name: string;
  type: ApplianceType;
  confirmed: boolean; // Whether user confirmed they have this
  createdAt: string;
}
```

**Appliance Types:**
- `air-fryer`, `instant-pot`, `blender`, `food-processor`
- `stand-mixer`, `slow-cooker`, `rice-cooker`, `pressure-cooker`
- `oven`, `stovetop`, `microwave`, `grill`

## Recipe Schema

### Recipe
Complete recipe structure returned by Nori.

```typescript
interface Recipe {
  id: string;
  title: string;
  description?: string;
  
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  
  prepTime?: number; // in minutes
  cookTime?: number; // in minutes
  totalTime?: number; // in minutes
  servings?: number;
  
  dietaryTags: DietaryPreference[];
  allergens: string[]; // List of allergens present
  
  source?: RecipeSource;
  createdAt: string;
  queryContext?: string; // Original user query
}
```

### RecipeIngredient
Individual ingredient with amount and optional substitution info.

```typescript
interface RecipeIngredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  notes?: string; // e.g., "chopped", "diced"
  isSubstitution?: boolean;
  originalIngredient?: string;
}
```

### RecipeStep
Step-by-step cooking instruction.

```typescript
interface RecipeStep {
  id: string;
  order: number;
  instruction: string;
  duration?: number; // in minutes
  temperature?: number;
  notes?: string;
}
```

### RecipeSource
Attribution for recipe source.

```typescript
interface RecipeSource {
  type: 'generated' | 'adapted' | 'inspired';
  attribution?: string;
  url?: string;
}
```

## Saved Recipe Schema

### SavedRecipe
Recipe saved by the user with additional metadata.

```typescript
interface SavedRecipe {
  id: string;
  userId: string;
  recipe: Recipe;
  savedAt: string;
  notes?: string;
  tags?: string[];
  cooked: boolean;
  cookedAt?: string;
  rating?: number; // 1-5 stars
}
```

## Storage Services

### User Data Service (`userDataService.ts`)
- `getUserProfile(userId)` - Get extended user profile
- `saveUserProfile(profile)` - Save/update profile
- `initializeUserProfile(userId, email, locale)` - Create new profile
- `updatePreferences(userId, preferences)` - Update preferences
- `saveAllergy(userId, allergy)` - Add/update allergy
- `removeAllergy(userId, allergyId)` - Remove allergy
- `savePantryItem(userId, item)` - Add/update pantry item
- `confirmPantryItem(userId, itemId, confirmed)` - Confirm/deny inferred item
- `removePantryItem(userId, itemId)` - Remove pantry item
- `saveAppliance(userId, appliance)` - Add/update appliance
- `confirmAppliance(userId, applianceId, confirmed)` - Confirm/deny inferred appliance
- `removeAppliance(userId, applianceId)` - Remove appliance

### Recipe Service (`recipeService.ts`)
- `getSavedRecipes(userId)` - Get all saved recipes
- `saveRecipe(userId, recipe, notes?, tags?)` - Save a recipe
- `removeSavedRecipe(userId, savedRecipeId)` - Remove saved recipe
- `updateSavedRecipe(userId, savedRecipeId, updates)` - Update saved recipe metadata
- `isRecipeSaved(userId, recipeId)` - Check if recipe is saved
- `getSavedRecipeByRecipeId(userId, recipeId)` - Get saved recipe by recipe ID

## Storage Implementation

- **User Profile Data**: Stored in AsyncStorage (key: `user_extended_profile_{userId}`)
- **Saved Recipes**: Stored in AsyncStorage (key: `saved_recipes_{userId}`)
- **Auth Tokens**: Stored in SecureStore (encrypted)

## API Readiness

These schemas and services are designed to be easily migrated to a backend API. The service layer abstracts the storage implementation, so switching to API calls will only require updating the service functions.

## Future Enhancements

- Add image URLs for recipes
- Add nutrition information
- Add recipe difficulty rating
- Add cooking method tags
- Add cuisine type tags
- Add meal type (breakfast, lunch, dinner, snack)
