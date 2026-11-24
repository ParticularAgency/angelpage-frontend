'use client';

import React from 'react';
import BlogList from '@/components/common/cards/blog/blogCards';
import { mapBlogToCard, type BlogPostRecord } from '@/lib/server-api';
import { blogData as staticBlogData } from '@/libs/blogs';
import { useGetBlogPostsQuery } from '@/store/api/angelpageApi';

type BlogListClientProps = {
  initialPosts?: BlogPostRecord[];
};

export default function BlogListClient({ initialPosts = [] }: BlogListClientProps) {
  const { data: posts } = useGetBlogPostsQuery({});
  const resolved = posts ?? initialPosts;

  const cardData =
    resolved.length > 0
      ? resolved.map(mapBlogToCard)
      : staticBlogData;

  return (
    <div>
      <div className="bg-[#FCF2FF]">
        <div className="custom-container py-16 sm:py-10">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-[#611192] uppercase">
            Journal
          </p>
          <h1 className="mt-3 font-primary text-[48px] leading-none text-[#0B0112] sm:text-[34px]">
            Blog
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#3B055C]">
            Stories, guides, and news from Angelpage. See how shopping here
            supports charities in the United States, Canada, and the United Kingdom. We started in the USA.
          </p>
        </div>
      </div>
      <div className="bg-white pt-12 pb-20 sm:pt-8">
        <div className="custom-container">
          <BlogList blogData={cardData} featured />
        </div>
      </div>
    </div>
  );
}
