'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner"; 
import { Bot } from 'lucide-react';
import { cn } from "@/lib/utils";

interface RegisterFormProps {
  onSubmit: (username: string, email: string, password: string) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
}

export function RegisterForm({ onSubmit, error, isLoading = false }: RegisterFormProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (isLoading) return;

  if (password.length < 8) {
    alert('Password must be at least 8 characters long');
    return;
  }
  
  if (username.length < 3) {
    alert('Username must be at least 3 characters long');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  await onSubmit(username, email, password);
};
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">Username</label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="your_username"
          disabled={isLoading}
          required
        />
      </div>

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
        <label htmlFor="password" className="text-sm font-medium">Password</label>
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

      <div className="space-y-2">
        <label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          disabled={isLoading}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !username || !email || !password || !confirmPassword}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner size="sm" />
            Creating account...
          </span>
        ) : (
          'Create account'
        )}
      </Button>
    </form>
  );
}