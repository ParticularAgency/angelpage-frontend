import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/siteSeo';

export const metadata: Metadata = pageMetadata({
  title: 'Sign in',
  description: 'Sign in to Angelpage to shop, sell, and support a charity.',
  path: '/auth/login',
  noindex: true,
});

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
