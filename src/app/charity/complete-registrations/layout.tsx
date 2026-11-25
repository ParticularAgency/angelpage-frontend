import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/siteSeo';

export const metadata: Metadata = pageMetadata({
  title: 'Complete registration',
  description: 'Finish your Angelpage charity registration.',
  path: '/charity/complete-registrations',
  noindex: true,
});

export default function CompleteRegistrationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
