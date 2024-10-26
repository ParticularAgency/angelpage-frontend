// src/components/common/product-slider/ProductSlider.tsx

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Product } from '@/types/productTypes';

interface CategoryProductSliderProps {
  sliderId: string;
  data: Product[];
  Component: React.FC<Product>;
  isLoggedIn?: boolean; // Add isLoggedIn prop
  autoplayDelay?: number;
  slidesPerView?: number;
  breakpoints?: {
    [breakpoint: number]: { slidesPerView: number; spaceBetween: number };
  };
  spaceBetween?: number;
}

const ProductSlider: React.FC<CategoryProductSliderProps> = ({
  sliderId,
  data,
  Component,
  isLoggedIn, // Destructure isLoggedIn prop
  autoplayDelay = 5000,
  slidesPerView = 2,
  breakpoints,
  spaceBetween = 10,
}) => (
  <div className={`product-slides-area slider-${sliderId}`}>
    <Swiper
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
      navigation
      modules={[Navigation, Autoplay]}
      autoplay={{ delay: autoplayDelay, disableOnInteraction: false }}
      breakpoints={breakpoints}
    >
      {data.map((item, index) => (
        <SwiperSlide key={index}>
          <Component {...item} isLoggedIn={isLoggedIn} />{' '}
          {/* Pass isLoggedIn down to the component */}
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);

export default ProductSlider;
