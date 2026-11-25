import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import { fetchProductDetails, serverFetch } from '@/lib/server-api';
import { absoluteUrl, pageMetadata } from '@/lib/siteSeo';
import {
  breadcrumbNode,
  graph,
  webPageNode,
  type Crumb,
} from '@/lib/seoSchema';
import {
  buildOgDescription,
  buildProductUrlForSlug,
} from '@/utils/buildProductShareMessage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductDetails(slug);

  if (!product?.name) {
    return pageMetadata({
      title: 'Product',
      description: 'Shop pre-loved items and support charity on Angelpage.',
      path: `/product/${slug}`,
      keywords: ['Angelpage product', 'pre-loved', 'charity marketplace'],
    });
  }

  const canonicalSlug = product.slug || slug;
  const description = buildOgDescription({
    productId: String(product._id || product.id || slug),
    slug: canonicalSlug,
    name: product.name,
    price: Number(product.price) || 0,
    charityProfit: product.charityProfit,
    charityName:
      product.charity?.charityName || product.selectCharityName || 'charity',
    description: product.additionalInfo || product.description,
    condition: product.condition,
    brand: product.brand,
    material: product.material,
    color: product.color,
    size: product.size,
    category: product.category,
  });

  return pageMetadata({
    title: product.name,
    description,
    path: `/product/${canonicalSlug}`,
    image: product.images?.[0]?.url,
    keywords: [
      product.name,
      product.brand,
      product.category,
      product.charity?.charityName || product.selectCharityName,
      'pre-loved',
      'Angelpage',
      'charity marketplace',
    ].filter((item): item is string => Boolean(item)),
  });
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProductDetails(slug);
  if (!product?.name) return children;

  const canonicalSlug = product.slug || slug;
  const path = `/product/${canonicalSlug}`;
  const url = buildProductUrlForSlug(canonicalSlug);
  const description =
    product.additionalInfo || product.description || product.name;
  const condition = /new/i.test(product.condition || '')
    ? 'https://schema.org/NewCondition'
    : 'https://schema.org/UsedCondition';
  const crumbs: Crumb[] = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/product' },
  ];
  if (product.category) {
    crumbs.push({
      name: product.category,
      path: `/product?category=${encodeURIComponent(String(product.category))}`,
    });
  }
  crumbs.push({ name: product.name, path });

  const productId = String(product._id || product.id || '');
  const reviewData = productId
    ? await serverFetch<{
        summary?: { averageRating?: number; reviewCount?: number };
        reviews?: Array<{
          rating?: number;
          comment?: string;
          createdAt?: string;
          user?: { firstName?: string; lastName?: string };
        }>;
      }>(`/products/${productId}/reviews`, {
        revalidate: 300,
        tags: [`reviews-${productId}`],
      })
    : null;
  const reviewCount = Number(reviewData?.summary?.reviewCount || 0);
  const averageRating = Number(reviewData?.summary?.averageRating || 0);
  const reviews = (reviewData?.reviews ?? [])
    .filter(review => review.comment && Number(review.rating) > 0)
    .slice(0, 8)
    .map(review => ({
      '@type': 'Review',
      reviewBody: review.comment,
      datePublished: review.createdAt,
      author: {
        '@type': 'Person',
        name:
          [review.user?.firstName, review.user?.lastName]
            .filter(Boolean)
            .join(' ') || 'Angelpage buyer',
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: Number(review.rating),
        bestRating: 5,
        worstRating: 1,
      },
    }));

  const productSchema: Record<string, unknown> = {
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    description,
    url,
    image: (product.images ?? []).map(image => image.url).filter(Boolean),
    sku: productId || canonicalSlug,
    category: product.category,
    mainEntityOfPage: absoluteUrl(path),
    brand: product.brand
      ? { '@type': 'Brand', name: product.brand }
      : undefined,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'USD',
      price: Number(product.price || 0).toFixed(2),
      availability: 'https://schema.org/InStock',
      itemCondition: condition,
      seller: { '@type': 'Organization', name: 'Angelpage' },
    },
  };
  if (reviewCount > 0 && averageRating > 0 && averageRating <= 5) {
    productSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: averageRating,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }
  if (reviews.length) productSchema.review = reviews;

  return (
    <>
      <JsonLd
        data={graph([
          webPageNode({ title: product.name, description, path, crumbs }),
          breadcrumbNode(crumbs),
          productSchema,
        ])}
      />
      <nav aria-label="Breadcrumb" className="custom-container pt-8">
        <ol className="flex flex-wrap items-center gap-2 font-secondary text-sm text-[#3B055C]">
          {crumbs.map((crumb, index) => {
            const last = index === crumbs.length - 1;
            return (
              <li
                key={`${crumb.path}-${crumb.name}`}
                className="flex items-center gap-2"
              >
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {last ? (
                  <span className="text-[#0B0112]">{crumb.name}</span>
                ) : (
                  <Link href={crumb.path} className="text-[#611192] underline">
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      {children}
    </>
  );
}
