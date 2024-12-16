'use client';
import React from 'react';
import Image from 'next/image';

interface CharityStore {
  profileImage?: string;
  charityName?: string;
  charityBannerImage?: string;
}

interface StoreFrontBannerProps {
  charityStore?: CharityStore;
}

const StoreFrontBanner: React.FC<StoreFrontBannerProps> = ({
  charityStore = {},
}) => {
  return (
    <section className="storefront-banner-component bg-mono-100 sm:bg-transparent sm:mt-2">
      <div className="custom-container-full laptop-m:pl-6 sm:px-3">
        <div className="storefront-banner-wrapper grid grid-cols-12 gap-2 sm:block sm:h-[286px] sm:relative sm:bg-mono-100">
          <div className="col-span-5 w-full pr-[57px] laptop-x:pr-[103px] laptop-m:pr-14 py-[42px] flex flex-col justify-end  sm:absolute bottom-0 left-0 sm:bg-mono-100 sm:pb-6 sm:pt-5 sm:px-6">
            <div className="storefront-banner-cont max-w-[385px] ml-auto">
              {charityStore ? (
                <Image
                  src={
                    charityStore.profileImage || '/images/icons/charity-img.png'
                  }
                  className="w-10 h-10 object-cover mb-2 sm:mb-1 sm:w-8 sm:h-8"
                  alt="charity-account charity logo image"
                  width={40}
                  height={40}
                />
              ) : (
                <span className="skeleton bg-mono-40 h-10 w-10 rounded-full"></span>
              )}
              <h1 className="h3 storefront-banner-tittle !text-mono-0">
                {charityStore ? (
                  charityStore.charityName
                ) : (
                  <span className="skeleton bg-mono-40 h-2 w-20"></span>
                )}
              </h1>
              <p className="available-product-total-number body-small mt-2 sm:mt-1 !text-mono-0">
                24 items for sale
              </p>
            </div>
          </div>
          <div className="col-span-7 w-full">
            <div className="storefront-banner-modal-img w-full h-[387px] sm:h-[286px]">
              {charityStore ? (
                <Image
                  src={
                    charityStore.charityBannerImage ||
                    '/images/icons/charity-banner-img.png'
                  }
                  className="w-full h-full object-cover object-top"
                  alt="storefront charity model image"
                  width={831}
                  height={387}
                />
              ) : (
                <span className="skeleton bg-mono-40 h-full w-full"></span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreFrontBanner;
