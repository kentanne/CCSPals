export const AUTH_CONSTANTS = {
  // Add ROUTES object
  ROUTES: {
    LEARNER: "/learner",
    MENTOR: "/mentor", 
    ADMIN: "/admin",
    SIGNUP: "/auth/signup",
    FORGOT_PASSWORD: "/pages/Authentication/forgot-password",
    LOGIN: "/auth/login"
  },
  
  ROLES: ["learner", "mentor"] as const,
  MESSAGES: {
    WELCOME_BACK: (username?: string) => `Welcome back${username ? `, ${username}` : ''}!`,
    LOGIN_SUCCESS: (role: string) => `Logged in as ${role}. Redirecting...`,
    COMPLETE_PROFILE: "Please complete your profile to continue.",
    INVALID_CREDENTIALS: "Invalid credentials. Please try again.",
    UNEXPECTED_ERROR: "An unexpected error occurred. Please try again.",
    IDENTIFIER_REQUIRED: "Please enter your email, ID number, or account name",
    FIELDS_REQUIRED: "Please fill in all required fields",
    RESET_LINK_SENT: "Password reset link sent!",
    VERIFICATION_FAILED: "Verification failed"
  },
  PLACEHOLDERS: {
    IDENTIFIER: "Enter your Login Credential",
    ID_NUMBER: "ID Number",
    FULL_NAME: "Full Name", 
    EMAIL: "Email",
    ROLE: "Select Primary Role"
  }
};