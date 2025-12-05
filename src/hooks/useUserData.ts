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
      const resp = await userService.fetchProfile(role);

      // Response may be in the form { success: true, data: { userData, roleData, rankData } }
      // or may directly return { userData: {...} } or the user object itself.
      let payload: any = resp;
      if (resp && resp.success && resp.data) payload = resp.data;

      const rawUser = payload?.userData || payload;
      if (!rawUser) {
        setUserData(null);
      } else {
        // Normalize fields to match frontend UserData interface
        const normalized: UserData = {
          _id: rawUser._id || rawUser.id || '',
          userId: rawUser.userId || rawUser._id || rawUser.userId || '',
          name: rawUser.name || rawUser.username || '',
          email: rawUser.email || rawUser.userId?.email || '',
          address: rawUser.address || '',
          yearLevel: rawUser.yearLevel || rawUser.year || '',
          program: rawUser.program || rawUser.course || '',
          availability: rawUser.availability || rawUser.availabilityDays || [],
          sessionDur: rawUser.sessionDur || rawUser.sessionDuration || '',
          bio: rawUser.bio || '',
          subjects: rawUser.subjects || rawUser.specialization || [],
          image: rawUser.image || rawUser.image_url || '',
          phoneNumber: rawUser.phoneNumber || rawUser.phone || '',
          style: rawUser.style || [],
          goals: rawUser.goals || '',
          sex: rawUser.sex || rawUser.gender || '',
          status: rawUser.status || rawUser.accountStatus || '',
          modality: rawUser.modality || '',
          createdAt: rawUser.createdAt || new Date().toISOString(),
          __v: rawUser.__v || 0
        };

        setUserData(normalized);
      }
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