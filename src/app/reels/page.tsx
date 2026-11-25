import type { Metadata } from 'next';
import ReelsFeedClient, {
  type ReelItem,
} from '@/components/gallery/ReelsFeedClient';
import SeoTrail from '@/components/seo/SeoTrail';
import { pageMetadata } from '@/lib/siteSeo';

export const metadata: Metadata = pageMetadata({
  title: 'Reels',
  description:
    'Watch short reels from the Angelpage community. Sellers, buyers, and charities share pre-loved goods.',
  path: '/reels',
  keywords: ['Angelpage reels', 'charity videos', 'pre-loved'],
});
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
  return <FullScreenLoader label="Loading stories" tone="dark" />;
}

export default async function ReelsPage({ searchParams }: PageProps) {
  const filters = await searchParams;
  const items = await fetchReels(filters);

  return (
    <main>
      <SeoTrail
        hideNav
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Reels', path: '/reels' },
        ]}
        title="Reels"
        description="Watch short reels from the Angelpage community. Sellers, buyers, and charities share pre-loved goods."
      />
      <Suspense fallback={<ReelsLoading />}>
        <ReelsFeedClient initialItems={items} initialFilters={filters} />
      </Suspense>
    </main>
  );
}
