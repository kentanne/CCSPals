import { Metadata } from 'next';
import HomeClient from './HomeClient';
import styles from './page.module.css';
import { getOrganizationSchema, getWebsiteSchema, renderStructuredData } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: 'Home - CCSPals Peer Tutoring',
  description: 'CCSPals is a peer-assisted educational platform connecting learners with mentors. Join us to boost your knowledge and sharpen your skills in subjects that matter to you.',
  keywords: ['peer tutoring', 'education', 'learning', 'mentorship', 'CCSPals', 'academic support', 'online tutoring', 'study help'],
  alternates: {
    canonical: 'https://ccspals.com',
  },
  openGraph: {
    title: 'CCSPals - Peer-Assisted Educational Sessions',
    description: 'Connect with peer tutors and mentors to enhance your learning experience',
    type: 'website',
    url: 'https://ccspals.com',
    images: [
      {
        url: '/img/logo_gccoed.png',
        width: 1200,
        height: 630,
        alt: 'CCSPals Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CCSPals - Peer Tutoring Platform',
    description: 'Connect with peer tutors and mentors to enhance your learning experience',
    images: ['/img/logo_gccoed.png'],
  },
};

export default function Home() {
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderStructuredData(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderStructuredData(websiteSchema) }}
      />
      
      <div className={styles.homeContainer}>
        <HomeClient />
      </div>
    </>
  );
}
