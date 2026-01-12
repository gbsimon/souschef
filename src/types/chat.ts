/**
 * Chat Message Types
 * Defines the structure for chat messages in the conversation
 */

import { Recipe } from './recipe';

export type MessageRole = 'user' | 'nori';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text?: string; // Text message content
  timestamp: string;
  source?: 'voice' | 'text'; // For user messages
  recipes?: Recipe[]; // For Nori messages that include recipes
  isLoading?: boolean; // For loading states
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
}
