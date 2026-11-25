import type { Metadata } from 'next';
import React from 'react';
import FindCharityClient from '@/components/features/charity/FindCharityClient';
import { fetchCharitiesPage } from '@/lib/server-api';
import SeoTrail from '@/components/seo/SeoTrail';
import { pageMetadata } from '@/lib/siteSeo';
import HydrateQuery from '@/store/HydrateQuery';

export const metadata: Metadata = pageMetadata({
  title: 'Find a charity',
  description:
    'Find a charity on Angelpage and shop pre-loved goods that send most of each sale to that cause.',
  path: '/charity/find-a-charity',
  keywords: ['find a charity', 'Angelpage charities', 'shop for charity'],
});

export const revalidate = 300;

export default async function FindCharityPage() {
  const initialData = await fetchCharitiesPage(1, 12, '');
  return (
    <>
      <SeoTrail
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Find a charity', path: '/charity/find-a-charity' },
        ]}
        title="Find a charity"
        description="Find a charity on Angelpage and shop pre-loved goods that send most of each sale to that cause."
      />
      {initialData ? (
        <HydrateQuery
          entries={[
            {
              endpointName: 'getCharities',
              arg: { page: 1, limit: 12, search: '' },
              data: initialData,
            },
          ]}
        />
      ) : null}
      <FindCharityClient initialData={initialData} />
    </>
  );
}
