/**
 * Text-to-Speech Service
 * Uses ElevenLabs API for high-quality TTS
 * Supports FR/EN language switching with different voices
 */

import { createAudioPlayer, setAudioModeAsync, type AudioPlayer, type AudioStatus } from "expo-audio"
import * as FileSystem from "expo-file-system"
import type { EventSubscription } from "expo-modules-core"
import { env } from "../config/env"
import { ELEVENLABS_VOICE_IDS, ELEVENLABS_VOICE_SETTINGS, LanguageCode } from "../config/noriConfig"

export type { LanguageCode }

// Global audio player instance
let player: AudioPlayer | null = null
let playbackSubscription: EventSubscription | null = null
let currentAudioUri: string | null = null
let audioModeInitialized = false

async function ensureAudioMode(): Promise<void> {
	if (audioModeInitialized) return

	try {
		// Configure audio session for playback (allows TTS even in silent mode on iOS)
		await setAudioModeAsync({
			playsInSilentMode: true,
			allowsRecording: false,
			shouldPlayInBackground: false,
			shouldRouteThroughEarpiece: false,
			interruptionMode: "duckOthers",
		})
		audioModeInitialized = true
		console.log("[TTS] Audio mode configured for playback")
	} catch (error) {
		console.warn("[TTS] Could not configure audio mode:", error)
	}
}

/**
 * Generate speech audio from ElevenLabs API
 * Returns the audio as a data URI that can be played directly
 */
async function generateElevenLabsAudioBase64(text: string, voiceId: string, apiKey: string): Promise<string> {
	const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`

	const response = await fetch(url, {
		method: "POST",
		headers: {
			Accept: "audio/mpeg",
			"Content-Type": "application/json",
			"xi-api-key": apiKey,
		},
		body: JSON.stringify({
			text,
			model_id: "eleven_turbo_v2_5", // Updated to newer model available on free tier
			voice_settings: ELEVENLABS_VOICE_SETTINGS,
		}),
	})

	if (!response.ok) {
		const errorText = await response.text()
		throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`)
	}

	// Get audio as array buffer and convert to base64
	// React Native compatible base64 conversion
	const arrayBuffer = await response.arrayBuffer()
	const bytes = new Uint8Array(arrayBuffer)

	// Convert to base64 using React Native compatible method
	let binary = ""
	const len = bytes.byteLength
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i])
	}

	// Use global btoa if available, otherwise use a polyfill
	let base64: string
	if (typeof btoa !== "undefined") {
		base64 = btoa(binary)
	} else {
		// Fallback: use Buffer if available (Node.js environment)
		// In React Native, we'll need to handle this differently
		// For now, we'll try to use the response directly as a URL
		throw new Error("Base64 encoding not available. Please ensure btoa is available or use a polyfill.")
	}

	return base64
}

async function resolveAudioSource(base64: string): Promise<string> {
	const cacheDir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory
	if (!cacheDir) {
		// Likely web; fall back to data URI.
		return `data:audio/mpeg;base64,${base64}`
	}

	const fileUri = `${cacheDir}tts-${Date.now()}.mp3`
	await FileSystem.writeAsStringAsync(fileUri, base64, {
		encoding: FileSystem.EncodingType.Base64,
	})
	return fileUri
}

async function cleanupAudioFile(uri: string | null): Promise<void> {
	if (!uri) return
	if (uri.startsWith("data:audio/")) return
	try {
		await FileSystem.deleteAsync(uri, { idempotent: true })
	} catch (error) {
		console.warn("[TTS] Failed to delete cached audio file:", error)
	}
}

/**
 * Speak text using ElevenLabs TTS
 */
export async function speak(
	text: string,
	language: LanguageCode = "en-US",
	options?: {
		pitch?: number
		rate?: number
		volume?: number
	}
): Promise<void> {
	if (!text || text.trim().length === 0) {
		console.warn("[TTS] Empty text provided, skipping speech")
		return
	}

	const apiKey = env.elevenLabsApiKey
	if (!apiKey) {
		console.error("[TTS] ElevenLabs API key not configured")
		throw new Error("ElevenLabs API key is required. Please set EXPO_PUBLIC_ELEVENLABS_API_KEY.")
	}

	try {
		// Ensure audio mode is configured
		await ensureAudioMode()

		// Stop any current playback
		stopSpeaking()

		const voiceId = ELEVENLABS_VOICE_IDS[language]

		console.log("[TTS] Generating speech with ElevenLabs:", {
			text: text.substring(0, 50),
			language,
			voiceId,
			fullLength: text.length,
		})

		// Generate audio from ElevenLabs and write to a local cache file
		const audioBase64 = await generateElevenLabsAudioBase64(text, voiceId, apiKey)
		const audioSource = await resolveAudioSource(audioBase64)
		currentAudioUri = audioSource

		// Create and configure audio player
		const newPlayer = createAudioPlayer(audioSource, { keepAudioSessionActive: true })
		newPlayer.volume = options?.volume ?? 1.0
		newPlayer.setPlaybackRate(options?.rate ?? 1.0)
		newPlayer.shouldCorrectPitch = true
		newPlayer.play()

		player = newPlayer

		console.log("[TTS] Speech started - audio should be playing now")

		// Wait for playback to finish
		return new Promise((resolve) => {
			if (!player) {
				resolve()
				return
			}

			const activePlayer = player
			const activeAudioUri = currentAudioUri
			playbackSubscription?.remove()
			playbackSubscription = activePlayer.addListener("playbackStatusUpdate", (status: AudioStatus) => {
				if (!status.isLoaded) return
				if (status.didJustFinish) {
					playbackSubscription?.remove()
					playbackSubscription = null
					if (currentAudioUri === activeAudioUri) {
						currentAudioUri = null
					}
					void cleanupAudioFile(activeAudioUri)
					console.log("[TTS] Speech completed")
					resolve()
				}
			})

			// Timeout after 60 seconds (safety measure)
			setTimeout(() => {
				playbackSubscription?.remove()
				playbackSubscription = null
				if (player === activePlayer) {
					activePlayer.pause()
					activePlayer.remove()
					player = null
					if (currentAudioUri === activeAudioUri) {
						currentAudioUri = null
					}
					void cleanupAudioFile(activeAudioUri)
					console.warn("[TTS] Speech playback timeout")
				}
				resolve()
			}, 60000)
		})
	} catch (error) {
		console.error("[TTS] Error in speak function:", error)
		throw error
	}
}

/**
 * Stop current speech
 */
export function stopSpeaking(): void {
	if (playbackSubscription) {
		playbackSubscription.remove()
		playbackSubscription = null
	}
	if (player) {
		try {
			player.pause()
			player.remove()
			console.log("[TTS] Speech stopped")
		} catch (error) {
			console.error("[TTS] Error stopping speech:", error)
		} finally {
			player = null
			void cleanupAudioFile(currentAudioUri)
			currentAudioUri = null
		}
	}
}

/**
 * Check if TTS is currently speaking
 */
export async function isSpeaking(): Promise<boolean> {
	if (!player) {
		return false
	}
	try {
		return player.isLoaded && player.playing
	} catch (error) {
		console.error("[TTS] Error checking speaking status:", error)
		return false
	}
}

/**
 * Get available voices (for future use - can fetch from ElevenLabs API)
 */
export async function getAvailableVoices(): Promise<Array<{ id: string; name: string; language: string }>> {
	// For now, return the configured voices
	// In the future, can fetch from: https://api.elevenlabs.io/v1/voices
	return [
		{ id: ELEVENLABS_VOICE_IDS["en-US"], name: "English Voice", language: "en-US" },
		{ id: ELEVENLABS_VOICE_IDS["fr-FR"], name: "French Voice", language: "fr-FR" },
	]
}
