import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/siteSeo';

export const metadata: Metadata = pageMetadata({
  title: 'Create an account',
  description:
    'Create an Angelpage account to sell pre-loved goods for a charity.',
  path: '/auth/register',
  noindex: true,
});

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return children;
}
