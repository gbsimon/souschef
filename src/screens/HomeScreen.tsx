import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, Keyboard, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNativeSpeechRecognition, LanguageCode } from "../hooks/useNativeSpeechRecognition"
import VoiceInputButton from "../components/VoiceInputButton"
import LanguageSelector from "../components/LanguageSelector"
import ChatView from "../components/ChatView"
import { useChat } from "../contexts/ChatContext"
import { useAuth } from "../contexts/AuthContext"
import { sendUserMessage } from "../services/messageService"
import { speak as speakTTS, stopSpeaking } from "../services/ttsService"
import { useTranslation } from "../i18n/useTranslation"
import { detectNoriMention, enhanceTranscriptWithNoriContext } from "../utils/noriDetection"

/**
 * Home/Ask Screen
 * Main screen where users interact with Nori via voice or text input
 * Uses native speech recognition for real-time transcription
 */
export default function HomeScreen() {
	const [textInput, setTextInput] = useState("")
	const [isSending, setIsSending] = useState(false)
	const [lastVoiceSource, setLastVoiceSource] = useState<"voice" | "text" | null>(null)
	const insets = useSafeAreaInsets()

	const { user } = useAuth()
	const { t, language, setLanguage: setAppLanguage } = useTranslation()
	const { messages, isLoading, addUserMessage, addNoriMessage, setLoading, clearMessages, getConversationHistory } = useChat()

	const { isAvailable, isListening, transcript, partialTranscript, error, startListening, stopListening, changeLanguage } = useNativeSpeechRecognition(language)

	const handleLanguageChange = (newLanguage: LanguageCode) => {
		// Stop any ongoing TTS when language changes
		stopSpeaking()
		setAppLanguage(newLanguage) // Update app-wide language (this will trigger re-render)
		changeLanguage(newLanguage)
	}

	// Cleanup: stop TTS when component unmounts
	useEffect(() => {
		return () => {
			stopSpeaking()
		}
	}, [])

	// Update text input when we get a final transcript (for editing before sending)
	// Note: Voice messages auto-send, but we still show transcript in input for visibility
	useEffect(() => {
		if (transcript && !isListening) {
			console.log("[STT] Final transcript received:", transcript)
			// Don't update text input for voice - it auto-sends
			// Only update if user wants to edit before sending (future enhancement)
		}
	}, [transcript, isListening])

	// Handle sending message (unified for both voice and text)
	const handleSendMessage = async (messageText?: string, sourceOverride?: "voice" | "text") => {
		const messageToSend = messageText || textInput.trim()

		if (!messageToSend || messageToSend.length === 0) {
			Alert.alert(t.alerts.emptyMessage, t.alerts.emptyMessage)
			return
		}

		if (!user) {
			Alert.alert(t.alerts.authRequired, t.alerts.authRequired)
			return
		}

		if (isSending || isLoading) {
			return // Prevent double-sending
		}

		try {
			setIsSending(true)
			Keyboard.dismiss()

			// Determine source: use override if provided, otherwise infer from context
			const source = sourceOverride || (messageText ? "voice" : "text")

			// Track if this was a voice interaction for TTS
			setLastVoiceSource(source)

			// Add user message to chat
			addUserMessage(messageToSend, source)

			// Set loading state
			setLoading(true)

			console.log("[HomeScreen] Sending message:", { messageToSend, source, language })

			// Get conversation history for AI context
			const conversationHistory = getConversationHistory()

			// Send message to AI service
			const response = await sendUserMessage(messageToSend, source, language, user.id, conversationHistory)

			if (response.success && response.aiResponse) {
				// Clear text input after successful send
				setTextInput("")
				console.log("[HomeScreen] AI response received:", {
					textLength: response.aiResponse.text.length,
					recipeCount: response.aiResponse.recipes?.length || 0,
				})

				// Add Nori's response to chat
				// Only include recipes if they exist, have content, and have valid titles
				setLoading(false)
				const recipesToAdd = response.aiResponse.recipes && Array.isArray(response.aiResponse.recipes) && response.aiResponse.recipes.length > 0 && response.aiResponse.recipes.some((r) => r && r.title && r.title.trim().length > 0) ? response.aiResponse.recipes.filter((r) => r && r.title && r.title.trim().length > 0) : undefined
				addNoriMessage(response.aiResponse.text, recipesToAdd)

				// Speak Nori's response if user used voice input (voice-first UX)
				// Speak both follow-up questions and recipe responses
				if (source === "voice" && response.aiResponse.text) {
					// Use setTimeout to ensure TTS happens after UI updates
					setTimeout(async () => {
						try {
							// Stop any current speech first
							stopSpeaking()

							// Small delay to ensure previous speech is stopped
							await new Promise((resolve) => setTimeout(resolve, 100))

							// Prepare text to speak - preserve the full conversational text
							let textToSpeak = response.aiResponse.text.trim()

							// If response includes recipes, append recipe titles to the natural language text
							if (response.aiResponse.recipes && response.aiResponse.recipes.length > 0) {
								// Extract natural language text (everything before any recipe-related phrases)
								// Remove common recipe introduction phrases that might be redundant
								const naturalText = textToSpeak
									.replace(/here are \d+ recipe suggestions?:?/gi, "")
									.replace(/recipe suggestions?:?/gi, "")
									.trim()

								// Get recipe titles
								const recipeTitles = response.aiResponse.recipes
									.slice(0, 3) // Limit to first 3 recipes
									.map((r) => r.title)
									.join(", ")

								// Combine: natural text + recipe titles
								// Only add recipe titles if we have meaningful natural text
								if (naturalText.length > 10) {
									textToSpeak = `${naturalText} ${recipeTitles}.`
								} else {
									// If natural text is too short, use a simple introduction
									textToSpeak = `I found ${response.aiResponse.recipes.length} recipe${response.aiResponse.recipes.length > 1 ? "s" : ""} for you: ${recipeTitles}.`
								}
							}

							// Limit length for TTS (max ~500 chars to avoid very long speech)
							if (textToSpeak.length > 500) {
								// Try to truncate at a sentence boundary
								const truncated = textToSpeak.substring(0, 500)
								const lastPeriod = truncated.lastIndexOf(".")
								const lastExclamation = truncated.lastIndexOf("!")
								const lastQuestion = truncated.lastIndexOf("?")
								const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion)

								if (lastSentenceEnd > 400) {
									textToSpeak = truncated.substring(0, lastSentenceEnd + 1)
								} else {
									textToSpeak = truncated + "..."
								}
							}

							console.log("[HomeScreen] Speaking TTS response:", {
								language,
								length: textToSpeak.length,
								preview: textToSpeak.substring(0, 50),
							})

							// Speak the response text
							await speakTTS(textToSpeak, language, {
								rate: 0.9, // Slightly slower for clarity
								pitch: 1.0,
								volume: 1.0,
							})
						} catch (error) {
							console.error("[HomeScreen] TTS error:", error)
							// Don't show error to user - TTS is optional
						}
					}, 300) // Small delay to ensure UI is updated
				}
			} else {
				setLoading(false)
				Alert.alert(t.alerts.sendFailed, response.error || t.alerts.sendFailed, [{ text: t.alerts.ok }])
			}
		} catch (error) {
			setLoading(false)
			console.error("[HomeScreen] Error sending message:", error)
			Alert.alert(t.alerts.error, error instanceof Error ? error.message : t.alerts.error, [{ text: t.alerts.ok }])
		} finally {
			setIsSending(false)
		}
	}

	// Auto-send when voice transcription completes
	// Voice-first UX: when user stops speaking, automatically send the transcript
	useEffect(() => {
		if (transcript && !isListening && !isSending && transcript.trim().length > 0) {
			// Detect Nori mention for better accuracy
			const detection = detectNoriMention(transcript)

			// Log detection for debugging
			if (detection.containsNori) {
				console.log("[STT] Nori detected:", {
					position: detection.noriPosition,
					confidence: detection.confidence,
					original: transcript,
					cleaned: detection.cleanedTranscript,
				})
			}

			// Use enhanced transcript (removes wake word if present)
			const enhancedTranscript = enhanceTranscriptWithNoriContext(transcript)

			// Auto-send voice transcriptions for voice-first UX
			handleSendMessage(enhancedTranscript, "voice")
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [transcript, isListening])

	// Log partial transcripts for debugging
	useEffect(() => {
		if (partialTranscript) {
			console.log("[STT] Partial transcript:", partialTranscript)
		}
	}, [partialTranscript])

	const handleVoicePress = async () => {
		// Dismiss keyboard when starting voice input
		Keyboard.dismiss()

		if (isListening) {
			// Stop listening (transcript will auto-send via useEffect)
			console.log("[STT] Stopping speech recognition...")
			await stopListening()
			console.log("[STT] Stopped. Final transcript:", transcript)
		} else {
			// Start listening
			console.log("[STT] Starting speech recognition...", { language, isAvailable })
			await startListening()
			console.log("[STT] Started listening")
		}
	}

	const handleTextSend = () => {
		handleSendMessage(undefined, "text")
	}

	const dismissKeyboard = () => {
		Keyboard.dismiss()
	}

	// Show error if speech recognition fails
	useEffect(() => {
		if (error) {
			Alert.alert(t.alerts.speechRecognitionError, error)
		}
	}, [error, t])

	// Show alert if native speech recognition is not available
	useEffect(() => {
		if (!isAvailable) {
			Alert.alert(t.alerts.speechRecognitionNotAvailable, t.alerts.speechRecognitionNotAvailableMessage, [{ text: t.alerts.ok }])
		}
	}, [isAvailable, t])

	const handleRecipePress = (recipeId: string) => {
		// TODO: Navigate to recipe detail screen (T4.2)
		console.log("[HomeScreen] Recipe pressed:", recipeId)
		Alert.alert(t.alerts.recipeDetail, `${t.alerts.recipeDetail} ${recipeId} will open in T4.2`)
	}

	const handleNewDiscussion = () => {
		// Stop any ongoing TTS
		stopSpeaking()

		// If there are messages, confirm before clearing
		if (messages.length > 0) {
			Alert.alert(t.alerts.newDiscussionTitle, t.alerts.newDiscussionMessage, [
				{
					text: t.alerts.cancel,
					style: "cancel",
				},
				{
					text: t.alerts.newDiscussionConfirm,
					style: "destructive",
					onPress: () => {
						clearMessages()
						setTextInput("")
						setLoading(false)
						setIsSending(false)
					},
				},
			])
		} else {
			// No messages, just clear anyway
			clearMessages()
			setTextInput("")
			setLoading(false)
			setIsSending(false)
		}
	}

	return (
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
			<View style={styles.content}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.title}>{t.home.title}</Text>
					<View style={styles.headerActions}>
						<TouchableOpacity style={styles.newDiscussionButton} onPress={handleNewDiscussion} disabled={isLoading || isSending}>
							<Ionicons name="add-circle-outline" size={20} color={isLoading || isSending ? "#999" : "#007AFF"} />
							<Text style={[styles.newDiscussionText, (isLoading || isSending) && styles.newDiscussionTextDisabled]}>{t.home.newDiscussion}</Text>
						</TouchableOpacity>
						<LanguageSelector currentLanguage={language} onLanguageChange={handleLanguageChange} disabled={isListening} compact={true} />
					</View>
				</View>

				{/* Chat View */}
				<ChatView messages={messages} isLoading={isLoading} onRecipePress={handleRecipePress} />

				{/* Real-time Transcription Display (only when listening) */}
				{isListening && (partialTranscript || transcript) && (
					<View style={styles.transcriptionContainer}>
						<Text style={styles.transcriptionLabel}>{t.home.listening}</Text>
						<Text style={styles.transcriptionText}>{partialTranscript || transcript || t.home.speak}</Text>
						{partialTranscript && <Text style={styles.partialHint}>{t.home.partialResults}</Text>}
					</View>
				)}

				{/* Input Area */}
				<View style={[styles.inputArea, { paddingBottom: insets.bottom + 60 }]}>
					{/* Text Input */}
					<View style={styles.inputWrapper}>
						<TextInput style={styles.textInput} placeholder={t.home.placeholder} placeholderTextColor="#999" value={textInput} onChangeText={setTextInput} multiline editable={!isListening && !isSending} returnKeyType="send" blurOnSubmit={false} onSubmitEditing={handleTextSend} />
						<TouchableOpacity style={[styles.sendButton, (!textInput.trim() || isSending || isListening) && styles.sendButtonDisabled]} onPress={handleTextSend} disabled={!textInput.trim() || isSending || isListening}>
							<Ionicons name="send" size={20} color={!textInput.trim() || isSending || isListening ? "#999" : "#007AFF"} />
						</TouchableOpacity>
					</View>

					{/* Voice Input Button */}
					<View style={styles.voiceButtonContainer}>
						<VoiceInputButton isRecording={isListening} isProcessing={isSending || isLoading} onPress={handleVoicePress} disabled={!isAvailable || !!error || isSending} />
						{isListening && <Text style={styles.recordingHint}>{t.home.tapToStop}</Text>}
					</View>
				</View>
			</View>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	content: {
		flex: 1,
	},
	header: {
		paddingTop: Platform.OS === "ios" ? 60 : 20,
		paddingHorizontal: 16,
		paddingBottom: 12,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#333",
		flex: 1,
	},
	headerActions: {
		flexDirection: "row",
		alignItems: "center",
	},
	newDiscussionButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 8,
		paddingVertical: 6,
		borderRadius: 8,
		marginRight: 12,
	},
	newDiscussionText: {
		fontSize: 14,
		color: "#007AFF",
		fontWeight: "500",
		marginLeft: 4,
	},
	newDiscussionTextDisabled: {
		color: "#999",
	},
	transcriptionContainer: {
		backgroundColor: "#f5f5f5",
		borderRadius: 8,
		padding: 12,
		marginHorizontal: 16,
		marginBottom: 8,
		minHeight: 50,
	},
	transcriptionLabel: {
		fontSize: 11,
		color: "#666",
		marginBottom: 4,
		fontWeight: "600",
	},
	transcriptionText: {
		fontSize: 14,
		color: "#333",
		lineHeight: 20,
	},
	partialHint: {
		fontSize: 10,
		color: "#999",
		fontStyle: "italic",
		marginTop: 4,
	},
	inputArea: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: "#fff",
		borderTopWidth: 1,
		borderTopColor: "#e0e0e0",
	},
	inputWrapper: {
		flexDirection: "row",
		alignItems: "flex-end",
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 20,
		backgroundColor: "#f5f5f5",
		paddingRight: 8,
		marginBottom: 12,
	},
	textInput: {
		flex: 1,
		padding: 12,
		paddingLeft: 16,
		fontSize: 16,
		maxHeight: 100,
		textAlignVertical: "top",
		backgroundColor: "transparent",
	},
	sendButton: {
		padding: 8,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 4,
	},
	sendButtonDisabled: {
		opacity: 0.3,
	},
	voiceButtonContainer: {
		alignItems: "center",
	},
	recordingHint: {
		fontSize: 12,
		color: "#666",
		fontStyle: "italic",
		marginTop: 4,
	},
})
