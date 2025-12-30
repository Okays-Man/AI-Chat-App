'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/Button";

export function ThemeToggle() {
  const [theme, setTheme] = useState('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') || 'system';
    setTheme(storedTheme);
    
    const isDark = storedTheme === 'dark' || 
                  (storedTheme === 'system' && 
                   window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const isDark = theme === 'dark' || 
                  (theme === 'system' && 
                   window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="hover:bg-muted/50"
    >
      {theme === 'light' ? (
        <Sun className="w-5 h-5" />
      ) : theme === 'dark' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <div className="flex items-center justify-center w-5 h-5">
          <Sun className="w-3 h-3 absolute rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="w-3 h-3 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </div>
      )}
    </Button>
  );
}