/**
 * Chat View Component
 * Main chat interface displaying messages and recipe cards
 */

import React, { useRef, useEffect } from "react"
import { ScrollView, View, Text, StyleSheet } from "react-native"
import { ChatMessage as ChatMessageType } from "../types/chat"
import ChatMessage from "./ChatMessage"
import RecipeCard from "./RecipeCard"
import LoadingIndicator from "./LoadingIndicator"
import { useTranslation } from "../i18n/useTranslation"

interface ChatViewProps {
	messages: ChatMessageType[]
	isLoading?: boolean
	onRecipePress?: (recipeId: string) => void
}

export default function ChatView({ messages, isLoading = false, onRecipePress }: ChatViewProps) {
	const scrollViewRef = useRef<ScrollView>(null)
	const { t } = useTranslation()

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		if (scrollViewRef.current) {
			setTimeout(() => {
				scrollViewRef.current?.scrollToEnd({ animated: true })
			}, 100)
		}
	}, [messages, isLoading])

	return (
		<ScrollView ref={scrollViewRef} style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
			{messages.length === 0 && (
				<View style={styles.emptyState}>
					<View style={styles.emptyBubble}>
						<Text style={styles.emptyText}>{t.chat.emptyState}</Text>
					</View>
				</View>
			)}

			{messages.map((message) => (
				<View key={message.id}>
					{message.text && <ChatMessage message={message} />}
					{/* Only show recipe cards if recipes exist and have valid content */}
					{message.recipes && Array.isArray(message.recipes) && message.recipes.length > 0 && message.recipes.some((r) => r && r.title && r.title.trim().length > 0) && (
						<View style={styles.recipesContainer}>
							{message.recipes
								.filter((recipe) => recipe && recipe.title && recipe.title.trim().length > 0) // Filter out any invalid recipes
								.map((recipe) => (
									<RecipeCard key={recipe.id} recipe={recipe} onPress={() => onRecipePress?.(recipe.id)} />
								))}
						</View>
					)}
				</View>
			))}

			{isLoading && <LoadingIndicator />}
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	content: {
		paddingVertical: 8,
	},
	emptyState: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 32,
		paddingVertical: 48,
	},
	emptyBubble: {
		backgroundColor: "#f0f0f0",
		padding: 20,
		borderRadius: 18,
		borderBottomLeftRadius: 4,
		maxWidth: "80%",
	},
	emptyText: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
		lineHeight: 24,
	},
	recipesContainer: {
		marginVertical: 8,
	},
})
