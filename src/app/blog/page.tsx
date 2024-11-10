import BlogList from '@/components/common/cards/blog/blogCards';
import { blogData } from '@/libs/blogs';
import React from 'react';

const Blogs: React.FC = () => {
  return (
    <div>
      <div className="custom-container py-[74px]">
        <h3 className="text-[|#000] mb-3">Blog</h3>
        <p className=" text-[#0B0112] text-[14px]">
          Stay updated with the latest news, tips, and stories from Angelpage.
          Learn more about sustainable living, charitable giving,{' '}
          <br className="sm:hidden" /> and the impact of your contributions.
        </p>
      </div>
      <div className="bg-[#F9F9F9] pt-[75px] pb-[71px]">
        <div className="custom-container">
          <BlogList blogData={blogData} />
        </div>
      </div>
    </div>
  );
};

export default Blogs;
