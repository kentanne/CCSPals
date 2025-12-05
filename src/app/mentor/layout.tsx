import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentor Dashboard - CCSPals',
  description: 'Manage your tutoring sessions, connect with learners, and share your knowledge.',
  robots: {
    index: false, // Don't index private pages
    follow: false,
    noarchive: true,
    nocache: true,
  },
};

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
