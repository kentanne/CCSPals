import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password - CCSPals',
  description: 'Reset your CCSPals account password. Enter your email to receive password reset instructions.',
  robots: {
    index: false, // Don't index password reset pages
    follow: false,
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
