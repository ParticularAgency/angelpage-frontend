import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface Product {
  id: string; // Unique identifier for each product
  charityImageSrc: string;
  charityImageAlt?: string;
  productImageSrc: string;
  productImageAlt?: string;
  productBrand?: string;
  productTitle?: string;
  productSize?: string;
  productPrice?: string;
  location?: string;
  category?: string;
  subcategory: string;
  productCondition: string;
}

interface CategoryProductSliderProps {
  sliderId: string; // Add sliderId as a prop for unique className
  data: Product[]; // Data for the slider items (generalized to any array)
  Component: React.FC<Product>; // A component that will be rendered inside the slider
  autoplayDelay?: number; // Optional autoplay delay
  slidesPerView?: number; // Default slidesPerView
  breakpoints?: { [breakpoint: number]: { slidesPerView: number; spaceBetween: number } }; // Custom breakpoints for the slider
  spaceBetween?: number; // Optional space between slides
}

const CategoryProductSlider: React.FC<CategoryProductSliderProps> = ({
  sliderId,
  data,
  Component, 
  autoplayDelay = 5000,
  slidesPerView = 2,
  breakpoints,
  spaceBetween = 10,
}) => {
  return (
    <div className="product-slides-area">
      <Swiper
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        navigation={true}
        modules={[Navigation, Autoplay]}
        autoplay={{
          delay: autoplayDelay,
          disableOnInteraction: false,
        }}
        className={`product-slides-area slider-${sliderId}`}
        breakpoints={breakpoints || {
          640: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 19,
          },
        }}
      >

        {data.map((item) => (
          <SwiperSlide key={item.id}> {/* Use unique id as key */}
            <Component {...item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategoryProductSlider;
