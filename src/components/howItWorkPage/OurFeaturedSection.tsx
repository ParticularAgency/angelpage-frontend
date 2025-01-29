'use client';
import React from 'react';
import Image from 'next/image';

const OurFeaturedSection = () => {
  return (
    <section className="w-full bg-white pt-9 pb-24 lg:py-16 sm:py-14">
      <div className="custom-container">
        <div className="mb-12">
          <h2 className="h4 font-normal text-[#1B264F]">
            What makes us different?
          </h2>
          <p className="text-[18px] text-[#1B264F] mt-3">
            Angelpage distinguishes itself through several key features:
          </p>
        </div>

        <div className="flex flex-wrap justify-center sm:flex-col">
          {/* Feature 1 */}
          <div className="sm:w-full w-1/3 pr-6 sm:px-0 mb-20 sm:mb-9">
            <div className="mb-[14px]">
              {/* Icon (replace with appropriate icon) */}
              <Image
                width={24}
                height={24}
                src="/images/how-it-works/feat-icon.svg"
                alt="Support Icon"
              />
            </div>
            <p className=" font-medium text-[#611192]">
              Charity-Centric Model:{' '}
            </p>
            <p className="text-[#1B264F] mt-2 body-small max-w-[390px]">
              Charity-Centric Model: Unlike other e-commerce platforms,
              Angelpage is exclusively dedicated to charitable sales, ensuring a
              significant portion of sales proceeds benefits selected charities.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="sm:w-full w-1/3 pl-6 sm:px-0 pr-6 mb-20 sm:mb-9">
            <div className="mb-[14px]">
              <Image
                width={24}
                height={24}
                src="/images/how-it-works/feat-icon.svg"
                alt="Support Icon"
              />
            </div>
            <p className=" font-medium text-[#611192]">Ethical Advertising:</p>
            <p className="text-[#1B264F] mt-2 body-small max-w-[390px]">
              AngelPage partners with advertisers whose values align with its
              mission, generating additional revenue without compromising its
              principles.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="sm:w-full w-1/3 pl-6 sm:px-0 mb-20 sm:mb-9">
            <div className="mb-[14px]">
              <Image
                width={24}
                height={24}
                src="/images/how-it-works/feat-icon.svg"
                alt="Support Icon"
              />
            </div>
            <p className=" font-medium text-[#611192]">
              Promotion of Circular Economy:
            </p>
            <p className="text-[#1B264F] mt-2 body-small max-w-[390px]">
              By facilitating the sale and purchase of second-hand goods,
              Angelpage promotes the reuse and recycling of items, contributing
              to a sustainable economic model that reduces waste and
              overconsumption.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="sm:w-full w-1/3 sm:px-0 pr-6 max-w-[403px] sm:mb-9">
            <div className="mb-[14px]">
              <Image
                width={24}
                height={24}
                src="/images/how-it-works/feat-icon.svg"
                alt="Support Icon"
              />
            </div>
            <p className=" font-medium text-[#611192]">
              Support for Small and Micro Charities:
            </p>
            <p className="text-[#1B264F] mt-2 body-small max-w-[390px]">
              Support for Small and Micro Charities: Angelpage specifically
              targets smaller charities and social causes, providing them with
              visibility and funding opportunities.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="sm:w-full w-1/3 sm:px-0 pl-6 max-w-[403px]">
            <div className="mb-[14px]">
              <Image
                width={24}
                height={24}
                src="/images/how-it-works/feat-icon.svg"
                alt="Support Icon"
              />
            </div>
            <p className=" font-medium text-[#611192]">Free Listings:</p>
            <p className="text-[#1B264F] mt-2 body-small max-w-[390px]">
              List your pre-loved items for free with no hidden fees or extra
              charges. Share detailed descriptions and showcase your items to
              potential buyers effortlessly. Start decluttering today and make a
              positive impact!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurFeaturedSection;
