import React from 'react';
import EventsConsoleListClient from '@/components/features/events/EventsConsoleListClient';
import { fetchEvents } from '@/lib/server-api';
import HydrateQuery from '@/store/HydrateQuery';

export const revalidate = 120;

export default async function EventsPage() {
  const initialEvents = await fetchEvents();
  return (
    <>
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
