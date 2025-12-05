import api from './axios';

interface AuthResponse {
  authenticated: boolean;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
    accountStatus?: string;
  };
  message?: string;
  code: number;
}

/**
 * Check if user is authenticated by calling the internal API endpoint
 * which proxies to the external API
 */
export async function checkAuth(): Promise<AuthResponse> {
  try {
    const response = await api.get('/api/auth/check', {
      withCredentials: true,
    });
    
    return response.data;
  } catch (error: any) {
    return {
      authenticated: false,
      message: error.response?.data?.message || 'Authentication check failed',
      code: error.response?.status || 500
    };
  }
}
