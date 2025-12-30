'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from "@/hooks/useChat";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage } from "@/types/types";
import { Button } from "@/components/ui/Button";

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { sendMessage, getChatHistory, currentChat, config, setConfig } = useChat();
  const chatId = parseInt(params.chatId);

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        setIsLoading(true);
        const history = await getChatHistory(chatId);
        setMessages(history);
      } catch (err) {
        setError('Failed to load chat history');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, [chatId, getChatHistory]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user' as const,
      content,
      created_at: new Date().toISOString(),
      chat_id: chatId
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      await sendMessage(chatId, content, config, {
        onMessage: (newMessage: ChatMessage) => {
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.role === 'ai') {
              return [...prev.slice(0, -1), { ...lastMessage, content: newMessage.content }];
            }
            return [...prev, newMessage];
          });
        },
        onError: (errorMessage: string) => {
          setError(errorMessage);
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.role === 'ai') {
              return [...prev.slice(0, -1), { ...lastMessage, content: `Error: ${errorMessage}` }];
            }
            return prev;
          });
        }
      });
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="text-red-500">{error}</div>
        <Button onClick={() => window.location.reload()} variant="primary">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      <ChatHeader 
        chat={currentChat} 
        config={config} 
        setConfig={setConfig} 
        isLoading={isLoading} 
      />
      
      <div className="flex-1 overflow-hidden">
        <ChatMessages 
          messages={messages} 
          isLoading={isLoading} 
          scrollRef={scrollRef as React.RefObject<HTMLDivElement>} 
        />
      </div>
      
      <div className="mt-4">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={isLoading} 
        />
      </div>
    </div>
  );
}