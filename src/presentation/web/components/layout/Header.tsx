"use client";

import { User, PanelLeft } from 'lucide-react'; // Changed Menu to PanelLeft
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { auth } from "@/lib/api";
import { useRouter, usePathname } from 'next/navigation';
import { Bot } from 'lucide-react'; 
import { useLayout } from "@/context/LayoutContext"; // 1. Import the hook

export function Header() {
  // 2. Consume the context
  const { toggleSidebar } = useLayout();
  
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticatedPage = (pathname !== '/login' && pathname !== '/register');

  const handleLogout = async () => {
    try {
      await auth.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {isAuthenticatedPage && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="-ml-2 mr-2" // Adjusted spacing, removed md:hidden to allow desktop toggle
              onClick={toggleSidebar} // 3. Connect the toggle
              title="Toggle Sidebar"
            >
              <PanelLeft className="w-5 h-5" />
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-semibold text-lg tracking-tight hidden sm:block">
              AI Assistant
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {isAuthenticatedPage && (
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-muted/50"
                onClick={handleLogout}
                title="Logout"
              >
                <User className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}