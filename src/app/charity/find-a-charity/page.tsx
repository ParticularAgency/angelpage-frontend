import React from 'react';
import FindCharityClient from '@/components/features/charity/FindCharityClient';
import { fetchCharitiesPage } from '@/lib/server-api';
import HydrateQuery from '@/store/HydrateQuery';

export const revalidate = 300;

export default async function FindCharityPage() {
  const initialData = await fetchCharitiesPage(1, 12, '');
  return (
    <>
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
