import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import JsonLd from '@/components/seo/JsonLd';
import { fetchCharitiesPage } from '@/lib/server-api';
import { absoluteUrl, pageMetadata } from '@/lib/siteSeo';
import { breadcrumbNode, graph, webPageNode } from '@/lib/seoSchema';

async function loadStore(storefrontId: string) {
  const data = await fetchCharitiesPage(1, 100, '');
  return (
    data?.charities?.find(item => item.storefrontId === storefrontId) ?? null
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storefrontid: string }>;
}): Promise<Metadata> {
  const { storefrontid } = await params;
  const charity = await loadStore(storefrontid);
  const name = charity?.charityName || 'Charity store';

  return pageMetadata({
    title: name,
    description:
      charity?.description ||
      `${name} on Angelpage. Shop pre-loved goods and send most of each sale to this charity.`,
    path: `/charity/store/${storefrontid}`,
    image: charity?.profileImage,
    keywords: [name, 'charity store', 'Angelpage', 'pre-loved'],
  });
}

export default async function StorefrontLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ storefrontid: string }>;
}) {
  const { storefrontid } = await params;
  const charity = await loadStore(storefrontid);
  const name = charity?.charityName || 'Charity store';

  return (
    <>
      <JsonLd
        data={graph([
          webPageNode({
            title: name,
            description:
              charity?.description ||
              `${name} on Angelpage. Shop pre-loved goods and send most of each sale to this charity.`,
            path: `/charity/store/${storefrontid}`,
            crumbs: [
              { name: 'Home', path: '/' },
              { name: 'Find a charity', path: '/charity/find-a-charity' },
              { name, path: `/charity/store/${storefrontid}` },
            ],
          }),
          breadcrumbNode([
            { name: 'Home', path: '/' },
            { name: 'Find a charity', path: '/charity/find-a-charity' },
            { name, path: `/charity/store/${storefrontid}` },
          ]),
          {
            '@type': 'Store',
            name,
            description: charity?.description,
            image: charity?.profileImage,
            url: absoluteUrl(`/charity/store/${storefrontid}`),
          },
        ])}
      />
      {children}
    </>
  );
}
