import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/siteSeo';

export const metadata: Metadata = pageMetadata({
  title: 'Home',
  description: 'Angelpage home.',
  path: '/internal-home',
  noindex: true,
});

export default function InternalHomeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
