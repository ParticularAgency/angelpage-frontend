'use client';
import React from 'react';
import Image from 'next/image';
import { Button } from '../elements';
const OurMissionSection = () => {
  return (
    <section className="our-mission-section w-full">
      <div className="flex md:flex-col">
        {/* Left: Mission statement and image */}
        <div className="w-3/5 md:w-full">
          <div className="pl-20 pt-[79px] pb-[91px] pr-[55px] sm:px-5 sm:py-10 bg-secondary-color-50">
            <h5 className="text-[12px] uppercase font-semibold text-secondary-color-100">
              Our Mission
            </h5>
            <p className=" text-mono-100 mt-4">
              Angelpage provides a dedicated online marketplace for selling and
              buying pre-loved items, with 90% of the sale's proceeds benefiting
              selected UK charities.
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
        <div className="bg-[#F1F1F7] md:w-full pt-20 pl-[69px] pr-[80px] sm:px-5 md:py-10 w-2/5">
          <h3 className="text-[24px] font-normal text-mono-100">
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
            promoting environmental sustainability through the circular economy.
          </p>

          {/* Buttons */}
          <div className="mt-[70px] flex">
            <Button
              variant="primary"
              className="inline-block"
              onClick={() => console.log('Should not click')}
            >
              {' '}
              Start Selling for Free
            </Button>
            <Button
              variant="accend-link"
              className="flex items-center"
              onClick={() => console.log('Should not click')}
            >
              Browse Items{' '}
              <Image
                width={24}
                height={24}
                src="/images/how-it-works/right.svg"
                alt="Right Arrow Icon"
              />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurMissionSection;
