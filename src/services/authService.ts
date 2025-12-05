import api from '@/lib/axios';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async logout(): Promise<boolean> {
    try {
      localStorage.removeItem('token');
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
      toast.success('Logged out successfully');
      return true;
    } catch (error) {
      toast.error('Error during logout. Please try again.');
      throw error;
    }
  },

  async checkAuth() {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.CHECK);
      return response.data;
    } catch (error) {
      console.error('Auth check error:', error);
      return { authenticated: false };
    }
  }
};