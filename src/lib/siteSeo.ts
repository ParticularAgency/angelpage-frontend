import type { Metadata } from 'next';

export const SITE_NAME = 'Angelpage';
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.angelpage.shop'
).replace(/\/$/, '');
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-WP5JZ5K5';
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-Z789BPWQED';
export const GA_STREAM_ID = '16410278106';
export const GA_STREAM_NAME = 'E-commerce Charity Website';

export const INDEXABLE = process.env.NEXT_PUBLIC_ALLOW_INDEXING !== 'false';

export const DEFAULT_TITLE =
  'Angelpage | Charity marketplace starting in the USA';
export const DEFAULT_DESCRIPTION =
  'Angelpage is a charity marketplace that starts in the United States and also sells in Canada and the United Kingdom. Buy and sell pre-loved goods and send most of each sale to a charity.';

export const DEFAULT_KEYWORDS = [
  'Angelpage',
  'charity marketplace',
  'pre-loved goods',
  'sell for charity',
  'shop for charity',
  'United States',
  'Canada',
  'United Kingdom',
];

export const DEFAULT_OG_IMAGE = '/images/brand-logo-black.svg';

export function absoluteUrl(path = '/') {
  if (!path || path === '/') return `${SITE_URL}/`;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
};

function clip(text: string, max: number) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const word = cut.replace(/\s+\S*$/, '');
  return `${word || cut}…`;
}

export function pageMetadata({
  title,
  description,
  path,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_OG_IMAGE,
  noindex = false,
  type = 'website',
}: PageMetaInput): Metadata {
  const index = INDEXABLE && !noindex;
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;
  const url = absoluteUrl(path);
  const shareDescription = clip(description, 200);
  description = clip(description, 160);

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: index
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        }
      : { index: false, follow: false, nocache: true },
    openGraph: {
      title: fullTitle,
      description: shareDescription,
      url,
      siteName: SITE_NAME,
      type,
      locale: 'en_US',
      alternateLocale: ['en_GB', 'en_CA', 'fr_CA'],
      images: [{ url: image, alt: fullTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: shareDescription,
      images: [image],
    },
  };
}

export function organizationGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: absoluteUrl(DEFAULT_OG_IMAGE),
        description: DEFAULT_DESCRIPTION,
        areaServed: ['United States', 'Canada', 'United Kingdom'],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        inLanguage: 'en',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'OnlineStore',
        '@id': `${SITE_URL}/#store`,
        name: SITE_NAME,
        url: SITE_URL,
        description: DEFAULT_DESCRIPTION,
        currenciesAccepted: 'USD, CAD, GBP',
        areaServed: ['United States', 'Canada', 'United Kingdom'],
      },
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
