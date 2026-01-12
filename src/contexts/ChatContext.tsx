/**
 * Chat Context
 * Manages chat messages and conversation state
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ChatMessage } from '../types/chat';
import { Recipe } from '../types/recipe';

interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  addUserMessage: (text: string, source: 'voice' | 'text') => string;
  addNoriMessage: (text: string, recipes?: Recipe[]) => string;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addUserMessage = useCallback((text: string, source: 'voice' | 'text'): string => {
    const message: ChatMessage = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
      source,
    };
    setMessages(prev => [...prev, message]);
    return message.id;
  }, []);

  const addNoriMessage = useCallback((text: string, recipes?: Recipe[]): string => {
    const message: ChatMessage = {
      id: `nori_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'nori',
      text,
      timestamp: new Date().toISOString(),
      recipes,
    };
    setMessages(prev => [...prev, message]);
    return message.id;
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        addUserMessage,
        addNoriMessage,
        setLoading,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
