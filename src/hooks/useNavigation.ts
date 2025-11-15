import { useRouter } from 'next/navigation';
import { NavigationService } from '@/services/services';

export const useHomepageNavigation = () => {
  const router = useRouter();

  return {
    goToLearnMore: () => NavigationService.goToLearnMore(router),
    goToSignup: () => NavigationService.goToSignup(router)
  };
};