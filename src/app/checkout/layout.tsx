import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/siteSeo';

export const metadata: Metadata = pageMetadata({
  title: 'Checkout',
  description: 'Checkout on Angelpage.',
  path: '/checkout',
  noindex: true,
});

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return children;
}
