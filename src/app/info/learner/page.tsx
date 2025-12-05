import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const LearnerInfoForm = dynamic(() => import('@/components/organisms/forms/LearnerInfoForm/page'), {
  loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>Loading form...</div>,
  ssr: false
});

export const metadata: Metadata = {
  title: 'Learner Information - CCSPals',
  description: 'Learn how to get started as a learner on CCSPals. Find mentors, book sessions, and achieve your academic goals with peer support.',
  keywords: ['learner guide', 'how to learn', 'peer tutoring', 'find mentors', 'academic help', 'student guide', 'tutoring tips'],
  alternates: {
    canonical: 'https://ccspals.com/info/learner',
  },
  openGraph: {
    title: 'Learner Guide - CCSPals',
    description: 'Learn how to make the most of CCSPals as a learner',
    type: 'article',
    url: 'https://ccspals.com/info/learner',
  },
  twitter: {
    card: 'summary',
    title: 'Learner Guide - CCSPals',
    description: 'Learn how to make the most of CCSPals as a learner',
  },
};

// Revalidate every hour (3600 seconds) - ISR
export const revalidate = 3600;

export default function LearnerInfoPage() {
  return <LearnerInfoForm />;
}
