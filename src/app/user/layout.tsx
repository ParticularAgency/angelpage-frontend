import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/siteSeo';

export const metadata: Metadata = pageMetadata({
  title: 'Your account',
  description: 'Your Angelpage account.',
  path: '/user/account',
  noindex: true,
});

export default function UserLayout({ children }: { children: ReactNode }) {
  return children;
}
