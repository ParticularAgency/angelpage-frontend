'use client';
import React from 'react';
import Image from 'next/image';

const OurFeaturedSection = () => {
  return (
    <section className="w-full bg-white px-20 laptop-m:px-12 lg:px-8 md:px-6 sm:px-4 pt-[146px] pb-[150px] lg:py-16 sm:py-10">
      <div className="custom-container-fluid">
        <div className="mb-12">
          <h2 className="text-[24px] mb-3 font-normal text-[#1B264F]">
            What makes us different?
          </h2>
          <p className="text-[18px] text-[#1B264F] mt-4">
            Angelpage distinguishes itself through several key features:
          </p>
        </div>

        <div className="flex flex-wrap justify-center mt-[53px]">
          {/* Feature 1 */}
          <div className="sm:w-full w-1/3 pr-10 lg:pr-6 mb-6">
            <div className="mb-[14px]">
              {/* Icon (replace with appropriate icon) */}
              <Image
                width={24}
                height={24}
                src="/images/how-it-works/feat-icon.svg"
                alt="Support Icon"
              />
            </div>
            <p className=" font-medium text-[#611192]">Charity-Centric Model</p>
            <p className="text-[#1B264F] mt-2">
              Unlike other e-commerce platforms, Angelpage is exclusively
              dedicated to charitable sales, ensuring a significant portion of
              sales proceeds benefits selected charities.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="sm:w-full w-1/3 pr-10 mb-6">
            <div className="mb-[14px]">
              <Image
                width={24}
                height={24}
                src="/images/how-it-works/feat-icon.svg"
                alt="Support Icon"
              />
            </div>
            <p className=" font-medium text-[#611192]">
              Corporate Social Responsibility (CSR) Support
            </p>
            <p className="text-[#1B264F] mt-2">
              Brands can fulfill their CSR commitments by selling new products,
              excess stock, or services on Angelpage, directly supporting their
              favorite charities without out-of-pocket donations.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="sm:w-full w-1/3 pr-10 mb-6">
            <div className="mb-[14px]">
              <Image
                width={24}
                height={24}
                src="/images/how-it-works/feat-icon.svg"
                alt="Support Icon"
              />
            </div>
            <p className=" font-medium text-[#611192]">
              Promotion of Circular Economy
            </p>
            <p className="text-[#1B264F] mt-2">
              Angelpage promotes the reuse and recycling of items, contributing
              to a sustainable economic model that reduces waste and
              overconsumption.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="sm:w-full w-1/3 pr-10 mb-6">
            <div className="mb-[14px]">
              <Image
                width={24}
                height={24}
                src="/images/how-it-works/feat-icon.svg"
                alt="Support Icon"
              />
            </div>
            <p className=" font-medium text-[#611192]">
              Support for Small and Micro Charities
            </p>
            <p className="text-[#1B264F] mt-2">
              Angelpage specifically targets smaller charities and social
              causes, providing them with visibility and funding opportunities.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="sm:w-full w-1/3 pr-10 mb-6">
            <div className="mb-[14px]">
              <Image
                width={24}
                height={24}
                src="/images/how-it-works/feat-icon.svg"
                alt="Support Icon"
              />
            </div>
            <p className=" font-medium text-[#611192]">Mobile Integration</p>
            <p className="text-[#1B264F] mt-2">
              The platform leverages mobile technology to make it easy for users
              to list and sell items from anywhere, enhancing convenience and
              participation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurFeaturedSection;
