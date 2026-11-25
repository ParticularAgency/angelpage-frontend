import type { MetadataRoute } from 'next';
import { categoriesData } from '@/libs/categoriesData';
import { absoluteUrl } from '@/lib/siteSeo';
import {
  fetchBlogPosts,
  fetchCharitiesPage,
  fetchEvents,
  serverFetch,
} from '@/lib/server-api';

const STATIC_PATHS = [
  '/',
  '/about',
  '/faq',
  '/how-it-works',
  '/contact',
  '/product',
  '/blog',
  '/events',
  '/reels',
  '/charity/find-a-charity',
  '/privacy-policy',
  '/cookie-policy',
  '/cookie-settings',
  '/terms-of-service',
];

function entry(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  priority: number,
  lastModified?: string
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    changeFrequency,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = STATIC_PATHS.map(path =>
    entry(path, path === '/' ? 'daily' : 'weekly', path === '/' ? 1 : 0.7)
  );

  for (const category of categoriesData.categories) {
    pages.push(entry(`/product?category=${category.id}`, 'daily', 0.6));
  }

  const [products, posts, events, charities] = await Promise.all([
    serverFetch<{
      products?: { slug?: string; _id?: string; updatedAt?: string }[];
    }>('/products/all', { revalidate: 3600, params: { isArchived: false } }),
    fetchBlogPosts(),
    fetchEvents(),
    fetchCharitiesPage(1, 100, ''),
  ]);

  for (const product of products?.products ?? []) {
    const slug = product.slug || product._id;
    if (!slug) continue;
    pages.push(entry(`/product/${slug}`, 'daily', 0.8, product.updatedAt));
  }

  for (const post of posts) {
    if (!post.slug) continue;
    pages.push(entry(`/blog/${post.slug}`, 'weekly', 0.6, post.publishedAt));
  }

  for (const event of events) {
    if (!event.slug) continue;
    pages.push(entry(`/events/${event.slug}`, 'daily', 0.7, event.startAt));
  }

  for (const charity of charities?.charities ?? []) {
    if (charity._id) {
      pages.push(
        entry(`/charity/find-a-charity/${charity._id}`, 'weekly', 0.5)
      );
    }
    if (charity.storefrontId) {
      pages.push(
        entry(`/charity/store/${charity.storefrontId}`, 'weekly', 0.6)
      );
    }
  }

  return pages;
}
