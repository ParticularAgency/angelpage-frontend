import type { Metadata } from 'next';
import EventDetailClient from '@/components/features/events/EventDetailClient';
import JsonLd from '@/components/seo/JsonLd';
import { fetchEventBySlug } from '@/lib/server-api';
import { absoluteUrl, pageMetadata, SITE_NAME } from '@/lib/siteSeo';
import { breadcrumbNode, graph, webPageNode } from '@/lib/seoSchema';
import HydrateQuery from '@/store/HydrateQuery';

export const revalidate = 120;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);

  if (!event?.title) {
    return pageMetadata({
      title: 'Event',
      description: 'Charity events on Angelpage.',
      path: `/events/${slug}`,
    });
  }

  return pageMetadata({
    title: event.title,
    description: event.excerpt || 'A charity event on Angelpage.',
    path: `/events/${event.slug || slug}`,
    image: event.coverImage,
    keywords: [
      event.title,
      event.category || 'charity event',
      'Angelpage events',
    ],
  });
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const initialEvent = await fetchEventBySlug(slug);

  const eventSchema = initialEvent?.title
    ? {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: initialEvent.title,
        description: initialEvent.excerpt || initialEvent.description,
        image: initialEvent.coverImage ? [initialEvent.coverImage] : undefined,
        startDate: initialEvent.startAt,
        endDate: initialEvent.endAt,
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        url: absoluteUrl(`/events/${initialEvent.slug || slug}`),
        organizer: {
          '@type': 'Organization',
          name: initialEvent.authorName || SITE_NAME,
          url: absoluteUrl('/'),
        },
        location: {
          '@type': 'VirtualLocation',
          url: absoluteUrl(`/events/${initialEvent.slug || slug}`),
        },
      }
    : null;

  return (
    <>
      {eventSchema ? (
        <JsonLd
          data={graph([
            webPageNode({
              title: initialEvent?.title || 'Event',
              description:
                initialEvent?.excerpt || 'A charity event on Angelpage.',
              path: `/events/${initialEvent?.slug || slug}`,
              crumbs: [
                { name: 'Home', path: '/' },
                { name: 'Events', path: '/events' },
                {
                  name: initialEvent?.title || 'Event',
                  path: `/events/${initialEvent?.slug || slug}`,
                },
              ],
            }),
            breadcrumbNode([
              { name: 'Home', path: '/' },
              { name: 'Events', path: '/events' },
              {
                name: initialEvent?.title || 'Event',
                path: `/events/${initialEvent?.slug || slug}`,
              },
            ]),
            eventSchema,
          ])}
        />
      ) : null}
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
