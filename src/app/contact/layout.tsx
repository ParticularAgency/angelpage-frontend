import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import SeoTrail from '@/components/seo/SeoTrail';
import { pageMetadata } from '@/lib/siteSeo';

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description:
    'Contact Angelpage about the charity marketplace, a listing, an event, or your account.',
  path: '/contact',
  keywords: ['contact Angelpage', 'charity marketplace support'],
});

const description =
  'Contact Angelpage about the charity marketplace, a listing, an event, or your account.';

export default function ContactLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SeoTrail
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
        title="Contact"
        description={description}
      />
      {children}
    </>
  );
}
