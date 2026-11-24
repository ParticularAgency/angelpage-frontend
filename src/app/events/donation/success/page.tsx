'use client';

import React, { Suspense } from 'react';
import EventDonationSuccessClient from '@/components/features/events/EventDonationSuccessClient';
import { Loader2 } from 'lucide-react';

function SuccessFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary-color-100" />
    </div>
  );
}

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <EventDonationSuccessClient />
    </Suspense>
  );
}
