'use client';

import AboutSection from '@/components/howItWorkPage/AboutSection';
import React from 'react';

const AboutPage = () => {
  return (
    <div className="about-page-main">
      <div className="custom-container py-16 sm:py-10">
        <h1 className="h3 font-primary text-mono-100 mb-2">About Angelpage</h1>
        <p className="body-regular text-mono-70 max-w-2xl">
          Where sellers are donors and buyers are givers — every transaction
          supports the causes you care about.
        </p>
      </div>
      <AboutSection />
    </div>
  );
};

export default AboutPage;
