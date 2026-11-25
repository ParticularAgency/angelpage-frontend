import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/siteSeo';

export const metadata: Metadata = pageMetadata({
  title: 'Messages',
  description: 'Your Angelpage messages.',
  path: '/messaging/chat',
  noindex: true,
});

export default function MessagingLayout({ children }: { children: ReactNode }) {
  return children;
}
