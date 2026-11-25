import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/siteSeo';

export const metadata: Metadata = pageMetadata({
  title: 'Bulk list',
  description: 'List several pre-loved items on Angelpage.',
  path: '/product/bulk-list',
  noindex: true,
});

export default function BulkListLayout({ children }: { children: ReactNode }) {
  return children;
}
