import ReelsFeedClient, { type ReelItem } from '@/components/gallery/ReelsFeedClient';
import type { ReelsFilterParams } from '@/lib/slugs';
import { serverFetch } from '@/lib/server-api';
import { Suspense } from 'react';
import FullScreenLoader from '@/components/common/loading/FullScreenLoader';

export const revalidate = 120;

type PageProps = {
  searchParams: Promise<ReelsFilterParams>;
};

async function fetchReels(filters: ReelsFilterParams): Promise<ReelItem[]> {
  const data = await serverFetch<{ items: ReelItem[] }>('/gallery', {
    revalidate: 120,
    params: {
      limit: 24,
      ...(filters.kind ? { kind: filters.kind } : {}),
      ...(filters.tag ? { tag: filters.tag } : {}),
      ...(filters.charityId ? { charityId: filters.charityId } : {}),
    },
  });
  return data?.items || [];
}

function ReelsLoading() {
  return (
    <FullScreenLoader label="Loading stories" tone="dark" />
  );
}

export default async function ReelsPage({ searchParams }: PageProps) {
  const filters = await searchParams;
  const items = await fetchReels(filters);

  return (
    <main>
      <Suspense fallback={<ReelsLoading />}>
        <ReelsFeedClient initialItems={items} initialFilters={filters} />
      </Suspense>
    </main>
  );
}
