export class NavigationService {
  static goToLearnMore(router: any) {
    router.push('components/homepage');
  }

  static goToSignup(router: any) {
    router.push('/auth/login');
  }
}