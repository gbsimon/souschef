# UX Flow - Nori (SousChef) v0

## Goal
Define the end-to-end user experience for the MVP, including screens, transitions, and key states.

## Primary Flow (Happy Path)
1) Onboarding (conversational)
   - User creates account, then completes a guided chat with Nori.
   - Nori asks about allergies, preferences, and pantry essentials in dialogue.
   - User confirms or denies suggested pantry items during the chat.
2) Home / Ask
   - User taps mic or types ingredients.
3) Follow-up
   - Nori asks only the questions needed to provide a good answer, including a starch option (rice/potatoes/pasta).
4) Results
   - Nori returns 3-5 recipe cards.
5) Recipe Detail
   - Full ingredients and steps, with Save button.
6) Pantry & Preferences
   - User reviews inferred items and updates settings.

## Screens
- Welcome / Sign Up
- Login
- Onboarding Chat (allergies, intolerances, dislikes, pantry essentials)
- Home / Ask
- Follow-up Question (inline within chat)
- Results (recipe cards in chat)
- Recipe Detail
- Saved Recipes
- Pantry & Appliances (settings)
- Preferences (settings)

## Navigation
- Stack: Welcome -> Sign Up/Login -> Onboarding Chat
- Tabs (or bottom nav): Ask, Saved, Settings
- Recipe Detail opens from a card (modal or push).

## Key States
- Loading: show "Nori is thinking" indicator.
- Empty: if no recipes match, ask for one more ingredient or offer a simple fallback.
- Enhancement: even when recipes match, Nori may ask about a starch side (rice/potatoes/pasta) or other missing complements to improve the meal.
- Error: speech input failure -> switch to text input with a short prompt.

## UX Copy Guidelines
- Tone: warm, friendly, concise.
- Follow-ups: short, ingredient-focused, and only as many as needed to provide a good answer.
- Allergy handling: avoid allergens completely; preferences can suggest substitutions.

## Acceptance Criteria
- Flow covers onboarding, query, follow-ups, results, recipe detail, and pantry management.
- Follow-up questions are limited to what is necessary to produce a good recipe response.
- Starch side question is always included.
