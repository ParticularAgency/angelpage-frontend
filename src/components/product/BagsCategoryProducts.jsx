'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard from '../common/cards/product/productCard';
import ProductSkeletonCard from '../common/cards/product/productskeletonCard';
import { useGetProductsByCategoryPathQuery } from '@/store/api/angelpageApi';
import { formatProductLocation } from '@/lib/productLocation';

const BagsCategoryProducts = ({ secClassName }) => {
  const {
    data: productData = [],
    isLoading: loading,
    isError,
  } = useGetProductsByCategoryPathQuery('bags');
  const error = isError ? 'Failed to load products. Please try again.' : null;

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <section
      className={`product-section ${secClassName || 'bg-[#f1f1f7] pt-8 pb-[70px]'}`}
    >
      <div className="custom-container">
        <div className="product-sec-title-box mb-10 flex sm:flex-col items-start justify-between gap-4">
          <div className="product-title-box-left-cont">
            <h4 className="title h4">Bags</h4>
            <p className="body-small mt-2">From vintage to new age fashion</p>
          </div>
        </div>
      </div>
      <div className="custom-container md:pr-0!">
        <div className="product-slides-area pr-[16px] pl-[10px] sm:pr-8 sm:pl-0 overflow-hidden">
          <Swiper
            spaceBetween={20}
            slidesPerView={2}
            navigation
            modules={[Navigation, Autoplay]}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 10 },
              768: { slidesPerView: 3, spaceBetween: 15 },
              1024: { slidesPerView: 4.3, spaceBetween: 19 },
            }}
          >
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <SwiperSlide key={`skeleton-${index}`}>
                    <ProductSkeletonCard />
                  </SwiperSlide>
                ))
              : productData.map(item => {
                  const location = formatProductLocation(item.seller, item.charity);

                  return (
                    <SwiperSlide key={item.id} className="h-auto!">
                      <div className="h-full">
                      <ProductCard
                        {...item}
                        id={item._id}
                        slug={item.slug}
                        charityImageSrc={item.charity?.profileImage}
                        charityImageAlt={
                          item.charity?.charityName || 'Charity Image'
                        }
                        dimensionHeight={item.dimensions?.height || ''}
                        dimensionWidth={item.dimensions?.width || ''}
                        location={location}
                        status={item.status}
                      />
                      </div>
                    </SwiperSlide>
                  );
                })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default BagsCategoryProducts;
