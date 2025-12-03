import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import { UserData } from '@/interfaces/user';

export const useUserData = (role: 'learner' | 'mentor') => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.fetchProfile(role);
      setUserData(data.userData || data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching user data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserData = (updatedData: Partial<UserData>) => {
    setUserData(prev => prev ? { ...prev, ...updatedData } : null);
  };

  useEffect(() => {
    fetchUserData();
  }, [role]);

  return {
    userData,
    isLoading,
    error,
    updateUserData,
    refetch: fetchUserData
  };
};