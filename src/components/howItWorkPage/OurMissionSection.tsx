'use client';
import React from 'react';
import Image from 'next/image';
import { Button } from '../elements';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const OurMissionSection = () => {
  const { status } = useSession() || [];

  return (
    <section className="our-mission-section w-full">
      <div className="grid grid-cols-12 gap-0 sm:flex md:flex-col">
        {/* Left: Mission statement and image */}
        <div className="col-span-7 sm:col-span-full md:w-full">
          <div className="pl-20 pt-[79px] pb-[91px] pr-[55px] sm:px-5 sm:py-10 bg-secondary-color-50">
            <h5 className="text-[12px] uppercase font-bold text-secondary-color-100 font-secondary">
              Our Mission
            </h5>
            <p className="text-mono-100 mt-4 body-regular max-w-[750px]">
              Angelpage provides a dedicated online marketplace for selling and
              buying pre-loved items, with 90% of the sale's proceeds benefiting
              selected UK charities.
            </p>
          </div>
          <div className='our-mission-model-area h-[416px]'>
            {/* <Image
              src="/images/how-it-works/mission.png"
              width={838}
              height={416}
              alt="Child smiling"
              className="w-full h-full object-cover"
            /> */}
          </div>
        </div>

        {/* Right: What the Company Provides */}
        <div className="bg-[#F1F1F7] md:w-full pl-[60px] pt-20 pr-[80px] sm:px-5 md:py-10 col-span-5 sm:col-span-full">
          <h3 className="h4 font-normal font-primary text-mono-100">
            What the Company Provides and Why
          </h3>
          <p className="text-lg text-mono-100 mt-7 max-w-[453px] w-full">
            Brands can support their favourite charities by selling new
            products, excess stock, fulfilling their CSR commitments without
            relying solely on out-of-pocket donations. This model supports
            charitable fundraising by converting various items into substantial
            donations.
          </p>
          <p className="text-lg text-mono-100 mt-4 max-w-[453px] w-full">
            We empower high-street charity shops to sell their inventory through
            a dedicated application, thus supporting local communities and
            promoting environmental sustainability through the circular
            economy​​.
          </p>

          {/* Buttons */}
          <div className="mt-[70px] sm:mt-12 flex gap-6">
            {/* Display button only when authenticated */}
            <Link
              href={
                status === 'authenticated'
                  ? '/product/post-product'
                  : '/auth/register'
              }
            >
              <Button
                variant="primary"
                className="inline-block"
                onClick={() => console.log('Should not click')}
              >
                Start Selling for Free
              </Button>
            </Link>
            <Link href="/product">
              <Button variant="accend-link" className="flex items-center">
                Browse Items{' '}
                <Image
                  width={24}
                  height={24}
                  src="/images/how-it-works/right.svg"
                  alt="Right Arrow Icon"
                />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurMissionSection;
