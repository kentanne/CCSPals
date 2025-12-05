import { toast } from 'react-toastify';
import axios from 'axios';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * Handle login errors with specific messages based on error type and status
 */
export function handleLoginError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.response?.data?.error;
    
    // Handle specific cases from external API
    if (error.response?.status === 403) {
      // Account status errors
      if (message?.includes('pending approval')) {
        toast.error('Your mentor account is pending approval. Please wait for admin verification.');
      } else if (message?.includes('rejected')) {
        toast.error('Your mentor account has been rejected. Please contact support.');
      } else if (message?.includes('not verified')) {
        toast.error('Please verify your account via the email we sent you.');
      } else if (message?.includes('suspended')) {
        toast.error('Your account has been suspended. Please contact support.');
      } else if (message?.includes('banned')) {
        toast.error('Your account has been banned. Please contact support.');
      } else {
        toast.error(message || 'Access denied. Please check your account status.');
      }
    } else if (error.response?.status === 401) {
      toast.error(message || 'Invalid credentials. Please try again.');
    } else if (error.response?.status === 400) {
      toast.error(message || 'Invalid request. Please check your input.');
    } else {
      toast.error(message || 'An error occurred. Please try again.');
    }
    
    console.error("Login failed:", {
      status: error.response?.status,
      data: error.response?.data,
    });
  } else {
    toast.error("An unexpected error occurred. Please try again.");
    console.error("Login failed:", error);
  }
}

/**
 * Redirect user based on their role
 */
export function redirectByRole(role: string, router: AppRouterInstance) {
  switch (role) {
    case "learner":
      toast.success("Logged in as learner. Redirecting...");
      router.replace("/learner");
      break;
    case "mentor":
      toast.success("Logged in as mentor. Redirecting...");
      router.replace("/mentor");
      break;
    case "admin":
      toast.success("Logged in as admin. Redirecting...");
      router.replace("/admin");
      break;
    default:
      router.replace("/auth/signup");
  }
}
