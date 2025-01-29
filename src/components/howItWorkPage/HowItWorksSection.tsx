'use client';
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules'; // Import Pagination module
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination'; // Add pagination styles
import { Button } from '../elements';
import Image from 'next/image';

const HowItWorksPerUserTypeSection = () => {
  const [selectedType, setSelectedType] = useState<'Seller' | 'Buyer'>(
    'Seller'
  );

  const sellerSteps = [
    {
      step: 1,
      title: 'Create an Account',
      description:
        'Sellers register on the platform, providing the necessary details to ensure secure and transparent transactions.',
    },
    {
      step: 2,
      title: 'List Items',
      description:
        'Using AngelPage’s intuitive interface, sellers can upload high-quality photographs of their items and provide detailed descriptions, including condition, size, and any unique features.',
    },
    {
      step: 3,
      title: 'AI-Powered Assistance',
      description: (
        <>
          <p className="font-secondary mt-0 text-[16px] text-mono-100 max-w-[400px]">
            AngelPage integrates AI tools to streamline the listing process.
            These tools:
          </p>
          <ul className="ml-6">
            <li className="!list-disc font-secondary mt-1 text-[16px] text-mono-100 max-w-[400px]">
              Automatically generate product descriptions.
            </li>
            <li className="!list-disc font-secondary mt-1 text-[16px] text-mono-100 max-w-[400px]">
              Suggest competitive pricing based on similar items.
            </li>
            <li className="!list-disc font-secondary mt-0 text-[16px] text-mono-100 max-w-[400px]">
              Enhance photos for greater visibility in search results.
            </li>
          </ul>
        </>
      ),
    },
    {
      step: 4,
      title: 'Visibility on the Marketplace name',
      description:
        'Once listed, items appear in the personalised feeds of potential buyers, curated through AI-powered recommendations.',
    },
  ];

  const buyerSteps = [
    {
      step: 1,
      title: 'Explore the Marketplace',
      description:
        'Buyers can search for specific items or explore categories such as Men’s, Women’s, Children’s, and Homeware.',
    },
    {
      step: 2,
      title: 'Filter and Discover',
      description:
        'Advanced filtering options make it easy to find items by price, condition, size, or other preferences.',
    },
    {
      step: 3,
      title: 'Create an Account',
      description:
        'To make a purchase, buyers register on the platform, ensuring secure and protected transactions.',
    },
    {
      step: 4,
      title: 'Make an Offer or Buy Now',
      description:
        'Buyers can purchase items at the listed price or negotiate by making an offer. Sellers can accept, reject, or provide a counteroffer, encouraging flexible pricing.',
    },
  ];

  const steps = selectedType === 'Seller' ? sellerSteps : buyerSteps;

  return (
    <div className="how-it-works-container py-16 sm:py-12 bg-[#f1f1f8] overflow-hidden">
      <div className="how-it-work-user-type-wrapper">
        <div className="custom-container mb-20 sm:mb-8">
          <div className=" flex items-end justify-between sm:flex-col sm:gap-8 ">
            <div className="how-it-work-cont-top">
              <p className="body-regular font-secondary mb-2 text-primary-color-100 font-semibold">
                {selectedType === 'Buyer' ? 'For Buyers' : 'For Sellers'}
              </p>
              <h2 className="h3 font-primary text-mono-100 tracking-[.32px]">
                How it Works
              </h2>
              <p className="body-regular font-secondary text-mono-100 max-w-[768px]">
                {selectedType === 'Buyer'
                  ? 'Buyers can browse a wide range of preloved items and enjoy a seamless shopping experience. Here’s how they can get started'
                  : 'Sellers, including individuals and charity shops, can easily list their preloved items on AngelPage. Here’s how it works:'}
              </p>
            </div>
            <div className="flex justify-end gap-0">
              <Button
                variant={selectedType === 'Seller' ? 'primary' : 'secondary'}
                onClick={() => setSelectedType('Seller')}
              >
                Sellers
              </Button>
              <Button
                variant={selectedType === 'Buyer' ? 'primary' : 'secondary'}
                onClick={() => setSelectedType('Buyer')}
              >
                Buyers
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="how-it-works-slides-area  sm:px-4">
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{
            clickable: true,
            el: '.swiper-pagination',
          }}
          modules={[Navigation, Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 15 },
            1024: { slidesPerView: 3, spaceBetween: 50 },
          }}
        >
          {steps.map(step => (
            <SwiperSlide key={step.step}>
              <div className="step-card text-left max-w-[400px] w-full">
                <p className="count-number body-bold-medium mb-6 text-mono-0 w-8 h-8 rounded-[2px] bg-mono-100 flex justify-center items-center">
                  {step.step}
                </p>
                <h3 className="step-title font-secondary body-bold-regular font-bold text-mono-100">
                  {step.title}
                </h3>
                <p className="step-number font-secondary body-regular text-mono-100">
                  Step {step.step}
                </p>
                <div className="step-description font-secondary mt-4 text-[16px] text-mono-100 max-w-[400px]">
                  {step.description}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="slider-indicator-area max-w-[1200px] relative flex items-center justify-between mt-12 sm:mt-7">
          <div className="swiper-pagination !relative flex gap-[8px]"></div>
          <div className="swiper-navigation !relative mt-4 gap-4 flex justify-between">
            <div className="swiper-button-prev !left-0 !right-0 !w-12 !h-12 sm:!w-8 sm:!h-8 !relative text-2xl text-[#9B66C2] cursor-pointer hover:text-[#8a59a8]">
              <Image
                src="/images/icons/left-arrow-circle.svg"
                alt="slider angle arrow"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
            </div>
            <div className="swiper-button-next !left-0 !right-0 !w-12 !h-12 sm:!w-8 sm:!h-8 !relative text-2xl text-[#9B66C2] cursor-pointer hover:text-[#8a59a8]">
              <Image
                src="/images/icons/right-arrow-circle.svg"
                alt="slider angle arrow"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPerUserTypeSection;
