import type { Metadata } from 'next';
import React from 'react';
import BlogListClient from '@/components/features/blog/BlogListClient';
import { fetchBlogPosts } from '@/lib/server-api';
import SeoTrail from '@/components/seo/SeoTrail';
import { pageMetadata } from '@/lib/siteSeo';
import HydrateQuery from '@/store/HydrateQuery';

export const metadata: Metadata = pageMetadata({
  title: 'Blog',
  description:
    'Stories from Angelpage, the charity marketplace for pre-loved goods in the USA, Canada, and the UK.',
  path: '/blog',
  keywords: ['Angelpage blog', 'charity stories', 'pre-loved'],
});

export const revalidate = 300;

export default async function BlogPage() {
  const initialPosts = await fetchBlogPosts();
  return (
    <>
      <SeoTrail
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
        ]}
        title="Blog"
        description="Stories from Angelpage, the charity marketplace for pre-loved goods in the USA, Canada, and the UK."
      />
      <HydrateQuery
        entries={[
          { endpointName: 'getBlogPosts', arg: {}, data: initialPosts },
        ]}
      />
      <BlogListClient initialPosts={initialPosts} />
    </>
  );
}
