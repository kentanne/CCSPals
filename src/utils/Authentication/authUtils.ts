import { LoginCredentials } from '@/interfaces/Authentication/authInterfaces';

export const validateCredentials = (credentials: LoginCredentials): string | null => {
  if (!credentials.iniCred?.trim()) return "Please enter your login and password.";
  if (!credentials.password?.trim()) return "Please enter your login and password.";
  return null;
};

export const sanitizeCredentials = (iniCred: string, password: string): LoginCredentials => {
  return { iniCred: iniCred.trim(), password };
};