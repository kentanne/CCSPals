import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { authService } from '@/services/authService';
import { setAuthToken } from '@/lib/axios';
import { handleLoginError, redirectByRole } from '@/utils/authHelpers';

export function useLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    if (isLoading) return;
    
    // Basic client-side validation
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login(email.trim(), password);

      // Handle nested response structure
      const { success, data, message } = response || {};
      
      if (!success || !data?.token) {
        toast.error(message || "Login failed. Please try again.");
        return;
      }

      const { token, userRole, user } = data;
      setAuthToken(token);

      const role = userRole || user?.role;
      const username = user?.username ? `, ${user.username}` : "";
      toast.success(message || `Welcome back${username}!`);

      // Handle missing or incomplete role
      if (!role || role === "user" || role === "") {
        toast.info("Please complete your profile to continue.");
        router.replace("/auth/signup");
        return;
      }

      // Redirect based on role
      redirectByRole(role, router);
    } catch (error: unknown) {
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
}
