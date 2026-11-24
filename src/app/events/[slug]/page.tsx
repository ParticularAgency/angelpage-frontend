import type { Metadata } from 'next';
import EventDetailClient from '@/components/features/events/EventDetailClient';
import { fetchEventBySlug } from '@/lib/server-api';
import HydrateQuery from '@/store/HydrateQuery';

export const revalidate = 120;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);

  if (!event?.title) {
    return { title: 'Event | Angelpage' };
  }

  return {
    title: `${event.title} | Angelpage Events`,
    description: event.excerpt,
    openGraph: {
      title: event.title,
      description: event.excerpt,
      images: event.coverImage ? [{ url: event.coverImage }] : [],
    },
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const initialEvent = await fetchEventBySlug(slug);

  return (
    <>
      {initialEvent ? (
        <HydrateQuery
          entries={[
            {
              endpointName: 'getEventBySlug',
              arg: slug,
              data: initialEvent,
            },
          ]}
        />
      ) : null}
      <EventDetailClient slug={slug} initialEvent={initialEvent} />
    </>
  );
}
