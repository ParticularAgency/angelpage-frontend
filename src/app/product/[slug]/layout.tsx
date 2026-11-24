import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { isMongoObjectId } from '@/lib/slugs';
import {
  buildOgDescription,
  buildProductUrlForSlug,
} from '@/utils/buildProductShareMessage';
import { fetchProductDetails } from '@/lib/server-api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductDetails(slug);

  if (!product?.name) {
    return {
      title: 'Product | Angelpage',
      description: 'Shop pre-loved items and support charity on Angelpage.',
    };
  }

  const canonicalSlug = product.slug || slug;
  const pageUrl = buildProductUrlForSlug(canonicalSlug);
  const imageUrl = product.images?.[0]?.url;
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

  return {
    title: `${product.name} | Angelpage`,
    description,
    openGraph: {
      title: product.name,
      description,
      url: pageUrl,
      siteName: 'Angelpage',
      type: 'website',
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: product.name,
              width: 1200,
              height: 630,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
    ...(isMongoObjectId(slug) && product.slug
      ? { alternates: { canonical: pageUrl } }
      : {}),
  };
}

export default function ProductLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
