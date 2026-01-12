/**
 * Message Service
 * Unified pipeline for sending user prompts (voice or text) to get recipe responses
 * Integrated with AI orchestration (T3.1)
 */

import { callAIWithTools, isAIServiceConfigured } from './aiService';
import { Recipe } from '../types/recipe';

export interface UserMessage {
  id: string;
  text: string;
  timestamp: string;
  source: 'voice' | 'text';
  language?: string;
}

export interface MessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  aiResponse?: {
    text: string;
    recipes?: Recipe[];
  };
}

/**
 * Send a user message/prompt and get AI response
 * 
 * @param message - The user's message text
 * @param source - Whether the message came from voice or text input
 * @param language - Language code (e.g., 'en-US', 'fr-FR')
 * @param userId - User ID for context and tool calls
 * @param conversationHistory - Previous messages in the conversation
 * @returns Response with AI-generated text and recipes
 */
export async function sendUserMessage(
  message: string,
  source: 'voice' | 'text' = 'text',
  language: string = 'en-US',
  userId: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<MessageResponse> {
  if (!message || message.trim().length === 0) {
    return {
      success: false,
      error: 'Message cannot be empty',
    };
  }

  if (!userId) {
    return {
      success: false,
      error: 'User ID is required',
    };
  }

  try {
    // Create message object
    const userMessage: UserMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: message.trim(),
      timestamp: new Date().toISOString(),
      source,
      language,
    };

    console.log('[MessageService] Sending user message:', userMessage);

    // Check if AI service is configured
    if (!isAIServiceConfigured()) {
      return {
        success: false,
        error: 'AI service is not configured. Please set EXPO_PUBLIC_OPENAI_API_KEY.',
      };
    }

    // Call AI orchestration service
    const aiResponse = await callAIWithTools(
      message.trim(),
      userId,
      language,
      conversationHistory
    );

    console.log('[MessageService] AI response received:', {
      textLength: aiResponse.text.length,
      recipeCount: aiResponse.recipes?.length || 0,
      toolCalls: aiResponse.toolCalls?.length || 0,
    });

    return {
      success: true,
      messageId: userMessage.id,
      aiResponse: {
        text: aiResponse.text,
        recipes: aiResponse.recipes,
      },
    };
  } catch (error) {
    console.error('[MessageService] Error sending message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message',
    };
  }
}

/**
 * Check if message service is ready
 */
export function isMessageServiceReady(): boolean {
  return isAIServiceConfigured();
}
