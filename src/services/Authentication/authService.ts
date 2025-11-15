import axios from 'axios';
import { toast } from 'react-toastify';
import api, { setAuthToken } from '@/lib/axios'; 
import { LoginResponse } from '@/interfaces/Authentication/authInterfaces';
import { AUTH_CONSTANTS } from '@/constants/Authentication/authConstants';

export const authService = {
  async login(iniCred: string, password: string) {
    const response = await api.post<LoginResponse>("/api/auth/login", { 
      iniCred: iniCred.trim(), 
      password 
    });
    
    const { token, userRole, user } = response.data || {};
    
    if (!token) {
      throw new Error(response.data?.message || "Login failed");
    }

    setAuthToken(token);
    return { token, role: userRole || user?.role, user };
  },

  handleLoginError(error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message ||
        (error.response?.status === 401 ? AUTH_CONSTANTS.MESSAGES.INVALID_CREDENTIALS : error.message);
      toast.error(message);
    } else {
      toast.error(AUTH_CONSTANTS.MESSAGES.UNEXPECTED_ERROR);
    }
  }
};