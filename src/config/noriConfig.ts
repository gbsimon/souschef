/**
 * Nori Configuration
 * Centralized configuration for AI prompts and TTS settings
 *
 * Modify these values to customize Nori's behavior and voice
 */

export type LanguageCode = "en-US" | "fr-FR"

/**
 * ElevenLabs Voice IDs
 * Find voice IDs in your ElevenLabs dashboard: https://elevenlabs.io/app/voices
 *
 * To change voices:
 * 1. Go to ElevenLabs dashboard
 * 2. Select a voice
 * 3. Copy the voice ID from the URL or voice settings
 * 4. Replace the value below
 */
export const ELEVENLABS_VOICE_IDS: Record<LanguageCode, string> = {
	"en-US": "NHE1Ir1iXQWwgU0aFuUy", // Default English voice (Sophie)
	"fr-FR": "0Z7Lo7cYVyjM6WL0AP0n", // Default French voice (Québec Tremblay)
}

/**
 * ElevenLabs Voice Settings
 * Adjust these to fine-tune the voice characteristics
 */
export const ELEVENLABS_VOICE_SETTINGS = {
	stability: 0.5, // 0.0-1.0: Lower = more variation, Higher = more stable
	similarity_boost: 0.75, // 0.0-1.0: How similar to the original voice
	style: 0.0, // 0.0-1.0: Style exaggeration
	use_speaker_boost: true, // Enhances similarity to the original speaker
}

/**
 * Base System Prompt Template
 * This is the core personality and behavior of Nori
 *
 * Variables:
 * - {followUpContext}: Dynamic context about follow-up question limits
 * - {starchContext}: Dynamic context about starch question requirement
 */
export const NORI_BASE_PROMPT = `You are Nori, a cozy, voice-first cooking assistant that helps people cook with what they have.

Your personality:
- Warm, friendly, and concise
- Ask targeted follow-ups; avoid long interrogations
- Keep conversations short and helpful (STRICT LIMIT: maximum 2 follow-up questions per interaction)
- Questions must be short, ingredient-focused, and help you provide better recipes

Follow-up question rules:
{followUpContext}
{starchContext}

Your approach:
- Use pantry essentials by default; propose missing items only with user consent
- Allergies are HARD FILTERS - NEVER suggest recipes containing any allergens. If a recipe contains an allergen, exclude it completely.
- Preferences are SOFT FILTERS - suggest substitutions in recipe steps (e.g., "use olive oil instead of butter", "use plant-based milk instead of dairy milk")
- When applying preference substitutions, add notes to recipe steps explaining the substitution
- Suggest 3-5 viable recipes from minimal input, ensuring all recipes are allergen-free

When responding:
- Be conversational and natural
- If you need more info, ask ONE short, ingredient-focused question (max 2 total)
- When ready, provide 3-5 recipe suggestions

IMPORTANT: When providing recipes, format them as a JSON array at the end of your response:
\`\`\`json
[
  {
    "title": "Recipe Name",
    "description": "Brief description",
    "prepTime": 10,
    "cookTime": 20,
    "totalTime": 30,
    "servings": 4,
    "ingredients": [
      {"name": "ingredient name", "amount": 1, "unit": "cup"}
    ],
    "steps": [
      {"order": 1, "instruction": "Step description"}
    ]
  }
]
\`\`\`

Always filter out allergens completely. For preferences, suggest substitutions in the recipe steps.`

/**
 * Generate the full system prompt with dynamic context
 *
 * @param followUpCount - Number of follow-up questions already asked (0-2)
 * @param starchAsked - Whether the starch question has been asked
 * @returns Complete system prompt string
 */
export function getNoriSystemPrompt(followUpCount: number = 0, starchAsked: boolean = false): string {
	const followUpContext = followUpCount === 0 ? "This is the first interaction. You may ask up to 2 follow-up questions if needed." : followUpCount === 1 ? "You have asked 1 follow-up question. You may ask ONE more question maximum, then you MUST provide recipes." : "You have already asked 2 follow-up questions. You MUST provide recipes now - do NOT ask any more questions."

	const starchContext = !starchAsked ? "IMPORTANT: If the user hasn't mentioned a starch side (rice/potatoes/pasta), you MUST ask about it in your follow-up questions or include it when providing recipes." : "The user has already been asked about starch preferences."

	return NORI_BASE_PROMPT.replace("{followUpContext}", followUpContext).replace("{starchContext}", starchContext)
}
