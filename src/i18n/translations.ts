/**
 * Translation strings for the app
 * Supports English (en-US) and French (fr-FR)
 */

export type LanguageCode = "en-US" | "fr-FR"

export interface Translations {
	// Home Screen
	home: {
		title: string
		newDiscussion: string
		placeholder: string
		listening: string
		partialResults: string
		tapToStop: string
		speak: string
		stop: string
	}
	
	// Chat
	chat: {
		emptyState: string
	}
	
	// Alerts
	alerts: {
		emptyMessage: string
		authRequired: string
		sendFailed: string
		error: string
		ok: string
		cancel: string
		speechRecognitionError: string
		speechRecognitionNotAvailable: string
		speechRecognitionNotAvailableMessage: string
		recipeDetail: string
		newDiscussionTitle: string
		newDiscussionMessage: string
		newDiscussionConfirm: string
	}
	
	// Settings
	settings: {
		account: string
		email: string
		locale: string
		settings: string
		comingSoon: string
		logOut: string
		logOutConfirm: string
		logOutError: string
	}
	
	// Auth
	auth: {
		welcomeTitle: string
		welcomeSubtitle: string
		signUp: string
		logIn: string
		createAccount: string
		createAccountSubtitle: string
		welcomeBack: string
		logInSubtitle: string
		password: string
		emailPlaceholder: string
		passwordPlaceholder: string
		fillAllFields: string
		passwordTooShort: string
		createAccountError: string
		logInError: string
		checkCredentials: string
		noAccount: string
		haveAccount: string
	}
	
	// Saved Recipes
	savedRecipes: {
		title: string
		subtitle: string
	}
	
	// Language
	language: {
		label: string
		english: string
		french: string
	}
	
	// Common
	common: {
		loading: string
		saving: string
		processing: string
	}
	
	// Navigation
	navigation: {
		ask: string
		saved: string
		settings: string
	}
}

export const translations: Record<LanguageCode, Translations> = {
	"en-US": {
		home: {
			title: "Ask Nori",
			newDiscussion: "New",
			placeholder: "Type your ingredients here...",
			listening: "Listening...",
			partialResults: "(partial results)",
			tapToStop: "Tap to stop",
			speak: "Speak",
			stop: "Stop",
		},
		chat: {
			emptyState: "👋 Hi! I'm Nori. What would you like to cook today?",
		},
		alerts: {
			emptyMessage: "Please enter a message or use voice input.",
			authRequired: "Please log in to use Nori.",
			sendFailed: "Failed to get response from Nori. Please try again.",
			error: "An error occurred while sending your message. Please try again.",
			ok: "OK",
			cancel: "Cancel",
			speechRecognitionError: "Speech Recognition Error",
			speechRecognitionNotAvailable: "Speech Recognition Not Available",
			speechRecognitionNotAvailableMessage: "Native speech recognition is not available on this device. Please ensure you are using a custom development client.",
			recipeDetail: "Recipe Detail",
			newDiscussionTitle: "New Discussion",
			newDiscussionMessage: "Start a new conversation? This will clear your current chat history.",
			newDiscussionConfirm: "New Discussion",
		},
		settings: {
			account: "Account",
			email: "Email",
			locale: "Locale",
			settings: "Settings",
			comingSoon: "Pantry, preferences, and appliances coming soon",
			logOut: "Log Out",
			logOutConfirm: "Are you sure you want to log out?",
			logOutError: "Failed to log out. Please try again.",
		},
		auth: {
			welcomeTitle: "Welcome to Nori",
			welcomeSubtitle: "Your cozy cooking assistant",
			signUp: "Sign Up",
			logIn: "Log In",
			createAccount: "Create Account",
			createAccountSubtitle: "Sign up to get started with Nori",
			welcomeBack: "Welcome Back",
			logInSubtitle: "Log in to continue",
			password: "Password",
			emailPlaceholder: "Email",
			passwordPlaceholder: "Password",
			fillAllFields: "Please fill in all fields",
			passwordTooShort: "Password must be at least 6 characters",
			createAccountError: "Failed to create account. Please try again.",
			logInError: "Failed to log in. Please check your credentials.",
			checkCredentials: "Failed to log in. Please check your credentials.",
			noAccount: "Don't have an account? Sign up",
			haveAccount: "Already have an account? Log in",
		},
		savedRecipes: {
			title: "Saved Recipes",
			subtitle: "Your saved recipes will appear here",
		},
		language: {
			label: "Language:",
			english: "English",
			french: "Français",
		},
		common: {
			loading: "Loading...",
			saving: "Saving...",
			processing: "Processing...",
		},
		navigation: {
			ask: "Ask",
			saved: "Saved",
			settings: "Settings",
		},
	},
	"fr-FR": {
		home: {
			title: "Demander à Nori",
			newDiscussion: "Nouveau",
			placeholder: "Tapez vos ingrédients ici...",
			listening: "Écoute...",
			partialResults: "(résultats partiels)",
			tapToStop: "Appuyez pour arrêter",
			speak: "Parler",
			stop: "Arrêter",
		},
		chat: {
			emptyState: "👋 Salut ! Je suis Nori. Qu'aimeriez-vous cuisiner aujourd'hui ?",
		},
		alerts: {
			emptyMessage: "Veuillez entrer un message ou utiliser la saisie vocale.",
			authRequired: "Veuillez vous connecter pour utiliser Nori.",
			sendFailed: "Échec de la réponse de Nori. Veuillez réessayer.",
			error: "Une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer.",
			ok: "OK",
			cancel: "Annuler",
			speechRecognitionError: "Erreur de reconnaissance vocale",
			speechRecognitionNotAvailable: "Reconnaissance vocale non disponible",
			speechRecognitionNotAvailableMessage: "La reconnaissance vocale native n'est pas disponible sur cet appareil. Veuillez vous assurer d'utiliser un client de développement personnalisé.",
			recipeDetail: "Détails de la recette",
			newDiscussionTitle: "Nouvelle discussion",
			newDiscussionMessage: "Démarrer une nouvelle conversation ? Cela effacera l'historique de votre chat actuel.",
			newDiscussionConfirm: "Nouvelle discussion",
		},
		settings: {
			account: "Compte",
			email: "Courriel",
			locale: "Paramètres régionaux",
			settings: "Paramètres",
			comingSoon: "Garde-manger, préférences et appareils à venir",
			logOut: "Se déconnecter",
			logOutConfirm: "Êtes-vous sûr de vouloir vous déconnecter ?",
			logOutError: "Échec de la déconnexion. Veuillez réessayer.",
		},
		auth: {
			welcomeTitle: "Bienvenue chez Nori",
			welcomeSubtitle: "Votre assistant culinaire chaleureux",
			signUp: "S'inscrire",
			logIn: "Se connecter",
			createAccount: "Créer un compte",
			createAccountSubtitle: "Inscrivez-vous pour commencer avec Nori",
			welcomeBack: "Bon retour",
			logInSubtitle: "Connectez-vous pour continuer",
			password: "Mot de passe",
			emailPlaceholder: "Courriel",
			passwordPlaceholder: "Mot de passe",
			fillAllFields: "Veuillez remplir tous les champs",
			passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères",
			createAccountError: "Échec de la création du compte. Veuillez réessayer.",
			logInError: "Échec de la connexion. Veuillez vérifier vos identifiants.",
			checkCredentials: "Échec de la connexion. Veuillez vérifier vos identifiants.",
			noAccount: "Vous n'avez pas de compte ? Inscrivez-vous",
			haveAccount: "Vous avez déjà un compte ? Connectez-vous",
		},
		savedRecipes: {
			title: "Recettes enregistrées",
			subtitle: "Vos recettes enregistrées apparaîtront ici",
		},
		language: {
			label: "Langue :",
			english: "English",
			french: "Français",
		},
		common: {
			loading: "Chargement...",
			saving: "Enregistrement...",
			processing: "Traitement...",
		},
		navigation: {
			ask: "Demander",
			saved: "Enregistrés",
			settings: "Paramètres",
		},
	},
}
