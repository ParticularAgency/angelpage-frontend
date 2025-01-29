'use client';
import HowItWorkBanner from '@/components/banner/HowItWorkBanner';
import AboutSection from '@/components/howItWorkPage/AboutSection';
import CommunityFeatureSection from '@/components/howItWorkPage/CommunityFeatureSection';
import HowItWorksPerUserTypeSection from '@/components/howItWorkPage/HowItWorksSection';
import OurFeaturedSection from '@/components/howItWorkPage/OurFeaturedSection';
import OurMissionSection from '@/components/howItWorkPage/OurMissionSection';
import TestimonialsSection from '@/components/howItWorkPage/TestimonialsSection';
import React from 'react';

const HowItWorksPage = () => {
  return (
    <div className="how-it-works-main-wrapper">
      <HowItWorkBanner />
      <AboutSection />
      <HowItWorksPerUserTypeSection />
      <OurFeaturedSection />
      <OurMissionSection />
      <TestimonialsSection />
      <CommunityFeatureSection />
    </div>
  );
};

export default HowItWorksPage;
