import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

interface LoginCredentials {
  iniCred: string;
  password: string;
}

export const useLogin = () => { // Make sure this is exported
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const redirectPath = await authService.login(credentials);
      router.push(redirectPath);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isLoading,
    error,
    login,
    clearError,
  };
};