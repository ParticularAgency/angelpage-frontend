import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import SeoTrail from '@/components/seo/SeoTrail';
import { pageMetadata } from '@/lib/siteSeo';

export const metadata: Metadata = pageMetadata({
  title: 'About',
  description:
    'Angelpage is where sellers are donors and buyers are givers. Every sale of pre-loved goods sends most of the money to a charity.',
  path: '/about',
  keywords: ['about Angelpage', 'charity marketplace', 'sellers are donors'],
});

const description =
  'Angelpage is where sellers are donors and buyers are givers. Every sale of pre-loved goods sends most of the money to a charity.';

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SeoTrail
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]}
        title="About"
        description={description}
      />
      {children}
    </>
  );
}
