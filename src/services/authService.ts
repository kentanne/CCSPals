import api from '@/lib/axios';
import { toast } from 'react-toastify';

export const authService = {
  async switchRole(): Promise<boolean> {
    try {
      const res = await api.post('/auth/switch-role', {});
      
      if (res.status === 200) {
        const newRole = res.data?.newRole;
        toast.success(`Role switched to ${newRole}. Please log in again.`);
        localStorage.removeItem('token');
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Error switching role. Please try again.';
      toast.error(message);
      throw error;
    }
  },

  async logout(): Promise<boolean> {
    try {
      localStorage.removeItem('token');
      await api.post('/auth/logout');
      toast.success('Logged out successfully');
      return true;
    } catch (error) {
      toast.error('Error during logout. Please try again.');
      throw error;
    }
  }
};