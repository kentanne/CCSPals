import api from '@/lib/axios';

export const passwordService = {
  async sendResetLink(verificationData: any) {
    const response = await api.post("/api/auth/forgot-password", verificationData);
    if (response.status === 200) {
      console.log("Password reset link sent:", response.data);
      return response.data;
    }
    throw new Error("Failed to send reset link");
  }
};