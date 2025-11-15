import AuthLayout from '@/components/molecules/Authentication/login/AuthLayout';
import LoginForm from '@/components/molecules/Authentication/login/LoginForm';

export default function Login() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}