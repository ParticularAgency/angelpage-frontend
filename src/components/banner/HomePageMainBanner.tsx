'use client';
import React from 'react';
import { Button } from '../elements';
import Link from 'next/link';
import Image from 'next/image';

const HomePageMainBanner = () => {
  return (
    <section className="internal-homepage-banner-section bg-mono-100 sm:bg-transparent py-8 sm:py-0">
      <div className="custom-container">
        <div className="homepage-banner-wrapper sm:mt-2 sm:mb-8 sm:bg-mono-100 sm:py-8 sm:px-6 ">
          <div className="banner-cont">
            <h1 className="h4 banner-title font-primary text-mono-0 mb-2">
              Start selling on AngelPage
            </h1>
            <p className="body-small text-mono-0">
              Add items to any charity storefront to become a donor
            </p>
            <Link href="/product/post-product" className="block">
              <Button
                variant="secondary"
                className="!text-mono-0 sm:!hidden !border-mono-0 mt-4 hover:!text-mono-100"
                onClick={() => console.log('Should not click')}
              >
                Start giving
              </Button>
              <Button
                variant="accend-link"
                className="!text-mono-0 !hidden !mt-2 !px-0 sm:!flex sm:items-center sm:gap-2 !border-mono-0 hover:!text-mono-100"
                onClick={() => console.log('Should not click')}
              >
                Start giving{' '}
                <Image
                  src="/images/arrow-right-angle.svg"
                  alt="arrow angle image"
                  className="w-6 h-6 sm:w-5 sm:h-5"
                  width={24}
                  height={24}
                />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePageMainBanner;
