// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ccspals.com'),
  title: {
    default: 'CCSPals - Peer Tutoring Platform',
    template: '%s | CCSPals',
  },
  description: 'CCSPals is a peer-assisted educational platform connecting learners with mentors. Join our community to boost your knowledge and sharpen your skills in subjects that matter to you.',
  keywords: ['peer tutoring', 'online learning', 'mentorship', 'education platform', 'academic support', 'student tutoring', 'peer learning', 'study help'],
  authors: [{ name: 'CCSPals Team' }],
  creator: 'CCSPals',
  publisher: 'CCSPals',
  applicationName: 'CCSPals',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ccspals.com',
    siteName: 'CCSPals',
    title: 'CCSPals - Peer Tutoring Platform',
    description: 'Connect with peer tutors and mentors to enhance your learning experience. Join CCSPals today!',
    images: [
      {
        url: '/img/logo_gccoed.png',
        width: 1200,
        height: 630,
        alt: 'CCSPals Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CCSPals - Peer Tutoring Platform',
    description: 'Connect with peer tutors and mentors to enhance your learning experience',
    images: ['/img/logo_gccoed.png'],
    creator: '@ccspals',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  icons: {
    icon: '/img/logo_gccoed.png',
    apple: '/img/logo_gccoed.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/img/logo_gccoed.png" />
        <link rel="manifest" href="/manifest.json" />
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
      </head>
      <body suppressHydrationWarning /* optional: disable Grammarly */ data-gramm="false">
        {/* Skip link for keyboard users */}
        <a href="#main-content" className="skip-link">Skip to main content</a>
        {/* Ensure a single main landmark exists */}
        <main id="main-content" role="main">
          {/* Providers should already wrap within layout or pages */}
          <Providers>
            {children}
          </Providers>
          <ToastContainer />
        </main>
      </body>
    </html>
  );
}