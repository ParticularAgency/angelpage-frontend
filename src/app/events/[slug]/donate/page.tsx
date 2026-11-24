import { Suspense } from 'react';
import EventDonationCheckoutClient from '@/components/features/events/EventDonationCheckoutClient';
import { fetchEventBySlug } from '@/lib/server-api';
import DonatePageLoading from './DonatePageLoading';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EventDonatePage({ params }: PageProps) {
  const { slug } = await params;
  const initialEvent = await fetchEventBySlug(slug);

  return (
    <Suspense fallback={<DonatePageLoading />}>
      <EventDonationCheckoutClient slug={slug} initialEvent={initialEvent} />
    </Suspense>
  );
}
