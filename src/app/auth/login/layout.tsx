import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - CCSPals',
  description: 'Sign in to your CCSPals account to access peer tutoring sessions, connect with mentors, and manage your learning schedule.',
  keywords: ['login', 'sign in', 'CCSPals login', 'student portal', 'tutoring login'],
  alternates: {
    canonical: 'https://ccspals.com/auth/login',
  },
  openGraph: {
    title: 'Login - CCSPals Tutoring Platform',
    description: 'Sign in to access your tutoring sessions and connect with peer mentors',
    type: 'website',
    url: 'https://ccspals.com/auth/login',
  },
  twitter: {
    card: 'summary',
    title: 'Login - CCSPals',
    description: 'Sign in to access your tutoring sessions',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
