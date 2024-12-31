'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCategoryCardV1 from '../common/cards/product/ProductCategoryCardV1';

interface ElectronicsTopCategoryProductsProps {
  secClassName?: string;
}

const electronicsCategories = [
  {
    id: '1',
    imageSrc: '/images/products/electronics-cat-img1.png',
    productCategory: '/product?category=electronics&subcategory=phones',
    imageAlt: 'Phone',
    categoryTitle: 'Phone',
  },
  {
    id: '2',
    imageSrc: '/images/products/electronics-cat-img2.png',
    productCategory: '/product?category=electronics&subcategory=laptops',
    imageAlt: 'Laptop',
    categoryTitle: 'Laptop',
  },
  {
    id: '3',
    imageSrc: '/images/products/electronics-cat-img3.png',
    productCategory: '/product?category=electronics&subcategory=headphone',
    imageAlt: 'Headphone',
    categoryTitle: 'Headphone',
  },
  {
    id: '4',
    imageSrc: '/images/products/electronics-cat-img4.png',
    productCategory: '/product?category=electronics&subcategory=light',
    imageAlt: 'Light',
    categoryTitle: 'Light',
  },
  {
    id: '5',
    imageSrc: '/images/products/electronics-cat-img5.png',
    productCategory: '/product?category=electronics&subcategory=monitor',
    imageAlt: 'Monitor',
    categoryTitle: 'Monitor',
  },
];

const ElectronicsTopCategoryProducts: React.FC<
  ElectronicsTopCategoryProductsProps
> = ({ secClassName }) => {
  return (
    <section
      className={`product-section ${secClassName || ''} bg-mono-0 pt-20 pb-[70px]`}
    >
      <div className="custom-container">
        <div className="product-sec-title-box mb-6 flex sm:flex-col items-start justify-between gap-4">
          <div className="product-title-box-left-cont">
            <h4 className="title h4">Electronics Favourites</h4>
            <p className="body-small mt-2">
              All electronics items are brand new and in the original packaging
            </p>
          </div>
        </div>
      </div>
      <div className="custom-container md:!pr-0">
        <div className="product-category-area sm:pr-8 sm:pl-4 overflow-hidden">
          <div className="product-category-wrapper">
            <Swiper
              spaceBetween={20}
              slidesPerView={2}
              navigation={true}
              modules={[Navigation, Autoplay]}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              className="product-slides-area slider-electronics"
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 10 },
                768: { slidesPerView: 3, spaceBetween: 15 },
                1024: { slidesPerView: 5, spaceBetween: 19 },
              }}
            >
              {electronicsCategories.map(item => (
                <SwiperSlide key={item.id}>
                  <ProductCategoryCardV1
                    productCategory={item.productCategory}
                    productImageSrc={item.imageSrc}
                    productImageAlt={item.imageAlt}
                    productTitle={item.categoryTitle}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ElectronicsTopCategoryProducts;
