import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const MentorInfoForm = dynamic(() => import('@/components/organisms/forms/MentorInfoForm/page'), {
  loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>Loading form...</div>,
  ssr: false
});

export const metadata: Metadata = {
  title: 'Mentor Information - CCSPals',
  description: 'Learn how to become a mentor on CCSPals. Share your knowledge, help fellow students, and develop leadership skills through peer tutoring.',
  keywords: ['mentor guide', 'become a tutor', 'peer mentoring', 'teaching skills', 'help students', 'tutoring guide', 'mentor tips'],
  alternates: {
    canonical: 'https://ccspals.com/info/mentor',
  },
  openGraph: {
    title: 'Mentor Guide - CCSPals',
    description: 'Learn how to make a difference as a mentor on CCSPals',
    type: 'article',
    url: 'https://ccspals.com/info/mentor',
  },
  twitter: {
    card: 'summary',
    title: 'Mentor Guide - CCSPals',
    description: 'Learn how to make a difference as a mentor on CCSPals',
  },
};

// Revalidate every hour (3600 seconds) - ISR
export const revalidate = 3600;

export default function MentorInfoPage() {
  return <MentorInfoForm />;
}
