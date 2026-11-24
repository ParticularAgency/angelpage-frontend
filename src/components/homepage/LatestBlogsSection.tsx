'use client';

import React from 'react';
import BlogList from '../common/cards/blog/blogCards';
import Link from 'next/link';
import { Button } from '@/components/elements';
import { blogData as staticBlogData } from '@/libs/blogs';
import { mapBlogToCard } from '@/lib/server-api';
import { useGetBlogPostsQuery } from '@/store/api/angelpageApi';

interface LatestBlogsSectionProps {
  secClassName?: string;
}

const LatestBlogsSection: React.FC<LatestBlogsSectionProps> = ({
  secClassName,
}) => {
  const { data: posts } = useGetBlogPostsQuery({ limit: 3 });

  const cardData =
    posts && posts.length > 0
      ? posts.map(mapBlogToCard)
      : staticBlogData.slice(0, 3);

  return (
    <section
      className={`Latest-blog-section ${secClassName || 'bg-mono-0 pt-10 pb-[34px]'}`}
    >
      <div className="custom-container">
        <div className="product-sec-title-box mb-10 flex sm:flex-col items-start justify-between gap-4">
          <div className="product-title-box-left-cont">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[#611192] uppercase">
              Journal
            </p>
            <h2 className="title h4 mt-2 font-primary">Blog</h2>
            <p className="body-small mt-2 max-w-xl">
              Stories from Angelpage, charities, and our community.
            </p>
          </div>
          <Link href="/blog">
            <Button variant="secondary" className="text-primary-color-100!">
              Read all posts
            </Button>
          </Link>
        </div>
      </div>
      <div className="custom-container md:pr-0!">
        <div className="product-slides-area pr-[16px] pl-[10px] sm:pr-8 sm:pl-0 overflow-hidden">
          <BlogList blogData={cardData} />
        </div>
      </div>
    </section>
  );
};

export default LatestBlogsSection;
