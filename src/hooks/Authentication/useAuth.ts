import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { authService } from '@/services/Authentication/authService';
import { AUTH_CONSTANTS } from '@/constants/Authentication/authConstants';
import { validateCredentials, sanitizeCredentials } from '@/utils/Authentication/authUtils';

export const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (iniCred: string, password: string) => {
    if (isLoading) return false;
    
    const credentials = sanitizeCredentials(iniCred, password);
    const validationError = validateCredentials(credentials);
    if (validationError) {
      toast.error(validationError);
      return false;
    }

    setIsLoading(true);
    
    try {
      const result = await authService.login(credentials.iniCred, credentials.password);
      toast.success(AUTH_CONSTANTS.MESSAGES.WELCOME_BACK(result.user?.username));
      
      if (!result.role || result.role === "user") {
        toast.info(AUTH_CONSTANTS.MESSAGES.COMPLETE_PROFILE);
        router.replace(AUTH_CONSTANTS.ROUTES.SIGNUP);
      } else {
        toast.success(AUTH_CONSTANTS.MESSAGES.LOGIN_SUCCESS(result.role));
        
        // Fix the role routing logic
        const routeMap: { [key: string]: string } = {
          learner: AUTH_CONSTANTS.ROUTES.LEARNER,
          mentor: AUTH_CONSTANTS.ROUTES.MENTOR,
          admin: AUTH_CONSTANTS.ROUTES.ADMIN
        };
        
        const redirectRoute = routeMap[result.role] || AUTH_CONSTANTS.ROUTES.SIGNUP;
        router.replace(redirectRoute);
      }
      return true;
    } catch (error) {
      authService.handleLoginError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};