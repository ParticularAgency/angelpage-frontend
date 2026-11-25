import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import FaqSection from '@/components/seo/FaqSection';
import SeoTrail from '@/components/seo/SeoTrail';
import { HOME_FAQS } from '@/lib/seoSchema';
import { pageMetadata } from '@/lib/siteSeo';

export const metadata: Metadata = pageMetadata({
  title: 'How it works',
  description:
    'See how Angelpage works: list a pre-loved item, shop the marketplace, watch reels, and join charity events. Most of each sale goes to a charity.',
  path: '/how-it-works',
  keywords: ['how Angelpage works', 'sell for charity', 'charity marketplace'],
});

const description =
  'See how Angelpage works: list a pre-loved item, shop the marketplace, watch reels, and join charity events. Most of each sale goes to a charity.';

export default function HowItWorksLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <SeoTrail
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'How it works', path: '/how-it-works' },
        ]}
        title="How it works"
        description={description}
        faqs={HOME_FAQS}
      />
      {children}
      <FaqSection items={HOME_FAQS} showAllLink />
    </>
  );
}
