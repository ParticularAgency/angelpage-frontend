import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/siteSeo';

export const metadata: Metadata = pageMetadata({
  title: 'Charity account',
  description: 'Your Angelpage charity account.',
  path: '/charity/account',
  noindex: true,
});

export default function CharityAccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
