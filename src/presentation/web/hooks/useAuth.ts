import { useState, useEffect } from 'react';
import { auth } from "@/lib/api";
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const userData = await auth.checkAuth();
        setUser(userData);
      } catch (err) {
        setError('Not authenticated');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userData = await auth.login(email, password);
      setUser(userData);
      router.push('/chat');
    } catch (err) {
      setError('Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const userData = await auth.register(username, email, password);
      setUser(userData);
      router.push('/chat');
    } catch (err) {
      setError('Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
      setUser(null);
      router.push('/login');
    } catch (err) {
      setError('Logout failed');
      throw err;
    }
  };

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };
}