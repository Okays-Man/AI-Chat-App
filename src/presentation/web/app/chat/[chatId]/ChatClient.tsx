'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from "@/hooks/useChat";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage } from "@/types/types";
import { Button } from "@/components/ui/Button";

interface ChatClientProps {
  chatId: number;
}

export default function ChatClient({ chatId }: ChatClientProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Destructure config and setConfig
  const { sendMessage, getChatHistory, currentChat, config, setConfig } = useChat();

  useEffect(() => {
    if (isNaN(chatId)) return;

    const loadChatHistory = async () => {
      try {
        setIsLoading(true);
        const history = await getChatHistory(chatId);
        setMessages(history);
      } catch (err) {
        setError('Failed to load chat history');
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, [chatId]); 

  // Auto-scroll logic
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
      // Pass the current config here
      await sendMessage(chatId, content, config, {
        onMessage: (newMessage) => {
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.role === 'ai') {
              return [...prev.slice(0, -1), { ...lastMessage, content: newMessage.content }];
            }
            return [...prev, newMessage];
          });
        },
        onError: (errorMessage) => {
          setError(errorMessage);
        }
      });
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="text-destructive">{error}</div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Settings are modified here */}
      <ChatHeader 
        chat={currentChat} 
        config={config}
        setConfig={setConfig}
        isLoading={isLoading}
      />
      
      {/* 
         The Max-Width container is applied HERE, inside the flex child.
         This ensures centering respects the flex container's current width.
      */}
      <div className="flex-1 overflow-hidden relative">
         <div className="h-full max-w-4xl mx-auto flex flex-col">
            <div className="flex-1 overflow-hidden">
              <ChatMessages 
                messages={messages} 
                isLoading={isLoading} 
                scrollRef={scrollRef as React.RefObject<HTMLDivElement>} 
              />
            </div>
            
            <div className="p-4 pt-0">
              <ChatInput 
                onSendMessage={handleSendMessage} 
                disabled={isLoading} 
              />
            </div>
         </div>
      </div>
    </div>
  );
}