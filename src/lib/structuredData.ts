// Structured Data utilities for SEO
// JSON-LD schemas for better search engine understanding

export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
  contactPoint?: {
    '@type': string;
    contactType: string;
    email?: string;
  };
}

export interface WebsiteSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  description: string;
  potentialAction?: {
    '@type': string;
    target: string;
    'query-input': string;
  };
}

export interface BreadcrumbSchema {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item?: string;
  }>;
}

export interface EducationalOrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  serviceType: string;
  areaServed: string;
  availableChannel?: {
    '@type': string;
    serviceUrl: string;
  };
}

/**
 * Organization Schema - Main website entity
 */
export function getOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'CCSPals',
    url: 'https://ccspals.com',
    logo: 'https://ccspals.com/img/logo_gccoed.png',
    description: 'CCSPals is a peer-assisted educational platform connecting learners with mentors for academic success.',
    sameAs: [
      // Add your social media URLs when available
      // 'https://facebook.com/ccspals',
      // 'https://twitter.com/ccspals',
      // 'https://linkedin.com/company/ccspals',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      // email: 'support@ccspals.com',
    },
  };
}

/**
 * Website Schema - Website structure
 */
export function getWebsiteSchema(): WebsiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CCSPals',
    url: 'https://ccspals.com',
    description: 'Peer-assisted educational platform connecting learners with mentors',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://ccspals.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Breadcrumb Schema Generator
 */
export function getBreadcrumbSchema(items: Array<{ name: string; url?: string }>): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}

/**
 * Educational Service Schema
 */
export function getEducationalServiceSchema(): EducationalOrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Peer Tutoring Services',
    description: 'Connect with peer tutors and mentors for personalized learning support',
    url: 'https://ccspals.com',
    serviceType: 'Educational Services',
    areaServed: 'Online',
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: 'https://ccspals.com',
    },
  };
}

/**
 * Helper function to inject structured data into page
 */
export function renderStructuredData(schema: object): string {
  return JSON.stringify(schema);
}
