import HowItWorkBanner from '@/components/banner/HowItWorkBanner';
import AboutSection from '@/components/howItWorkPage/AboutSection';
import OurFeaturedSection from '@/components/howItWorkPage/OurFeaturedSection';
import OurMissionSection from '@/components/howItWorkPage/OurMissionSection';
import TimeLineSection from '@/components/howItWorkPage/TimeLineSection';
import React from 'react';

const HowItWorksPage = () => {
  return (
    <div className="how-it-works-main-wrapper">
      <HowItWorkBanner />
      <AboutSection />
      <OurFeaturedSection />
      <OurMissionSection />
      <TimeLineSection />
    </div>
  );
};

export default HowItWorksPage;
