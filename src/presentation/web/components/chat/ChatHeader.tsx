'use client';

import { Chat, ChatConfig } from "@/types/types";
import { PanelLeftOpen } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { useLayout } from "@/context/LayoutContext";
import { ChatSettings } from "@/components/chat/ChatSettings";

interface ChatHeaderProps {
  chat: Chat | null;
  config: ChatConfig;
  setConfig: (config: ChatConfig) => void;
  isLoading: boolean;
}

export function ChatHeader({ chat, config, setConfig, isLoading }: ChatHeaderProps) {
  const { isSidebarOpen, toggleSidebar } = useLayout();

  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex items-center gap-3">
        {/* Toggle button only visible when sidebar is closed */}
        {!isSidebarOpen && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <PanelLeftOpen className="w-5 h-5" />
          </Button>
        )}
        
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold leading-tight">
            {chat?.title || 'New Conversation'}
          </h2>
          <span className="text-xs text-muted-foreground">
            {config.model.split(':')[0]} • T: {config.temperature}
          </span>
        </div>
      </div>

      <ChatSettings 
        config={config} 
        onConfigChange={setConfig} 
        disabled={isLoading}
      />
    </div>
  );
}