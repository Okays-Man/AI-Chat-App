'use client';

import { Bot } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-8">
      <div className="p-4 bg-primary/10 rounded-full">
        <Bot className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-2xl font-bold">Welcome to AI Assistant</h2>
      <p className="text-muted-foreground max-w-md">
        Select a conversation from the sidebar or create a new chat to get started.
      </p>
    </div>
  );
}