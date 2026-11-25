import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/siteSeo';

export const metadata: Metadata = pageMetadata({
  title: 'Favourites',
  description: 'Items you saved on Angelpage.',
  path: '/favourite',
  noindex: true,
});

export default function FavouriteLayout({ children }: { children: ReactNode }) {
  return children;
}
