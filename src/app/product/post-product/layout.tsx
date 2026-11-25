import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/siteSeo';

export const metadata: Metadata = pageMetadata({
  title: 'Sell an item',
  description:
    'List a pre-loved item on Angelpage and send most of the sale to a charity.',
  path: '/product/post-product',
  noindex: true,
});

export default function PostProductLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
