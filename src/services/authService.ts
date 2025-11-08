import { LOGIN_CONSTANTS } from '@/constants/loginConstants';

interface LoginCredentials {
  iniCred: string;
  password: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<string> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Demo logic - determine route based on credentials
    if (credentials.iniCred.includes('admin')) {
      return LOGIN_CONSTANTS.ROUTES.ADMIN;
    } else if (credentials.iniCred.includes('mentor')) {
      return LOGIN_CONSTANTS.ROUTES.MENTOR;
    } else if (credentials.iniCred.includes('learner')) {
      return LOGIN_CONSTANTS.ROUTES.LEARNER;
    } else {
      return LOGIN_CONSTANTS.ROUTES.LEARNER;
    }
  }

  async logout(): Promise<void> {
    // Clear any stored tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  }
}

export const authService = new AuthService();