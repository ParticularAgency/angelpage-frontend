import React from 'react'
import { Button } from '../elements';
import Link from 'next/link';

const CommunityFeatureSection = () => {
  return (
    <div className="community-feature-section bg-[#f1f1f8] mb-3">
      {/* <div className="custom-container"> */}
      <div className="community-featured-wrapper grid grid-cols-12 gap-[72px] laptop-m:gap-14 lg:gap-[45px] md:gap-8 sm:gap-9 sm:flex sm:flex-col">
        <div className="community-feature-left-cont col-span-5 bg-mono-50 sm:h-[280px]"></div>
        <div className="community-feature-right-cont col-span-7 pt-10 pb-16 pr-[75px] laptop-m:pr-[45px] lg:pr-6 md:pr-[18px] sm:px-4 sm:pt-0">
          <p className="eyebrow-medium font-secondary max-w-[760px] mb-[13px]">
            Community Features
          </p>
          <p className="body-medium font-secondary max-w-[760px] mb-4">
            AngelPage encourages trust and collaboration through
            community-focused features:
          </p>
          <ul className="featured-lists max-w-[760px] pl-6">
            <li className="featured-list-item !list-disc body-medium sm:text-[14px] mb-1">
              <strong>Profile Creation:</strong> Users can create profiles to
              personalise their experience, making it easier to follow sellers
              or charity shops they support.
            </li>
            <li className="featured-list-item !list-disc body-medium sm:text-[14px] mb-1">
              <strong>Likes and Favourites:</strong> Buyers can save items to
              their favourites and like listings to revisit later. Reviews and
            </li>
            <li className="featured-list-item !list-disc body-medium sm:text-[14px]">
              <strong>Ratings:</strong> Both buyers and sellers can leave
              reviews, fostering accountability and trust across the platform.
            </li>
          </ul>
          <Link href="/auth/login">
            <Button variant="primary" className="mt-16 laptop-m:mt-12 lg:mt-10">
              Join the Community
            </Button>
          </Link>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}

export default CommunityFeatureSection
