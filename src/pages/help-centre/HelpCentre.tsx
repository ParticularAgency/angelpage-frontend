/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import React from 'react';
import { centres } from '@/libs/help-centres'; // Import your blog data
import Image from 'next/image';

export default function HelpCentrePage() {
  return (
    <div className="bg-[#F1F1F7] pt-[53px] pb-36">
      <div className="custom-container text-center mb-[116px]">
        <h3>Angel Page Help Centre</h3>
        <div className="mt-10 relative w-[488px] sm:w-full m-auto">
          <input
            type="text"
            placeholder="Search for articles..."
            className="w-full pl-10 pr-4 py-2 focus:outline-none focus:border-primary-color-100"
          />
          <Image
            src="/images/icons/search.svg"
            alt="Seach Icon"
            width={16}
            height={16}
            className="absolute left-2 top-1/2 transform -translate-y-1/2"
          />
        </div>
      </div>

      <div className="custom-container grid sm:grid-cols-1 md:grid-cols-2 grid-cols-3 gap-5">
        {centres.map((data: any, index: any) => (
          <Link key={index} href={`help-centre/${data.id}`}>
            <div className="pt-6 pl-6 pb-[17px] bg-white">
              <p className="text-body-bold-small font-medium mb-[25px]">
                {data.title}
              </p>
              <div className="flex items-center">
                <span className="w-8 h-8 flex items-center justify-center bg-[#22CB58] text-[#131313] rounded-full font-bold mr-2">
                  {data.author}
                </span>
                <div className="text-body-bold-small font-medium flex gap-[14px]">
                  {' '}
                  {data.authorsCount} Author
                  <Image
                    src="/images/icons/dot.svg"
                    alt="A gray dot"
                    width={6}
                    height={6}
                  />
                  {data.articlesCount} Articles
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
