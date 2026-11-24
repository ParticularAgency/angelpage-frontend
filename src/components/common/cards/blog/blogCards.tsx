'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export interface BlogCardData {
  id: string;
  title: string;
  tag: string;
  description: string;
  image: string;
  date?: string;
  author?: string;
}

interface BlogListProps {
  blogData: BlogCardData[];
  featured?: boolean;
}

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function BlogCard({
  blog,
  featured = false,
}: {
  blog: BlogCardData;
  featured?: boolean;
}) {
  const dateLabel = formatDate(blog.date);

  return (
    <article
      className={`group flex h-full overflow-hidden rounded-3xl border border-[#E6E3E7] bg-white ${
        featured ? 'flex-row md:flex-col sm:flex-col' : 'flex-col'
      }`}
    >
      <Link
        href={`/blog/${blog.id}`}
        className={`relative block overflow-hidden bg-[#FCF2FF] ${
          featured
            ? 'w-[46%] shrink-0 self-stretch md:aspect-[16/10] md:w-full sm:w-full'
            : 'aspect-[16/10]'
        }`}
      >
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          sizes={featured ? '(max-width: 991px) 100vw, 50vw' : '(max-width: 767px) 100vw, 33vw'}
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute top-4 left-4 rounded-full bg-[#611192] px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-white uppercase">
          {blog.tag}
        </span>
      </Link>

      <div
        className={`flex flex-1 flex-col ${
          featured ? 'px-8 py-8 sm:px-5 sm:py-5' : 'px-5 py-5 sm:px-4'
        }`}
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#6B686E]">
          {dateLabel ? <span>{dateLabel}</span> : null}
          {blog.author ? (
            <span className="text-[#611192]">{blog.author}</span>
          ) : null}
        </div>
        <Link href={`/blog/${blog.id}`} className="mt-2">
          <h3
            className={`font-primary leading-tight text-[#0B0112] ${
              featured ? 'text-[32px] sm:text-[26px]' : 'text-[22px]'
            }`}
          >
            {blog.title}
          </h3>
        </Link>
        <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-[#474648]">
          {blog.description}
        </p>
        <Link
          href={`/blog/${blog.id}`}
          className="mt-auto pt-5 text-[13px] font-semibold tracking-[0.04em] text-[#611192]"
        >
          Read story
        </Link>
      </div>
    </article>
  );
}

const BlogList: React.FC<BlogListProps> = ({ blogData = [], featured = false }) => {
  const [lead, ...rest] = blogData;

  if (!lead) return null;

  if (!featured) {
    return (
      <div className="grid grid-cols-3 gap-6 md:grid-cols-2 sm:grid-cols-1">
        {blogData.map(blog => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <BlogCard blog={lead} featured />
      {rest.length > 0 ? (
        <div className="grid grid-cols-3 gap-6 md:grid-cols-2 sm:grid-cols-1">
          {rest.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default BlogList;
