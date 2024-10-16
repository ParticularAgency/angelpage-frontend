/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface BlogDataProps {
    id: string;
    title: string;
    tag: string;
    description: string;
    image: string;
}

interface BlogListProps {
    blogData: BlogDataProps[];
}

const BlogList: React.FC<BlogListProps> = ({ blogData }) => {
    return (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 grid-cols-3 gap-8">
            {blogData.map((blog: any) => (
                <div className="w-[358px] sm:w-full overflow-hidden relative" key={blog.id}>
                    <div className="relative w-full h-48">
                        <span className='absolute top-2 left-2 z-10 uppercase text-[#fff] bg-[#611192] p-2 text-center text-[10px] font-bold'>{blog.tag}</span>
                        <Link href={`blog/${blog.id}`}>
                        <Image src={blog.image} alt={blog.title} width={358} height={197} className="w-full h-full object-cover" />
                        </Link>
                    </div>
                    <div>
                        <Link href={`blog/${blog.id}`}><p className="font-bold text-[12px] uppercase text-[#611192] mt-4 mb-3">{blog.title}</p></Link>
                        <p className="text-[#474648] text-[14px]">{blog.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BlogList;
