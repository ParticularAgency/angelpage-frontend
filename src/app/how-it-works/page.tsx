import Image from "next/image";
import React from "react";

const HowItWorks: React.FC = () => {
  return (
    <>
      <section className="w-full bg-white pt-[18px]">
        <div className="grid grid-cols-2">
          {/* Left Side: Grid of Images */}
          <div className="grid grid-rows-2 grid-cols-2">
            {/* Top-left image */}
            <div>
              <Image
                width={339}
                height={310}
                alt="Logo"
                src="/images/how-it-works/logo.svg"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom-right image */}
            <div>
              <Image
                width={339}
                height={310}
                src="/images/how-it-works/img2.png"
                alt="Helping people"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-2">
              <Image
                width={710}
                height={310}
                src="/images/how-it-works/img3.png"
                alt="Dogs in cages"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Right Side: Logo and Text */}
          <Image
            width={730}
            height={620}
            src="/images/how-it-works/img4.png"
            alt="Children playing with water"
            className="w-full h-full object-cover"
          />
        </div>
      </section>
      {/* Section 2 - Full-width */}
      <section className="w-full bg-[#F1F1F7] flex gap-[72px] mt-32">
        <div className="relative w-2/5">
          {/* Background Image */}
          <Image
            width={530}
            height={450}
            src="/images/how-it-works/willson.png"
            alt="Dr. Wilson Ndasi"
            className="w-full h-full object-cover"
          />
          {/* Text Overlay */}
          <div className="absolute inset-0  flex items-end">
            <div className="text-white ml-[55px] mb-[33px] max-w-lg">
              <h3 className="text-[18px] mb-3 font-bold ml-[7px]">
                Dr. Wilson Ndasi
              </h3>
              <p className="text-white mb-2">
                PhD in Management (Digital Marketing)
              </p>
              <p className="text-white">Bournemouth University</p>
            </div>
          </div>
        </div>

        {/* Text on the right side */}
        <div className="w-3/5 flex items-center">
          <div className="text-left">
            <h6 className="uppercase text-[10px] font-bold">The Founder</h6>
            <p className="text-[18px] mt-4 mb-[110px]">
              Dr. Ndasi has contributed extensively to academia and practical
              applications in digital marketing and non-profit initiatives. His
              research focuses on cause-related marketing and the strategic use
              of digital methods to promote environmental stewardship and
              support the circular economy.
            </p>
            <p className="text-[14px]">Dr. Wilson Ndasi</p>
            <Image
              width={208}
              height={95}
              src="/images/how-it-works/signature.svg"
              alt="Dr. Wilson Ndasi's signature"
              className="mt-[7px]"
            />
          </div>
        </div>
      </section>
      {/* Section 3: Key Features */}
      <section className="w-full bg-white pl-20 pt-[146px] pb-[150px]">
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
          <div className="sm:w-full w-1/3 pr-10 mb-6">
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
      </section>
      {/* Section 4: Mission and Company Description */}
      <section className="w-full">
        <div className="flex">
          {/* Left: Mission statement and image */}
          <div className="w-3/5">
            <div className="pl-20 pt-[79px] pb-[91px] pr-[55px] bg-[#F0F3FE]">
              <h5 className="text-[12px] uppercase font-semibold text-[#1B264F]">
                Our Mission
              </h5>
              <p className=" text-[#05060D] mt-4">
                Angelpage provides a dedicated online marketplace for selling
                and buying pre-loved items, with 90% of the sale's proceeds
                benefiting selected UK charities.
              </p>
            </div>
            <div>
              <Image
                src="/images/how-it-works/mission.png"
                width={838}
                height={416}
                alt="Child smiling"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: What the Company Provides */}
          <div className="bg-[#F1F1F7] pt-20 pl-[69px] pr-[80px] w-2/5">
            <h3 className="text-[24px] font-normal text-[#0B0112]">
              What the Company Provides and Why
            </h3>
            <p className="text-lg text-[#0B0112] mt-7">
              Brands can support their favourite charities by selling new
              products, excess stock, fulfilling their CSR commitments without
              relying solely on out-of-pocket donations. This model supports
              charitable fundraising by converting various items into
              substantial donations.
            </p>
            <p className="text-lg text-[#0B0112] mt-4">
              We empower high-street charity shops to sell their inventory
              through a dedicated application, thus supporting local communities
              and promoting environmental sustainability through the circular
              economy.
            </p>

            {/* Buttons */}
            <div className="mt-[70px] flex space-x-4">
              <a
                href="#"
                className="bg-[#4BA27D] text-white py-2 px-4  hover:bg-green-700"
              >
                Start Selling for Free
              </a>
              <a
                href="#"
                className="text-[#1B264F] flex gap-2 py-2 px-4 rounded-lg hover:underline"
              >
                Browse Items
                <Image
                  width={24}
                  height={24}
                  src="/images/how-it-works/right.svg"
                  alt="Right Arrow Icon"
                />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
