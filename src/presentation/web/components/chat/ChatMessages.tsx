import { useRef } from 'react';
import { ChatMessage } from "@/types/types";
import { ChatMessage as MessageComponent } from "@/components/chat/ChatMessage";
import { Spinner } from "@/components/ui/Spinner";
import { Bot } from 'lucide-react';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
}

export function ChatMessages({ messages, isLoading, scrollRef }: ChatMessagesProps) {
  return (
    <div 
      ref={scrollRef} 
      className="flex flex-col h-full overflow-y-auto space-y-6 pr-2"
    >
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-muted-foreground">
          <Bot className="w-12 h-12" />
          <p className="text-sm">Start a conversation by sending a message.</p>
        </div>
      )}

      {messages.map((message) => (
        <MessageComponent key={message.id} message={message} />
      ))}

      {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
        <div className="flex justify-start">
          <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg rounded-bl-none">
            <Spinner size="sm" />
            <span className="text-sm text-muted-foreground">Thinking...</span>
          </div>
        </div>
      )}
    </div>
  );
}