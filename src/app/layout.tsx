import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css';
import '@/styles/styles.css';
import ClientProviders from '@/utils/Provider';
import AppShell from './AppShell';
import { LOCALE_COOKIE, type Locale } from '@/i18n/messages';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXTAUTH_URL || 'https://www.angelpage.co.uk'
  ),
  title: 'Angelpage | Charity marketplace starting in the USA',
  description:
    'Angelpage is a charity marketplace that starts in the United States and also sells in Canada and the United Kingdom. Buy and sell pre-loved goods and send most of each sale to a charity.',
  icons: { icon: '/images/favicon.png', apple: '/images/favicon.png' },
  robots:
    process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true'
      ? { index: true, follow: true }
      : { index: false, follow: false },
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
        <ClientProviders locale={locale}>
          <AppShell>{children}</AppShell>
        </ClientProviders>
      </body>
    </html>
  );
}
