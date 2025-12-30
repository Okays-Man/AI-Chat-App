'use client';

import { useEffect, useState } from 'react';
import { Bot, Plus, MessageSquare, LogOut, PanelLeftClose } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { auth } from "@/lib/api";
import { useRouter, usePathname } from 'next/navigation'; 
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/LayoutContext";

export function Sidebar() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); 
  
  const { chats, createChat, isLoading } = useChat();
  const { isSidebarOpen, toggleSidebar } = useLayout();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || pathname === '/login' || pathname ==='/register') {
    return null;
  }

  const handleLogout = async () => {
    try {
      await auth.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div 
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-background transition-transform duration-300 ease-in-out",
        // If sidebar is closed, translate it off-screen to the left
        !isSidebarOpen && "-translate-x-full"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2 font-medium">
            <Bot className="w-5 h-5" />
            <span>AI Assistant</span>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-4 pb-0">
          <Button
            variant="secondary"
            className="w-full justify-start gap-2 shadow-sm"
            onClick={createChat}
            disabled={isLoading}
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </Button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-2 pt-4">
          <div className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Recent Chats
          </div>
          <div className="space-y-1">
            {chats.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 truncate text-sm font-normal",
                  pathname?.includes(`/chat/${chat.id}`) && "bg-secondary text-secondary-foreground font-medium"
                )}
                onClick={() => router.push(`/chat/${chat.id}`)}
              >
                <MessageSquare className="w-4 h-4 min-w-4 opacity-70" />
                <span className="truncate">{chat.title}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="border-t border-border p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}