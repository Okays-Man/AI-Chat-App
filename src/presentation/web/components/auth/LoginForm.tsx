'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from 'next/link'; 
import { Spinner } from "@/components/ui/Spinner"; 
import { Bot } from 'lucide-react';
import { cn } from "@/lib/utils";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, error, isLoading = false }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <Link 
            href="#" 
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          disabled={isLoading}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !email || !password}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner size="sm" />
            Signing in...
          </span>
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  );
}