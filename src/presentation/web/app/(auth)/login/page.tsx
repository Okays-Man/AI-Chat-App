'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from "@/lib/api"; 
import { LoginForm } from "@/components/auth/LoginForm";
import { Bot } from 'lucide-react'; 
import Link from 'next/link';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      await auth.login(email, password);
      
      router.push('/chat');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Bot className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Sign in to continue your conversation</p>
      </div>

      <LoginForm 
        onSubmit={handleSubmit} 
        error={error} 
        isLoading={isLoading} 
      />

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link 
          href="/register" 
          className="font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}