import HomeLandingBanner from '@/components/banner/HomeLandingBanner'
import AboutSection from '@/components/homepage/AboutSection'
import AngelPageInfoSection from '@/components/homepage/AngelPageInfoSection'
// import CharitySection from '@/components/homepage/CharitySection'
import CtaSection from '@/components/homepage/CtaSection'
import HowItWorkSection from '@/components/homepage/HowItWorkSection'
import OurPlatformSection from '@/components/homepage/OurPlatformSection'
import TopCategoryProduct from '@/components/product/TopCategoryProducts'
import WomansCategoryProducts from '@/components/product/WomansCategoryProducts'
import React from 'react'

const HomeLanding = () => {
  return (
    <div className='homepage-main-wrapper'>
      <HomeLandingBanner />
      <TopCategoryProduct isLoggedIn={false} />
      <WomansCategoryProducts isLoggedIn={false} />
      <HowItWorkSection />
      {/* <CharitySection /> */}
      <CtaSection /> 
      <AboutSection />
      <AngelPageInfoSection />
      <OurPlatformSection />
    </div>
  )
}

export default HomeLanding
