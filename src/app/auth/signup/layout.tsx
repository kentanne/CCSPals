import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - CCSPals',
  description: 'Join CCSPals as a learner or mentor. Connect with peers for academic success through our peer-assisted educational platform.',
  keywords: ['sign up', 'register', 'join CCSPals', 'become a tutor', 'find tutors', 'student registration'],
  alternates: {
    canonical: 'https://ccspals.com/auth/signup',
  },
  openGraph: {
    title: 'Sign Up - CCSPals Tutoring Platform',
    description: 'Join our peer tutoring community as a learner or mentor',
    type: 'website',
    url: 'https://ccspals.com/auth/signup',
  },
  twitter: {
    card: 'summary',
    title: 'Sign Up - CCSPals',
    description: 'Join our peer tutoring community',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
