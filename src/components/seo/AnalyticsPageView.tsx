'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { GA_MEASUREMENT_ID } from '@/lib/siteSeo';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function AnalyticsPageView() {
  const pathname = usePathname();
  const skipFirst = useRef(true);

  useEffect(() => {
    if (!pathname) return;
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'page_view',
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
    window.gtag?.('config', GA_MEASUREMENT_ID, { page_path: pathname });
  }, [pathname]);

  return null;
}
