'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Link from 'next/link';
import ProductCard from '../common/cards/product/productCard';
import ProductSkeletonCard from '../common/cards/product/productskeletonCard';
import { Button } from '../elements';
import { useGetAllProductsQuery } from '@/store/api/angelpageApi';

const PromotedProductsStrip = () => {
  const { data: products = [], isLoading: loading } = useGetAllProductsQuery({
    promoted: 'true',
  });

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="product-section bg-[#FCF2FF] pt-[31px] pb-10">
      <div className="custom-container">
        <div className="product-sec-title-box mb-10 flex sm:flex-col items-start justify-between gap-4">
          <div>
            <h4 className="title h4">Promoted listings</h4>
            <p className="body-small mt-2">
              Featured items supporting charities on Angelpage.
            </p>
          </div>
          <Link href="/product" className="sm:hidden">
            <Button variant="primary">View marketplace</Button>
          </Link>
        </div>
        {loading ? (
          <ProductSkeletonCard />
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1.2}
            navigation
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 4.3 },
            }}
          >
            {products.map(product => (
              <SwiperSlide key={product._id || product.id}>
                <ProductCard
                  id={product._id || product.id}
                  slug={product.slug}
                  charityImageSrc={product.charity?.profileImage}
                  charityImageAlt={product.charity?.charityName || 'Charity Image'}
                  images={product.images}
                  brand={product.brand}
                  name={product.name}
                  size={product.size}
                  price={product.price}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default PromotedProductsStrip;
