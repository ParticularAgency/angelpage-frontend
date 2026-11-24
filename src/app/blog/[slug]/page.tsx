import type { Metadata } from 'next';
import BlogDetailClient from '@/components/features/blog/BlogDetailClient';
import { isMongoObjectId } from '@/lib/slugs';
import { fetchBlogBySlug } from '@/lib/server-api';
import HydrateQuery from '@/store/HydrateQuery';
import { redirect } from 'next/navigation';

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogBySlug(slug);

  if (!post?.title) {
    return { title: 'Blog | Angelpage' };
  }

  return {
    title: `${post.title} | Angelpage Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const initialPost = await fetchBlogBySlug(slug);

  if (
    initialPost?.slug &&
    isMongoObjectId(slug) &&
    slug !== initialPost.slug
  ) {
    redirect(`/blog/${initialPost.slug}`);
  }

  const querySlug = initialPost?.slug || slug;

  return (
    <>
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
