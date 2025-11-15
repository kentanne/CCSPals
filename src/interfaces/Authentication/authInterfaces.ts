export interface LoginCredentials {
  iniCred: string;
  password: string;
}

export interface ForgotPasswordStep1Data {
  identifier: string;
}

export interface ForgotPasswordStep2Data {
  pre_cred: string;
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ForgotPasswordState {
  step: number;
  loading: boolean;
  error: string;
  success: string;
}

export interface User {
  id: string;
  username?: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token?: string;
  userRole?: string;
  user?: User;
  message?: string;
}

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
}