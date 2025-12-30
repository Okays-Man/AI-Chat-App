import { useState, useEffect } from 'react';
import { chatApi } from "@/lib/api"; 
import { Chat, ChatMessage, ChatConfig } from "@/types/types";
import { toast } from 'react-hot-toast';

export function useChat() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<ChatConfig>({
    model: "nemotron-3-nano-30b-a3b:free",
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 0.9,
    stream: true
  });

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setIsLoading(true);
      const data = await chatApi.listChats();
      setChats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createChat = async () => {
    try {
      setIsLoading(true);
      const newChat = await chatApi.createChat({ title: 'New Chat' });
      setChats(prev => [newChat, ...prev]);
      setCurrentChat(newChat);
      return newChat;
    } catch (err) {
      toast.error('Failed to create chat');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getChatHistory = async (chatId: number) => {
    try {
      if (!chatId || isNaN(chatId)) return [];
      const history = await chatApi.getChatHistory(chatId);
      return history;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const sendMessage = async (
    chatId: number, 
    content: string,
    currentConfig: ChatConfig, // Receive config here
    callbacks: {
      onMessage: (message: ChatMessage) => void;
      onError: (error: string) => void;
    }
  ) => {
    try {
      if (!chatId || isNaN(chatId)) throw new Error("No active chat");

      // Pass config to your API wrapper
      // Ensure your chatApi.sendMessageStream accepts the config object as the 3rd arg
      // or combines it with content. 
      // Assuming api.ts needs update, see below note.*
      const response = await chatApi.sendMessageStream(chatId, content, currentConfig);

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value, { stream: true }).split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const rawData = line.slice(6).trim();
            if (rawData === '[DONE]' || !rawData) continue;
            
            if (rawData.startsWith('Error:')) {
              const errMsg = rawData.slice(6).trim();
              callbacks.onError(errMsg);
              throw new Error(errMsg);
            }
            
            try {
              const parsedChunk = JSON.parse(rawData);
              const textChunk = parsedChunk.content || "";
              accumulatedContent += textChunk;
            } catch (e) {
              accumulatedContent += rawData;
            }

            callbacks.onMessage({
              id: Date.now(),
              role: 'ai',
              content: accumulatedContent,
              created_at: new Date().toISOString(),
              chat_id: chatId
            });
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      callbacks.onError(msg);
    }
  };

  return {
    chats,
    currentChat,
    isLoading,
    config,
    setConfig, // Expose setter
    createChat,
    getChatHistory,
    sendMessage,
    setCurrentChat,
    loadChats
  };
}