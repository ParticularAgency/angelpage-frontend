import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/elements';

const BannerSection = () => {
  return (
    <section className="charity-account-banner-section bg-mono-100 sm:bg-transparent sm:mt-2">
      <div className="custom-container-full laptop-m:pl-6 sm:px-3">
        <div className="charity-account-banner-wrapper grid grid-cols-12 gap-0 sm:block sm:h-[320px] sm:relative sm:bg-mono-100">
          <div className="col-span-5 w-full pr-[57px] laptop-x:pr-[103px] laptop-m:pr-14 py-[42px] flex flex-col justify-end  sm:absolute sm:z-[999] bottom-0 left-0 sm:bg-mono-100 sm:pb-6 sm:pt-5 sm:px-6">
            <div className="charity-account-banner-cont max-w-[385px] ml-auto">
              <Image
                src="/images/icons/charity-img.png"
                className="w-10 h-10 object-cover mb-2 sm:mb-1 sm:w-8 sm:h-8"
                alt="charity-account charity logo image"
                width={40}
                height={40}
              />
              <h1 className="h3 charity-account-banner-tittle !text-mono-0">
                Salvation Army Trading Co Ltd
              </h1>
              <div className="charity-insight-info flex items-center gap-4 mt-2 sm:mt-1">
                <p className="available-product-total-number body-small !text-mono-0">
                  24 items for sale
                </p>
                <p className="available-product-total-number body-small !text-mono-0">
                  24 items for sold
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-7 w-full">
            <div className="charity-account-banner-modal-img w-full h-[387px] sm:h-[320px] relative">
              <Button
                variant="primary"
                className="change-storefront-img absolute left-4 bottom-4 sm:top-4"
              >
                Change storefront image
              </Button>
              <Image
                src="/images/charity-storefront/charity-banner-img1.png"
                className="w-full h-full object-cover object-top"
                alt="charity-account charity model image"
                width={831}
                height={387}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
