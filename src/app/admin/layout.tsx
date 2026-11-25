import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/siteSeo';

export const metadata: Metadata = pageMetadata({
  title: 'Admin',
  description: 'Angelpage admin.',
  path: '/admin',
  noindex: true,
});

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
