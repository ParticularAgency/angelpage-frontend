'use client';
import HomeLandingBanner from '@/components/banner/HomeLandingBanner';
import HomeValueStrip from '@/components/homepage/HomeValueStrip';
import AboutSection from '@/components/homepage/AboutSection';
import AngelPageInfoSection from '@/components/homepage/AngelPageInfoSection';
// import CharitySection from '@/components/homepage/CharitySection'
import CtaSection from '@/components/homepage/CtaSection';
import HowItWorkSection from '@/components/homepage/HowItWorkSection';
import OurPlatformSection from '@/components/homepage/OurPlatformSection';
import TopCategoryProduct from '@/components/product/TopCategoryProducts';
import WomansCategoryProducts from '@/components/product/WomansCategoryProducts';
import PromotedProductsStrip from '@/components/product/PromotedProductsStrip';
import HomeEventsSection from '@/components/homepage/HomeEventsSection';
import LatestBlogsSection from '@/components/homepage/LatestBlogsSection';
import React from 'react';

const HomeLanding = () => {
  return (
    <div className="homepage-main-wrapper">
      <HomeLandingBanner />
      <HomeValueStrip />
      <PromotedProductsStrip />
      <TopCategoryProduct secClassName="" />
      <WomansCategoryProducts secClassName="" />
      <HowItWorkSection />
      <HomeEventsSection />
      {/* <CharitySection /> */}
      <CtaSection />
      <AboutSection />
      <AngelPageInfoSection />
      <OurPlatformSection />
      <LatestBlogsSection secClassName="bg-mono-0 pt-10 pb-20" />
    </div>
  );
};

export default HomeLanding;
