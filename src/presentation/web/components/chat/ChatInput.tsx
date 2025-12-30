'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    
    onSendMessage(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
        placeholder="Ask anything..."
        className="pr-14"
      />
      <Button
        type="submit"
        disabled={!input.trim() || disabled}
        variant="primary"
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2",
          (!input.trim() || disabled) && "opacity-50 cursor-not-allowed"
        )}
      >
        <Send className="w-4 h-4" />
      </Button>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        AI can make mistakes. Check important info.
      </p>
    </form>
  );
}