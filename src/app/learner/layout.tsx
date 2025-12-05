import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learner Dashboard - CCSPals',
  description: 'Manage your tutoring sessions, find mentors, and track your learning progress.',
  robots: {
    index: false, // Don't index private pages
    follow: false,
    noarchive: true,
    nocache: true,
  },
};

export default function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
