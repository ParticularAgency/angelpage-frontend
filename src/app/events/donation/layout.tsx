import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/siteSeo';

export const metadata: Metadata = pageMetadata({
  title: 'Donation',
  description: 'Your Angelpage event donation.',
  path: '/events/donation/success',
  noindex: true,
});

export default function DonationLayout({ children }: { children: ReactNode }) {
  return children;
}
