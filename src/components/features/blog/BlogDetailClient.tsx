'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/elements';
import { blogData } from '@/libs/blogs';
import { sanitizeHtml } from '@/lib/sanitize';
import type { BlogPostRecord } from '@/lib/server-api';
import { useGetBlogBySlugQuery } from '@/store/api/angelpageApi';
import FullScreenLoader from '@/components/common/loading/FullScreenLoader';

type BlogDetailClientProps = {
  slug: string;
  initialPost?: BlogPostRecord | null;
};

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export default function BlogDetailClient({
  slug,
  initialPost,
}: BlogDetailClientProps) {
  const { data: fetchedPost, isLoading } = useGetBlogBySlugQuery(slug, {
    skip: !slug,
  });

  const post = fetchedPost ?? initialPost;
  const staticMatch = blogData.find(b => b.id === slug);

  if (isLoading && !initialPost && !staticMatch) {
    return <FullScreenLoader label="Loading article" />;
  }

  const resolved =
    post ||
    (staticMatch
      ? ({
          title: staticMatch.title,
          excerpt: staticMatch.description,
          content: staticMatch.description,
          coverImage: staticMatch.image,
          authorName: 'Angelpage',
          category: staticMatch.tag,
        } as BlogPostRecord)
      : null);

  if (!resolved) {
    return (
      <section className="custom-container py-24 text-center">
        <h1 className="font-primary text-[40px] text-[#0B0112]">
          Blog post not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] text-[#6B686E]">
          This article may have been removed or is still under review.
        </p>
        <Link href="/blog" className="mt-6 inline-block">
          <Button variant="primary">Back to blog</Button>
        </Link>
      </section>
    );
  }

  const cover = resolved.coverImage || '/images/blog/blog1.jpg';
  const safeContent = sanitizeHtml(resolved.content || resolved.excerpt || '');
  const dateLabel = formatDate(resolved.publishedAt);

  return (
    <section className="bg-white pb-20">
      <div className="custom-container pt-8">
        <Link
          href="/blog"
          className="text-[13px] font-semibold tracking-[0.04em] text-[#611192]"
        >
          All stories
        </Link>

        <header className="relative mt-5 overflow-hidden rounded-3xl bg-[#3B055C]">
          <Image
            src={cover}
            alt={resolved.title}
            className="h-[460px] w-full object-cover sm:h-[280px]"
            width={1440}
            height={460}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3B055C] via-[#3B055C]/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 sm:p-5">
            {resolved.category ? (
              <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-white uppercase">
                {resolved.category}
              </span>
            ) : null}
            <h1 className="mt-3 max-w-3xl font-primary text-[44px] leading-tight text-white sm:text-[30px]">
              {resolved.title}
            </h1>
            {resolved.excerpt ? (
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/85">
                {resolved.excerpt}
              </p>
            ) : null}
          </div>
        </header>

        <div className="mt-10 grid grid-cols-12 gap-8 sm:grid-cols-1">
          <article className="col-span-8 sm:order-2 sm:col-span-full">
            <div
              className="text-[17px] leading-[1.75] text-[#0B0112] [&_a]:text-[#611192] [&_h2]:mt-8 [&_h2]:font-primary [&_h2]:text-[28px] [&_p]:mt-4"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />
          </article>

          <aside className="col-span-4 sm:order-1 sm:col-span-full">
            <div className="rounded-3xl bg-[#FCF2FF] p-6 sm:static sticky top-28">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-[#611192] uppercase">
                Written by
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Image
                  src={resolved.authorAvatar || '/images/blog/author.png'}
                  alt={resolved.authorName || 'Author'}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-primary text-[22px] leading-none text-[#0B0112]">
                    {resolved.authorName || 'Angelpage'}
                  </p>
                  {dateLabel ? (
                    <p className="mt-1 text-[13px] text-[#6B686E]">{dateLabel}</p>
                  ) : (
                    <p className="mt-1 text-[13px] text-[#6B686E]">Community</p>
                  )}
                </div>
              </div>
              <Link href="/blog" className="mt-6 block">
                <Button variant="primary" className="w-full rounded-full">
                  More stories
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
