import HomePageMainBanner from '@/components/banner/HomePageMainBanner';
import IntHomeCtaSec from '@/components/homepage/IntHomeCtaSec';
import JewelleryProductCtaSec from '@/components/homepage/JewelleryProductCtaSec';
import LatestBlogsSection from '@/components/homepage/LatestBlogsSection';
import BagsTopCategoryProducts from '@/components/product/BagsCategoryProducts';
import ElectronicsTopCategoryProducts from '@/components/product/ElectronicsProducts';
import GiftFeaturedCategoryProducts from '@/components/product/GiftFeatureCategoryProducts';
import HomewareTopCategoryProducts from '@/components/product/HomewareTopCategoryProducts';
import TopCategoryProducts from '@/components/product/TopCategoryProducts';
import WomansCategoryProducts from '@/components/product/WomansCategoryProducts';
import React from 'react';

const InternalHome = () => {
  return (
    <div className="internal-homepage-main-wrapper">
      <HomePageMainBanner />
      <TopCategoryProducts secClassName="" />
      <WomansCategoryProducts secClassName="" />
      <HomewareTopCategoryProducts />
      <JewelleryProductCtaSec />
      <ElectronicsTopCategoryProducts />
      <BagsTopCategoryProducts secClassName="" />
      <IntHomeCtaSec />
      <GiftFeaturedCategoryProducts secClassName="" />
      <LatestBlogsSection />
    </div>
  ); 
};

export default InternalHome;
