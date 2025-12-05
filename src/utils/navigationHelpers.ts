import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * Navigate to homepage with anchor
 */
export function navigateToHome(router: AppRouterInstance, anchor?: string) {
  const path = anchor ? `/#${anchor}` : '/';
  router.push(path);
}

/**
 * Navigate to learner info page
 */
export function navigateToLearnerInfo(router: AppRouterInstance) {
  router.push('/info/learner');
}

/**
 * Navigate to mentor info page
 */
export function navigateToMentorInfo(router: AppRouterInstance) {
  router.push('/info/mentor');
}

/**
 * Store role selection in localStorage and navigate to appropriate info page
 */
export function selectRoleAndNavigate(role: 'learner' | 'mentor', router: AppRouterInstance) {
  localStorage.setItem('selectedRole', role);
  
  if (role === 'learner') {
    navigateToLearnerInfo(router);
  } else {
    navigateToMentorInfo(router);
  }
}
