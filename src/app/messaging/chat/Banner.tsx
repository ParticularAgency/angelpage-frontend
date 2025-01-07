'use client';
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/elements';
// import { fetchUserData, fetchUserProfileData } from '@utils/api';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import {
//   ToastService,
// } from '@/components/elements/notifications/ToastService';

// interface UserProfile {
//   verified: boolean;
//   profileCompleted: boolean;
//   firstName?: string;
//   userName?: string;
//   profileImage?: string;
// }

const BannerSection = () => {
  return (
    <section className="users-account-banner-section relative py-10 sm:pb-8">
      <div className="custom-container">
        <div className="users-account-banner-wrapper  flex items-center justify-between sm:flex-col sm:items-start sm:gap-8">
          <div className="users-account-left-cont flex items-center gap-4">
            <Image
              src="/images/icons/elisp-profile-default-img.svg"
              alt="user profile image"
              className="rounded-full w-10 h-10 object-cover"
              width={40}
              height={40}
            />
            <div className="users-info-cont">
              <h1 className="h5 sm:text-[17px]  font-primary user-profile-name whitespace-nowrap text-mono-100 mb-[2px]">
                Wilson Ndasi
              </h1>
              <p className="user-username body-small">@wilson293763</p>
            </div>
          </div>
          <div className="users-account-right-cont hidden  flex-col items-end sm:items-start">
            <Button variant="primary" className="body-small ">
              Turn on holiday mode
            </Button>
            <p className="forms text-mono-100 mt-2 md:max-w-[375px]">
              In Holiday Mode, your active listings will be temporarily hidden
              in the database.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
