import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css';
import '@/styles/styles.css';
import ClientProviders from '@/utils/Provider';
import AppShell from './AppShell';
import GoogleTags from '@/components/seo/GoogleTags';
import JsonLd from '@/components/seo/JsonLd';
import { LOCALE_COOKIE, type Locale } from '@/i18n/messages';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  INDEXABLE,
  SITE_NAME,
  SITE_URL,
  organizationGraph,
} from '@/lib/siteSeo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'shopping',
  manifest: '/site.webmanifest',
  verification: {
    google: 'p4xrO9_m2Ysbz7A1kRew8wp8HkRurv6KxEUfK8hEqv8',
  },
  icons: { icon: '/images/favicon.png', apple: '/images/favicon.png' },
  alternates: { canonical: `${SITE_URL}/` },
  robots: INDEXABLE
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
    : { index: false, follow: false },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    images: [{ url: DEFAULT_OG_IMAGE, alt: DEFAULT_TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale: Locale =
    cookieStore.get(LOCALE_COOKIE)?.value === 'fr' ? 'fr' : 'en';

  return (
    <html lang={locale}>
      <body className="angelpage-body-wrapper-area">
        <GoogleTags />
        <JsonLd data={organizationGraph()} />
        <ClientProviders locale={locale}>
          <AppShell>{children}</AppShell>
        </ClientProviders>
      </body>
    </html>
  );
}
