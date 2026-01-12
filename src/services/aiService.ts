/**
 * AI Orchestration Service
 * Handles OpenAI API calls, tool calling, and recipe generation
 */

import { Recipe, RecipeIngredient, RecipeStep } from "../types/recipe"
import * as userDataService from "./userDataService"
import env from "../config/env"

/**
 * System prompt for Nori
 * Aligned with PRD: warm, friendly, concise, asks max 2 follow-up questions
 */
function getNoriSystemPrompt(followUpCount: number = 0, starchAsked: boolean = false): string {
	const followUpContext = followUpCount === 0 ? "This is the first interaction. You may ask up to 2 follow-up questions if needed." : followUpCount === 1 ? "You have asked 1 follow-up question. You may ask ONE more question maximum, then you MUST provide recipes." : "You have already asked 2 follow-up questions. You MUST provide recipes now - do NOT ask any more questions."

	const starchContext = !starchAsked ? "IMPORTANT: If the user hasn't mentioned a starch side (rice/potatoes/pasta), you MUST ask about it in your follow-up questions or include it when providing recipes." : "The user has already been asked about starch preferences."

	return `You are Nori, a cozy, voice-first cooking assistant that helps people cook with what they have.

Your personality:
- Warm, friendly, and concise
- Ask targeted follow-ups; avoid long interrogations
- Keep conversations short and helpful (STRICT LIMIT: maximum 2 follow-up questions per interaction)
- Questions must be short, ingredient-focused, and help you provide better recipes

Follow-up question rules:
${followUpContext}
${starchContext}

Your approach:
- Use pantry essentials by default; propose missing items only with user consent
- Allergies are hard filters - NEVER suggest recipes with allergens
- Preferences can suggest substitutions (e.g., "use olive oil instead of butter")
- Suggest 3-5 viable recipes from minimal input

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
}

/**
 * Tool definitions for OpenAI function calling
 */
export const AI_TOOLS = [
	{
		type: "function" as const,
		function: {
			name: "get_pantry",
			description: "Get the user's pantry items (confirmed items only)",
			parameters: {
				type: "object",
				properties: {},
			},
		},
	},
	{
		type: "function" as const,
		function: {
			name: "get_preferences",
			description: "Get the user's dietary preferences and allergies",
			parameters: {
				type: "object",
				properties: {},
			},
		},
	},
	{
		type: "function" as const,
		function: {
			name: "update_pantry",
			description: "Add or update pantry items (for inferred items from conversation)",
			parameters: {
				type: "object",
				properties: {
					items: {
						type: "array",
						items: {
							type: "object",
							properties: {
								name: { type: "string", description: "Name of the pantry item" },
								category: {
									type: "string",
									enum: ["produce", "dairy", "meat", "poultry", "seafood", "grains", "spices", "oils", "canned", "frozen", "baking", "beverages", "other"],
									description: "Category of the pantry item",
								},
							},
							required: ["name", "category"],
						},
						description: "List of pantry items to add or update",
					},
				},
				required: ["items"],
			},
		},
	},
]

/**
 * Tool call handlers
 */
async function handleToolCall(toolName: string, args: any, userId: string): Promise<any> {
	switch (toolName) {
		case "get_pantry": {
			const profile = await userDataService.getUserProfile(userId)
			if (!profile) {
				return { pantry: [] }
			}
			// Return only confirmed pantry items
			const confirmedPantry = profile.pantry
				.filter((item) => item.confirmed)
				.map((item) => ({
					name: item.name,
					category: item.category,
				}))
			return { pantry: confirmedPantry }
		}

		case "get_preferences": {
			const profile = await userDataService.getUserProfile(userId)
			if (!profile) {
				return {
					preferences: { dietaryRestrictions: [], preferredCuisines: [], skillLevel: "intermediate" },
					allergies: [],
				}
			}
			return {
				preferences: profile.preferences,
				allergies: profile.allergies.map((a) => ({ name: a.name, severity: a.severity })),
			}
		}

		case "update_pantry": {
			const { items } = args
			if (!items || !Array.isArray(items)) {
				return { success: false, error: "Invalid items array" }
			}

			// Add inferred pantry items
			for (const item of items) {
				await userDataService.savePantryItem(userId, {
					name: item.name,
					category: item.category,
					source: "inferred",
					confirmed: false, // User will need to confirm
				})
			}

			return { success: true, itemsAdded: items.length }
		}

		default:
			return { error: `Unknown tool: ${toolName}` }
	}
}

/**
 * Clean text response by removing JSON code blocks
 * Users should only see natural language, not raw JSON
 */
function cleanTextResponse(content: string): string {
	if (!content) return ""

	// Remove JSON code blocks (```json ... ```)
	let cleaned = content.replace(/```json\n?[\s\S]*?\n?```/g, "")

	// Remove any remaining code blocks
	cleaned = cleaned.replace(/```[\s\S]*?```/g, "")

	// Remove standalone JSON objects/arrays if they appear
	// But be careful not to remove too much - only if it's clearly a JSON block
	cleaned = cleaned.replace(/^\s*\{[\s\S]*\}\s*$/gm, "")
	cleaned = cleaned.replace(/^\s*\[[\s\S]*\]\s*$/gm, "")

	// Clean up extra whitespace
	cleaned = cleaned.trim()

	// If we removed everything, return a friendly message
	if (!cleaned || cleaned.length === 0) {
		return "Here are some great recipe suggestions for you!"
	}

	return cleaned
}

/**
 * Parse recipe from AI response
 * Extracts structured recipe data from OpenAI's response
 */
function parseRecipeResponse(content: string): Recipe[] {
	if (!content || content.trim().length === 0) {
		return []
	}

	try {
		// Try to parse JSON if the response is structured
		// OpenAI might return JSON or markdown-formatted recipes
		const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/)
		if (jsonMatch) {
			try {
				const recipes = JSON.parse(jsonMatch[1])
				if (Array.isArray(recipes) && recipes.length > 0) {
					return recipes.map((r, idx) => normalizeRecipe(r, idx))
				}
			} catch (e) {
				// JSON in code block is invalid, continue to other parsing methods
				console.warn("[AI Service] Failed to parse JSON from code block:", e)
			}
		}

		// Try to find JSON object or array at the start/end of content
		const trimmedContent = content.trim()
		if (trimmedContent.startsWith("{") || trimmedContent.startsWith("[")) {
			try {
				const directJson = JSON.parse(trimmedContent)
				if (Array.isArray(directJson) && directJson.length > 0) {
					return directJson.map((r: any, idx: number) => normalizeRecipe(r, idx))
				}
				if (typeof directJson === "object" && directJson.recipes && Array.isArray(directJson.recipes)) {
					return directJson.recipes.map((r: any, idx: number) => normalizeRecipe(r, idx))
				}
			} catch (e) {
				// Not valid JSON, continue to text parsing
				console.warn("[AI Service] Content starts with {/[ but is not valid JSON:", e)
			}
		}

		// Try to find JSON anywhere in the content
		const jsonPattern = /\{[\s\S]*"recipes"[\s\S]*\[[\s\S]*\]/g
		const jsonMatches = content.match(jsonPattern)
		if (jsonMatches) {
			for (const match of jsonMatches) {
				try {
					const parsed = JSON.parse(match)
					if (parsed.recipes && Array.isArray(parsed.recipes) && parsed.recipes.length > 0) {
						return parsed.recipes.map((r: any, idx: number) => normalizeRecipe(r, idx))
					}
				} catch (e) {
					// Continue trying other matches
				}
			}
		}

		// Fallback: parse markdown or text format
		// OpenAI often returns text responses, so we'll extract what we can
		return parseTextRecipes(content)
	} catch (error) {
		console.error("[AI Service] Error parsing recipe response:", error)
		// Fallback to text parsing - don't throw, just return empty or parsed text
		return parseTextRecipes(content)
	}
}

/**
 * Normalize recipe object to our Recipe type
 */
function normalizeRecipe(recipe: any, index: number): Recipe {
	return {
		id: recipe.id || `recipe_${Date.now()}_${index}`,
		title: recipe.title || recipe.name || "Untitled Recipe",
		description: recipe.description || recipe.summary,
		ingredients: (recipe.ingredients || []).map((ing: any, idx: number) => ({
			id: ing.id || `ing_${index}_${idx}`,
			name: ing.name || ing.ingredient || String(ing),
			amount: ing.amount || 1,
			unit: ing.unit || "",
			notes: ing.notes,
			isSubstitution: ing.isSubstitution || false,
			originalIngredient: ing.originalIngredient,
		})) as RecipeIngredient[],
		steps: (recipe.steps || recipe.instructions || []).map((step: any, idx: number) => ({
			id: step.id || `step_${index}_${idx}`,
			order: step.order || idx + 1,
			instruction: typeof step === "string" ? step : step.instruction || step.text,
			duration: step.duration,
			temperature: step.temperature,
			notes: step.notes,
		})) as RecipeStep[],
		prepTime: recipe.prepTime || recipe.prep_time,
		cookTime: recipe.cookTime || recipe.cook_time,
		totalTime: recipe.totalTime || recipe.total_time || (recipe.prepTime || 0) + (recipe.cookTime || 0),
		servings: recipe.servings || recipe.serves || 4,
		dietaryTags: recipe.dietaryTags || recipe.dietary_tags || [],
		allergens: recipe.allergens || [],
		source: recipe.source || { type: "generated" },
		createdAt: new Date().toISOString(),
	}
}

/**
 * Fallback parser for text/markdown recipes
 * Extracts recipe information from text responses when JSON parsing fails
 */
function parseTextRecipes(content: string): Recipe[] {
	// If content is empty or just whitespace, return empty array
	if (!content || content.trim().length === 0) {
		return []
	}

	// Try to extract recipe titles from markdown headers or numbered lists
	const recipes: Recipe[] = []

	// Pattern 1: Markdown headers (## Recipe Name)
	const headerPattern = /^##+\s+(.+)$/gm
	const headers = Array.from(content.matchAll(headerPattern))

	// Pattern 2: Numbered list items (1. Recipe Name, 2. Recipe Name)
	const numberedPattern = /^\d+\.\s+(.+)$/gm
	const numbered = Array.from(content.matchAll(numberedPattern))

	// Pattern 3: Bullet points with recipe-like names
	const bulletPattern = /^[-*]\s+(.+)$/gm
	const bullets = Array.from(content.matchAll(bulletPattern))

	// Combine all potential recipe titles
	const allTitles = [...headers.map((m) => m[1]), ...numbered.map((m) => m[1]), ...bullets.map((m) => m[1])].filter((title) => {
		// Filter out common non-recipe patterns
		const lower = title.toLowerCase()
		return !lower.includes("ingredients") && !lower.includes("instructions") && !lower.includes("steps") && title.length > 3 && title.length < 100
	})

	// Create recipe objects from extracted titles
	if (allTitles.length > 0) {
		// Take up to 5 recipes
		const titles = allTitles.slice(0, 5)
		titles.forEach((title, idx) => {
			recipes.push({
				id: `recipe_${Date.now()}_${idx}`,
				title: title.trim(),
				description: `Recipe suggestion: ${title}`,
				ingredients: [],
				steps: [],
				dietaryTags: [],
				allergens: [],
				source: { type: "generated" },
				createdAt: new Date().toISOString(),
			})
		})
	}

	// If no recipes found, create a single placeholder recipe with the response text
	if (recipes.length === 0) {
		recipes.push({
			id: `recipe_${Date.now()}`,
			title: "Recipe Suggestions",
			description: content.substring(0, 500), // Show first 500 chars
			ingredients: [],
			steps: [],
			dietaryTags: [],
			allergens: [],
			source: { type: "generated" },
			createdAt: new Date().toISOString(),
		})
	}

	return recipes
}

/**
 * Count follow-up questions in conversation history
 * Returns: { count: number, starchAsked: boolean }
 */
function analyzeConversation(conversationHistory: Array<{ role: "user" | "assistant"; content: string }>): {
	followUpCount: number
	starchAsked: boolean
} {
	let followUpCount = 0
	let starchAsked = false

	// Count assistant messages that are questions (not recipe responses)
	for (let i = 0; i < conversationHistory.length; i++) {
		const msg = conversationHistory[i]
		if (msg.role === "assistant") {
			const content = msg.content.toLowerCase()

			// Check if this is a question (ends with ? or contains question words)
			const isQuestion = content.includes("?") || /\b(what|which|do you|would you|can you|have you|do you have|are you|is there)\b/.test(content)

			// Check if recipes are present (indicates this is a response, not a question)
			const hasRecipes = content.includes("recipe") || content.includes("```json") || content.includes("ingredients") || /\d+\s*(min|minute|hour|h)/.test(content) // time indicators

			if (isQuestion && !hasRecipes) {
				followUpCount++
			}

			// Check if starch question was asked
			if (content.includes("starch") || content.includes("rice") || content.includes("potato") || content.includes("pasta") || /\b(what.*side|side.*dish|starch.*side)\b/i.test(content)) {
				starchAsked = true
			}
		}
	}

	return { followUpCount, starchAsked }
}

/**
 * Call OpenAI API with tool calling
 */
export async function callAIWithTools(
	userMessage: string,
	userId: string,
	language: string = "en-US",
	conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = []
): Promise<{
	text: string
	recipes?: Recipe[]
	toolCalls?: Array<{ name: string; result: any }>
	isFollowUpQuestion?: boolean
}> {
	try {
		const profile = await userDataService.getUserProfile(userId)

		// Analyze conversation to count follow-ups and check starch question
		const { followUpCount, starchAsked } = analyzeConversation(conversationHistory)

		// Build conversation messages with dynamic system prompt
		const messages: any[] = [
			{
				role: "system",
				content:
					getNoriSystemPrompt(followUpCount, starchAsked) +
					(profile
						? `\n\nUser context: ${JSON.stringify({
								allergies: profile.allergies.map((a) => a.name),
								dietaryRestrictions: profile.preferences.dietaryRestrictions,
						  })}`
						: ""),
			},
			...conversationHistory.map((msg) => ({
				role: msg.role,
				content: msg.content,
			})),
			{
				role: "user",
				content: userMessage,
			},
		]

		// Use fetch directly for React Native compatibility
		const apiKey = env.openaiApiKey || process.env.EXPO_PUBLIC_OPENAI_API_KEY
		if (!apiKey) {
			throw new Error("OpenAI API key not configured. Set EXPO_PUBLIC_OPENAI_API_KEY in your environment.")
		}

		const response = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				model: "gpt-4o-mini", // Using mini for cost efficiency, can upgrade to gpt-4o if needed
				messages,
				tools: AI_TOOLS,
				tool_choice: "auto",
				temperature: 0.7,
			}),
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.error?.message || "OpenAI API error")
		}

		const data = await response.json()
		const assistantMessage = data.choices[0].message

		// Handle tool calls
		const toolCalls: Array<{ name: string; result: any }> = []
		if (assistantMessage.tool_calls) {
			for (const toolCall of assistantMessage.tool_calls) {
				const result = await handleToolCall(toolCall.function.name, JSON.parse(toolCall.function.arguments), userId)
				toolCalls.push({
					name: toolCall.function.name,
					result,
				})
			}

			// If there were tool calls, make a follow-up request with tool results
			const followUpMessages = [
				...messages,
				assistantMessage,
				...assistantMessage.tool_calls.map((tc: any) => ({
					role: "tool" as const,
					tool_call_id: tc.id,
					content: JSON.stringify(toolCalls.find((t) => t.name === tc.function.name)?.result || {}),
				})),
			]

			const followUpResponse = await fetch("https://api.openai.com/v1/chat/completions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${apiKey}`,
				},
				body: JSON.stringify({
					model: "gpt-4o-mini",
					messages: followUpMessages,
					temperature: 0.7,
				}),
			})

			const followUpData = await followUpResponse.json()
			const finalMessage = followUpData.choices[0].message.content

			// Parse recipes from response (before cleaning)
			const recipes = parseRecipeResponse(finalMessage)

			// Clean text response - remove JSON code blocks for user display
			const cleanedText = cleanTextResponse(finalMessage)

			// Detect if this is a follow-up question (no recipes, ends with ?)
			const isFollowUpQuestion = recipes.length === 0 && (cleanedText.includes("?") || cleanedText.trim().endsWith("?"))

			return {
				text: cleanedText,
				recipes,
				toolCalls,
				isFollowUpQuestion,
			}
		}

		// No tool calls, just return the response
		const content = assistantMessage.content || ""

		// Parse recipes from response (before cleaning)
		const recipes = parseRecipeResponse(content)

		// Clean text response - remove JSON code blocks for user display
		const cleanedText = cleanTextResponse(content)

		// Detect if this is a follow-up question (no recipes, ends with ?)
		const isFollowUpQuestion = recipes.length === 0 && (cleanedText.includes("?") || cleanedText.trim().endsWith("?"))

		// If we've reached the limit and AI still asks a question, log a warning
		// The system prompt should prevent this, but we log it for monitoring
		if (isFollowUpQuestion && followUpCount >= 2) {
			console.warn("[AI Service] Follow-up limit reached but AI still asked a question. System prompt should prevent this.")
		}

		return {
			text: cleanedText,
			recipes,
			toolCalls,
			isFollowUpQuestion,
		}
	} catch (error) {
		console.error("[AI Service] Error calling OpenAI:", error)
		throw error
	}
}

/**
 * Check if AI service is configured
 */
export function isAIServiceConfigured(): boolean {
	const apiKey = env.openaiApiKey || process.env.EXPO_PUBLIC_OPENAI_API_KEY
	return !!apiKey
}
