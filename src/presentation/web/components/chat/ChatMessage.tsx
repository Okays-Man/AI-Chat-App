import { Bot, User } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from "@/types/types";
import { MarkdownRenderer } from "@/components/chat/MarkdownRenderer";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex w-full",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "group relative max-w-[85%] sm:max-w-[75%] rounded-xl p-4 transition-all duration-200",
        isUser 
          ? "bg-primary text-primary-foreground rounded-br-none" 
          : "bg-card border border-border rounded-bl-none"
      )}>
        <div className="flex items-start gap-3">
          {!isUser && (
            <div className="flex-shrink-0 mt-0.5">
              <Bot className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            {isUser ? (
              <div className="whitespace-pre-wrap break-words">{message.content}</div>
            ) : (
              <MarkdownRenderer content={message.content} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}