import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password - CCSPals',
  description: 'Create a new password for your CCSPals account.',
  robots: {
    index: false, // Don't index password reset pages
    follow: false,
  },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
