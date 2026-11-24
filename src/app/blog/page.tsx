import React from 'react';
import BlogListClient from '@/components/features/blog/BlogListClient';
import { fetchBlogPosts } from '@/lib/server-api';
import HydrateQuery from '@/store/HydrateQuery';

export const revalidate = 300;

export default async function BlogPage() {
  const initialPosts = await fetchBlogPosts();
  return (
    <>
      <HydrateQuery
        entries={[
          { endpointName: 'getBlogPosts', arg: {}, data: initialPosts },
        ]}
      />
      <BlogListClient initialPosts={initialPosts} />
    </>
  );
}
