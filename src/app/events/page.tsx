import type { Metadata } from 'next';
import React from 'react';
import EventsConsoleListClient from '@/components/features/events/EventsConsoleListClient';
import { fetchEvents } from '@/lib/server-api';
import SeoTrail from '@/components/seo/SeoTrail';
import { pageMetadata } from '@/lib/siteSeo';
import HydrateQuery from '@/store/HydrateQuery';

export const metadata: Metadata = pageMetadata({
  title: 'Events',
  description:
    'Give beside the shop. Angelpage events include charity appeals, community votes, and live moments.',
  path: '/events',
  keywords: ['Angelpage events', 'charity appeal', 'community vote'],
});

export const revalidate = 120;

export default async function EventsPage() {
  const initialEvents = await fetchEvents();
  return (
    <>
      <SeoTrail
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Events', path: '/events' },
        ]}
        title="Events"
        description="Give beside the shop. Angelpage events include charity appeals, community votes, and live moments."
      />
      <HydrateQuery
        entries={[
          {
            endpointName: 'getEvents',
            arg: { limit: 48 },
            data: initialEvents,
          },
        ]}
      />
      <EventsConsoleListClient initialEvents={initialEvents} />
    </>
  );
}
