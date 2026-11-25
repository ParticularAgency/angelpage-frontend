import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import JsonLd from '@/components/seo/JsonLd';
import { serverFetch, type CharityRecord } from '@/lib/server-api';
import { absoluteUrl, pageMetadata, SITE_URL } from '@/lib/siteSeo';
import { breadcrumbNode, graph, webPageNode } from '@/lib/seoSchema';

async function loadCharity(charityId: string) {
  const data = await serverFetch<{ charity?: CharityRecord }>(
    `/charity/charities/${charityId}`,
    { revalidate: 300, tags: [`charity-${charityId}`] }
  );
  return data?.charity ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ charityId: string }>;
}): Promise<Metadata> {
  const { charityId } = await params;
  const charity = await loadCharity(charityId);
  const name = charity?.charityName || 'Charity';

  return pageMetadata({
    title: name,
    description:
      charity?.description ||
      `${name} on Angelpage. Shop pre-loved goods and support this charity.`,
    path: `/charity/find-a-charity/${charityId}`,
    image: charity?.profileImage,
    keywords: [name, 'charity', 'Angelpage'],
  });
}

export default async function CharityDetailLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ charityId: string }>;
}) {
  const { charityId } = await params;
  const charity = await loadCharity(charityId);
  const name = charity?.charityName || 'Charity';

  return (
    <>
      <JsonLd
        data={graph([
          webPageNode({
            title: name,
            description:
              charity?.description ||
              `${name} on Angelpage. Shop pre-loved goods and support this charity.`,
            path: `/charity/find-a-charity/${charityId}`,
            crumbs: [
              { name: 'Home', path: '/' },
              { name: 'Find a charity', path: '/charity/find-a-charity' },
              { name, path: `/charity/find-a-charity/${charityId}` },
            ],
          }),
          breadcrumbNode([
            { name: 'Home', path: '/' },
            { name: 'Find a charity', path: '/charity/find-a-charity' },
            { name, path: `/charity/find-a-charity/${charityId}` },
          ]),
          {
            '@type': 'NGO',
            name,
            description: charity?.description,
            image: charity?.profileImage,
            url: absoluteUrl(`/charity/find-a-charity/${charityId}`),
            identifier: charity?.charityNumber,
            parentOrganization: { '@id': `${SITE_URL}/#organization` },
          },
        ])}
      />
      {children}
    </>
  );
}
