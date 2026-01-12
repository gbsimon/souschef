/**
 * Translation hook
 * Provides access to translated strings based on current language
 */

import React, { useContext, createContext, ReactNode, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { translations, LanguageCode, Translations } from "./translations"

interface TranslationContextType {
	language: LanguageCode
	setLanguage: (language: LanguageCode) => void
	t: Translations
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

const LANGUAGE_STORAGE_KEY = "app_language"

export function TranslationProvider({
	children,
}: {
	children: ReactNode
}) {
	const [language, setLanguageState] = useState<LanguageCode>("en-US")
	const [isInitialized, setIsInitialized] = useState(false)

	// Load saved language preference on mount
	useEffect(() => {
		async function loadLanguage() {
			try {
				const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
				if (savedLanguage && (savedLanguage === "en-US" || savedLanguage === "fr-FR")) {
					setLanguageState(savedLanguage as LanguageCode)
				}
			} catch (error) {
				console.error("[Translation] Error loading language preference:", error)
			} finally {
				setIsInitialized(true)
			}
		}
		loadLanguage()
	}, [])

	// Save language preference when it changes
	const setLanguage = async (newLanguage: LanguageCode) => {
		setLanguageState(newLanguage)
		try {
			await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage)
		} catch (error) {
			console.error("[Translation] Error saving language preference:", error)
		}
	}

	const t = translations[language]

	// Don't render until language is loaded to avoid flash of wrong language
	if (!isInitialized) {
		return null
	}

	return (
		<TranslationContext.Provider value={{ language, setLanguage, t }}>
			{children}
		</TranslationContext.Provider>
	)
}

export function useTranslation() {
	const context = useContext(TranslationContext)
	if (context === undefined) {
		throw new Error("useTranslation must be used within a TranslationProvider")
	}
	return context
}
