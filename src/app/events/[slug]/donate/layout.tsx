import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/siteSeo';

export const metadata: Metadata = pageMetadata({
  title: 'Give',
  description: 'Give to an Angelpage charity event.',
  path: '/events',
  noindex: true,
});

export default function DonateLayout({ children }: { children: ReactNode }) {
  return children;
}
