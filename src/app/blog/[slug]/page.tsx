import type { Metadata } from 'next';
import BlogDetailClient from '@/components/features/blog/BlogDetailClient';
import JsonLd from '@/components/seo/JsonLd';
import { isMongoObjectId } from '@/lib/slugs';
import { fetchBlogBySlug } from '@/lib/server-api';
import { absoluteUrl, pageMetadata, SITE_NAME } from '@/lib/siteSeo';
import {
  breadcrumbNode,
  graph,
  webPageNode,
  type Crumb,
} from '@/lib/seoSchema';
import HydrateQuery from '@/store/HydrateQuery';
import { redirect } from 'next/navigation';

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogBySlug(slug);

  if (!post?.title) {
    return pageMetadata({
      title: 'Blog',
      description: 'Stories from the Angelpage charity marketplace.',
      path: `/blog/${slug}`,
    });
  }

  return pageMetadata({
    title: post.title,
    description:
      post.excerpt || 'A story from the Angelpage charity marketplace.',
    path: `/blog/${post.slug || slug}`,
    image: post.coverImage,
    type: 'article',
    keywords: [
      post.title,
      post.category || 'stories',
      'Angelpage blog',
      'charity marketplace',
    ],
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const initialPost = await fetchBlogBySlug(slug);

  if (initialPost?.slug && isMongoObjectId(slug) && slug !== initialPost.slug) {
    redirect(`/blog/${initialPost.slug}`);
  }

  const querySlug = initialPost?.slug || slug;

  const articleSchema = initialPost?.title
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: initialPost.title,
        description: initialPost.excerpt,
        image: initialPost.coverImage ? [initialPost.coverImage] : undefined,
        datePublished: initialPost.publishedAt,
        author: {
          '@type': 'Person',
          name: initialPost.authorName || SITE_NAME,
        },
        publisher: { '@type': 'Organization', name: SITE_NAME },
        mainEntityOfPage: absoluteUrl(`/blog/${querySlug}`),
      }
    : null;

  return (
    <>
      {articleSchema ? (
        <JsonLd
          data={graph([
            webPageNode({
              title: initialPost?.title || 'Blog',
              description:
                initialPost?.excerpt ||
                'A story from the Angelpage charity marketplace.',
              path: `/blog/${querySlug}`,
              crumbs: [
                { name: 'Home', path: '/' },
                { name: 'Blog', path: '/blog' },
                {
                  name: initialPost?.title || 'Blog',
                  path: `/blog/${querySlug}`,
                },
              ] satisfies Crumb[],
            }),
            breadcrumbNode([
              { name: 'Home', path: '/' },
              { name: 'Blog', path: '/blog' },
              {
                name: initialPost?.title || 'Blog',
                path: `/blog/${querySlug}`,
              },
            ]),
            articleSchema,
          ])}
        />
      ) : null}
      {initialPost ? (
        <HydrateQuery
          entries={[
            {
              endpointName: 'getBlogBySlug',
              arg: querySlug,
              data: initialPost,
            },
          ]}
        />
      ) : null}
      <BlogDetailClient slug={querySlug} initialPost={initialPost} />
    </>
  );
}
