import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCategoryCardV1 from '../common/cards/product/ProductCategoryCardV1';

interface HomewareTopCategoryProductsProps {
  secClassName?: string;
}

const homewareCategories = [
  {
    productImageSrc: '/images/products/homeware-cat-img1.png',
    productImageAlt: 'Cutlery',
    productTitle: 'Cutlery',
  },
  {
    productImageSrc: '/images/products/homeware-cat-img2.png',
    productImageAlt: 'Bedding',
    productTitle: 'Bedding',
  },
  {
    productImageSrc: '/images/products/homeware-cat-img3.png',
    productImageAlt: 'Crockery',
    productTitle: 'Crockery',
  },
  {
    productImageSrc: '/images/products/homeware-cat-img4.png',
    productImageAlt: 'Decor',
    productTitle: 'Decor',
  },
  {
    productImageSrc: '/images/products/homeware-cat-img5.png',
    productImageAlt: 'Curtains',
    productTitle: 'Curtains',
  },
];

const HomewareTopCategoryProducts: React.FC<
  HomewareTopCategoryProductsProps
> = ({ secClassName }) => {
  return (
    <section
      className={`product-section ${secClassName || ''} bg-mono-0 pt-20 pb-[70px]`}
    >
      <div className="custom-container">
        <div className="product-sec-title-box mb-6 flex sm:flex-col items-start justify-between gap-4">
          <div className="product-title-box-left-cont">
            <h4 className="title h4">Homeware favourites</h4>
            <p className="body-small mt-2">
              All homeware items are brand new and in the original packaging
            </p>
          </div>
          <div className="product-title-box-right-cont sm:hidden pt-2"></div>
        </div>
      </div>
      <div className="custom-container md:!pr-0">
        <div className="product-category-area sm:pr-8 sm:pl-4 overflow-hidden">
          <div className="product-category-wrapper">
            <Swiper
              spaceBetween={20}
              slidesPerView={2}
              navigation
              modules={[Navigation, Autoplay]}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 10 }, // Breakpoint for small screens
                768: { slidesPerView: 3, spaceBetween: 15 }, // Breakpoint for medium screens
                1024: { slidesPerView: 5, spaceBetween: 19 }, // Breakpoint for larger screens
              }}
            >
              {homewareCategories.map((category, index) => (
                <SwiperSlide key={index}>
                  <ProductCategoryCardV1
                    productImageSrc={category.productImageSrc}
                    productImageAlt={category.productImageAlt}
                    productTitle={category.productTitle}
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

export default HomewareTopCategoryProducts;
