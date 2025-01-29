'use client';
import React from 'react';
const HowItWorkBanner = () => {
  return (
    <section className="how-it-work-banner w-full bg-white">
      <div className="how-it-work-banner-area min-h-[389px] sm:min-h-[262px]">
        <div className="custom-container">
          <div className="how-it-work-banner-wrapper py-[112px] sm:py-16 relative z-50">
            <h1 className="banner-title h1 text-center text-mono-0">
              How it works
            </h1>
            <p className="desc body-medium sm:body-small  text-center !text-mono-0 mt-6 sm:mt-3 max-w-[820px] mx-auto w-full">
              AngelPage is an innovative online marketplace designed to enable
              individuals and charity shops to sell preloved items, with the
              proceeds supporting UK charities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorkBanner;
