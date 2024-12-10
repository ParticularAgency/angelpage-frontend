import React from 'react';
import { Button } from '../elements';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard from '../common/cards/product/productCard'; // Ensure the path is correct
import { Product } from '@/types/productTypes';
import Link from 'next/link';
interface TopCategoryProductsProps {
  secClassName?: string;
  isLoggedIn: boolean;
}

const TopCategoryProducts: React.FC<TopCategoryProductsProps> = ({
  secClassName,
  isLoggedIn,
}) => {
  // Full product data
  const productData: Product[] = [
    {
      id: 1,
      charityImageSrc: '/images/icons/charity-img.png',
      charityImageAlt: 'The Salvation Army Logo',
      productImageSrc: '/images/products/product1.png',
      productImageAlt: 'Hollister Crew Neck Jumper',
      productBrand: 'Hollister',
      productTitle: 'Crew Neck Jumper',
      productSize: '12 UK',
      productPrice: '£11.50',
      location: 'London',
      // onFavoriteClick: () => handleFavoriteClick(0),
      isLoggedIn,
    },
    {
      id: 2,
      charityImageSrc: '/images/icons/charity-img2.png',
      charityImageAlt: 'RSPCA Logo',
      productImageSrc: '/images/products/product2.png',
      productImageAlt: 'Jordan Dunks',
      productBrand: 'Jordan',
      productTitle: 'Jordan Dunks',
      productSize: '10 UK',
      productPrice: '£40.00',
      location: 'London',
      // onFavoriteClick: () => handleFavoriteClick(1),
      isLoggedIn,
    },
    {
      id: 3,
      charityImageSrc: '/images/icons/charity-img3.png',
      charityImageAlt: 'WaterAid Logo',
      productImageSrc: '/images/products/product3.png',
      productImageAlt: 'Addison Ross Fine Bone China Mug',
      productBrand: 'Addison Ross',
      productTitle: 'Fine Bone China Mug',
      productSize: 'N/A',
      productPrice: '£3.00',
      location: 'London',
      // onFavoriteClick: () => handleFavoriteClick(2),
      isLoggedIn,
    },
    {
      id: 4,
      charityImageSrc: '/images/icons/charity-img4.png',
      charityImageAlt: 'Decor Logo',
      productImageSrc: '/images/products/product4.png',
      productImageAlt: 'Balineum Flora Wall Mirror',
      productBrand: 'Balineum',
      productTitle: 'Flora Wall Mirror',
      productSize: '100x100',
      productPrice: '£15.00',
      location: 'London',
      // onFavoriteClick: () => handleFavoriteClick(3),
      isLoggedIn,
    },
    {
      id: 5,
      charityImageSrc: '/images/icons/charity-img4.png',
      charityImageAlt: 'Decor Logo',
      productImageSrc: '/images/products/product4.png',
      productImageAlt: 'Balineum Flora Wall Mirror',
      productBrand: 'Balineum',
      productTitle: 'Flora Wall Mirror',
      productSize: '100x100',
      productPrice: '£15.00',
      location: 'London',
      // onFavoriteClick: () => handleFavoriteClick(4),
      isLoggedIn,
    },
    {
      id: 6,
      charityImageSrc: '/images/icons/charity-img4.png',
      charityImageAlt: 'Decor Logo',
      productImageSrc: '/images/products/product4.png',
      productImageAlt: 'Balineum Flora Wall Mirror',
      productBrand: 'Balineum',
      productTitle: 'Flora Wall Mirror',
      productSize: '100x100',
      productPrice: '£15.00',
      location: 'London',
      // onFavoriteClick: () => handleFavoriteClick(5),
      isLoggedIn,
    },
  ];

  // const handleFavoriteClick = (index: number) => {
  //   console.log(`Favorite clicked on product ${index}`);
  //   // Additional logic for handling favorites can be added here
  // };

  return (
    <section
      className={`product-section ${secClassName || 'bg-[#f1f1f7] pt-[31px]'}`}
    >
      <div className="custom-container">
        <div className="product-sec-title-box mb-10 flex sm:flex-col items-start justify-between gap-4">
          <div className="product-title-box-left-cont">
            <h4 className="title h4">Shop now to support a great cause</h4>
            <p className="body-small mt-2">
              Want to support a charity or a cause important to you? Take a look
              at the items available.
            </p>
          </div>
          <div className="product-title-box-right-cont sm:hidden pt-2">
            <Link href="/product">
              <Button
                variant="primary"
                onClick={() => console.log('View all clicked')}
              >
                View all
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="custom-container md:!pr-0">
        <div className="product-slides-area pr-[16px] pl-[10px] sm:pr-8 sm:pl-0 overflow-hidden">
          <Swiper
            spaceBetween={20}
            slidesPerView={2}
            navigation
            modules={[Navigation, Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 10 },
              768: { slidesPerView: 3, spaceBetween: 15 },
              1024: { slidesPerView: 5, spaceBetween: 19 },
            }}
          >
            {productData.map((item, index) => (
              <SwiperSlide key={index}>
                <ProductCard {...item} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="product-btn-box hidden sm:flex justify-center pt-8">
            <Link href="/product">
              <Button
                variant="primary"
                onClick={() => console.log('View all clicked')}
              >
                View all
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopCategoryProducts;
