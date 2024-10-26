"use client"; // Enable client-side rendering
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/elements';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css"; // Core styles
import "swiper/css/effect-fade"; // Fade effect styles
import { EffectFade, Autoplay } from "swiper/modules"; // Import necessary modules
import { Swiper as SwiperType } from 'swiper'; // Import Swiper type
import Link from 'next/link';

const HomeLandingBanner = () => { 
  const slides = [
    {
      eyebrow: "Giving has never been easier",
      title: "90% of purchase proceedings go straight to your chosen Charity",
      imageSrc: "/images/home/home-banner-modal-1.jpg",
      alt: "banner slides modal image 1"
    },
    {
      eyebrow: "Join the movement",
      title: "Together, we can make a difference!",
      imageSrc: "/images/home/home-banner-modal-1.jpg",
      alt: "banner slides modal image 2"
    },
    {
      eyebrow: "Your impact matters",
      title: "Every contribution counts towards a better tomorrow.",
      imageSrc: "/images/home/home-banner-modal-1.jpg",
      alt: "banner slides modal image 3"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0); // State for active index
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null); // Swiper instance

  return (
    <section className="banner-section bg-mono-100 sm:bg-transparent">
      <div className="banner-container-full sm:px-4 px-0 max-w-[1920px] w-full">
        <div className="banner-section-wrapper">
          <Swiper
            modules={[EffectFade, Autoplay]} 
            spaceBetween={50}
            slidesPerView={1}
            effect="fade" 
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)} 
            autoplay={{
              delay: 5000, 
              disableOnInteraction: false, 
            }}
            onSwiper={setSwiperInstance} // Capture swiper instance
          > 
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="banner-slider-items relative w-full grid grid-cols-12 sm:grid-col-6 sm:flex sm:flex-col-reverse gap-0"> 
                  <div className="banner-slider-left-cont bg-mono-100 max-w-[650px] w-full ml-auto col-span-5 sm:col-span-full pt-[51px] pr-[33px] pb-[52px] pl-10 sm:px-4 sm:py-[33px] relative transition-opacity duration-500 ease-in-out">
                    <div className="banner-content-wrapper h-full opacity-100 transition-opacity duration-500 ease-in-out">
                      <p className="eyebrow-medium mb-[6px] text-mono-0">{slide.eyebrow}</p>
                      <h1 className="banner-title mb-[26px] sm:mb-2 font-primary font-normal text-mono-0 text-[32px] sm:max-w-[313px] sm:text-[20px] sm:leading-[135%] leading-[155%] tracking-[.32px] max-w-[534px] w-full">
                        {slide.title}
                      </h1>
                      <Link href="/auth/register">
                      <Button variant='secondary' className='!text-mono-0 !border-mono-0 hover:!text-mono-100' onClick={() => console.log('Should not click')}>
                        Start giving
                      </Button>
                      </Link>
                    </div>
                    {/* Custom Indicators */}
                    <div className="slides-indicator gap-[2px] flex justify-start mt-4">
                      {slides.map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`slide-indicator-item w-[46px] h-1 rounded-full cursor-pointer ${activeIndex === idx ? 'current-indicator bg-[#474748]' : 'bg-[#474748]'}`}
                          onClick={() => {
                            setActiveIndex(idx); 
                            if (swiperInstance) {
                              swiperInstance.slideTo(idx); // Use swiper instance to navigate
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="banner-slide-right-cont w-full h-[361px] sm:h-[162px] col-span-7 sm:col-span-full relative">
                    <Image 
                      className='banner-slid-modal-img w-full object-cover sm:object-bottom h-full transition-opacity duration-500 ease-in-out' 
                      width={831} 
                      height={361} 
                      src={slide.imageSrc} 
                      alt={slide.alt} 
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default HomeLandingBanner;
