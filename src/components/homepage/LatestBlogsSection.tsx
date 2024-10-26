import React from 'react';
import BlogList from '../common/cards/blog/blogCards';
import { blogData } from '@/libs/blogs';

interface LatestBlogsSectionProps {
  secClassName?: string;
}
const LatestBlogsSection: React.FC<LatestBlogsSectionProps> = ({
  secClassName,
}) => {
  const limitedBlogData = blogData.slice(0, 3);
  return (
    <section
      className={`Latest-blog-section ${secClassName || 'bg-mono-0 pt-10 pb-[34px]'}`}
    >
      <div className="custom-container">
        <div className="product-sec-title-box mb-10 flex sm:flex-col items-start justify-between gap-4">
          <div className="product-title-box-left-cont">
            <h2 className="title h4">Blog</h2>
            <p className="body-small mt-2">
              Learn more about sustainable living, charitable giving, and the
              impact of your contributions.
            </p>
          </div>
          <div className="product-title-box-right-cont sm:hidden pt-2"></div>
        </div>
      </div>
      <div className="custom-container md:!pr-0">
        <div className="product-slides-area pr-[16px] pl-[10px] sm:pr-8 sm:pl-0 overflow-hidden">
          <BlogList blogData={limitedBlogData} />
        </div>
      </div>
    </section>
  );
};

export default LatestBlogsSection;
