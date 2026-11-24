'use client';
import React from 'react';
import HomeLandingBanner from '@/components/banner/HomeLandingBanner';
import HomeValueStrip from '@/components/homepage/HomeValueStrip';
import IntHomeCtaSec from '@/components/homepage/IntHomeCtaSec';
import JewelleryProductCtaSec from '@/components/homepage/JewelleryProductCtaSec';
import LatestBlogsSection from '@/components/homepage/LatestBlogsSection';
import HomeEventsSection from '@/components/homepage/HomeEventsSection';
import BagsTopCategoryProducts from '@/components/product/BagsCategoryProducts';
import ElectronicsTopCategoryProducts from '@/components/product/ElectronicsProducts';
import GiftFeaturedCategoryProducts from '@/components/product/GiftFeatureCategoryProducts';
import HomewareTopCategoryProducts from '@/components/product/HomewareTopCategoryProducts';
import PromotedProductsStrip from '@/components/product/PromotedProductsStrip';
import TopCategoryProducts from '@/components/product/TopCategoryProducts';
import WomansCategoryProducts from '@/components/product/WomansCategoryProducts';

/** Storefront home content without role guard (used for users + admin browse) */
const StorefrontHomeContent = () => {
  return (
    <div className="internal-homepage-main-wrapper">
      <HomeLandingBanner />
      <HomeValueStrip />
      <PromotedProductsStrip />
      <TopCategoryProducts secClassName="" />
      <WomansCategoryProducts secClassName="" />
      <HomewareTopCategoryProducts />
      <JewelleryProductCtaSec />
      <ElectronicsTopCategoryProducts />
      <BagsTopCategoryProducts secClassName="" />
      <HomeEventsSection />
      <IntHomeCtaSec />
      <GiftFeaturedCategoryProducts secClassName="" />
      <LatestBlogsSection />
    </div>
  );
};

export default StorefrontHomeContent;
