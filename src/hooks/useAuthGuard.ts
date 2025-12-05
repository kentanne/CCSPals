import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth } from '@/lib/auth';
import { toast } from 'react-toastify';

export const useAuthGuard = (requiredRole?: string) => {
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const auth = await checkAuth();
        
        if (!auth.authenticated) {
          toast.error('Please log in to access this page');
          router.replace('/auth/login');
          return;
        }

        if (requiredRole && auth.user?.role !== requiredRole) {
          toast.error(`Access denied. This page is for ${requiredRole}s only.`);
          router.replace('/auth/login');
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.replace('/auth/login');
      }
    };

    verifyAuth();
  }, [router, requiredRole]);
};