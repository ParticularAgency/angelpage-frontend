'use client';

import { Footer, Header } from '@/components';
import AuthProvider from '@utils/AuthProvider';

export default function Template({ children }: { children: React.ReactNode }) {

  return (
    <AuthProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </AuthProvider>
  );
}
