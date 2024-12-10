// src/app/template.tsx
'use client';
// import { useReportWebVitals } from 'next/web-vitals';

import { Footer, Header } from '@/components';
import AuthProvider from '@utils/AuthProvider';
export default function Template({ children }: { children: React.ReactNode }) {
    //  useReportWebVitals(metric => {
    //    console.log(metric);
    //  });
  return (
    <AuthProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </AuthProvider>
  );
}
