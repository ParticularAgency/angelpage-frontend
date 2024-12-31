'use client';
import React from 'react';
import { Button } from '../elements';
import Link from 'next/link';

const HomePageMainBanner = () => {
  return (
    <section className="internal-homepage-banner-section bg-mono-100 sm:bg-transparent py-8 sm:py-0">
      <div className="custom-container">
        <div className="homepage-banner-wrapper sm:bg-mono-100 sm:py-8 sm:px-6 ">
          <div className="banner-cont">
            <h1 className="h4 banner-title font-primary text-mono-0 mb-2">
              Start selling on AngelPage
            </h1>
            <p className="body-small text-mono-0">
              Add items to any Charity storefront to become a donor
            </p>
            <Link href="/product/post-product" className="block">
              <Button
                variant="secondary"
                className="!border-mono-0 !text-mono-0 mt-[37px]"
                onClick={() => console.log('button is click')}
              >
                Start selling
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePageMainBanner;
