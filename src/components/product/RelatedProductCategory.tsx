import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard from '../common/cards/product/productCard'; // Ensure this path is correct
import { Product } from '@/types/productTypes';


interface RelatedCategoryProductsProps {
  secClassName?: string;
  isLoggedIn: boolean;
}

const RelatedCategoryProducts: React.FC<RelatedCategoryProductsProps> = ({ secClassName, isLoggedIn }) => {
  // Define product data with all provided details
  const productData: Product[] = [
    {
      id: 1,
      charityImageSrc: "/images/icons/charity-img.png",
      charityImageAlt: "The Salvation Army Logo",
      productImageSrc: "/images/products/product1.png",
      productImageAlt: "Hollister Crew Neck Jumper",
      productBrand: "Hollister",
      productTitle: "Crew Neck Jumper",
      productSize: "12 UK",
      productPrice: "£11.50",
      location: "London",
      onFavoriteClick: () => handleFavoriteClick(0),
      isLoggedIn,
    },
    {
      id: 2,
      charityImageSrc: "/images/icons/charity-img2.png",
      charityImageAlt: "RSPCA Logo",
      productImageSrc: "/images/products/product2.png",
      productImageAlt: "Jordan Dunks",
      productBrand: "Jordan",
      productTitle: "Jordan Dunks",
      productSize: "10 UK",
      productPrice: "£40.00",
      location: "London",
      onFavoriteClick: () => handleFavoriteClick(1),
      isLoggedIn,
    },
    {
      id: 3,
      charityImageSrc: "/images/icons/charity-img3.png",
      charityImageAlt: "WaterAid Logo",
      productImageSrc: "/images/products/product3.png",
      productImageAlt: "Addison Ross Fine Bone China Mug",
      productBrand: "Addison Ross",
      productTitle: "Fine Bone China Mug",
      productSize: "N/A",
      productPrice: "£3.00",
      location: "London",
      onFavoriteClick: () => handleFavoriteClick(2),
      isLoggedIn,
    },
    {
      id: 4,
      charityImageSrc: "/images/icons/charity-img4.png",
      charityImageAlt: "Decor Logo",
      productImageSrc: "/images/products/product4.png",
      productImageAlt: "Balineum Flora Wall Mirror",
      productBrand: "Balineum",
      productTitle: "Flora Wall Mirror",
      productSize: "100x100",
      productPrice: "£15.00",
      location: "London",
      onFavoriteClick: () => handleFavoriteClick(3),
      isLoggedIn,
    },
    {
      id: 5,
      charityImageSrc: "/images/icons/charity-img4.png",
      charityImageAlt: "Decor Logo",
      productImageSrc: "/images/products/product4.png",
      productImageAlt: "Balineum Flora Wall Mirror",
      productBrand: "Balineum",
      productTitle: "Flora Wall Mirror",
      productSize: "100x100",
      productPrice: "£15.00",
      location: "London",
      onFavoriteClick: () => handleFavoriteClick(4),
      isLoggedIn,
    },
    {
      id: 6,
      charityImageSrc: "/images/icons/charity-img4.png",
      charityImageAlt: "Decor Logo",
      productImageSrc: "/images/products/product4.png",
      productImageAlt: "Balineum Flora Wall Mirror",
      productBrand: "Balineum",
      productTitle: "Flora Wall Mirror",
      productSize: "100x100",
      productPrice: "£15.00",
      location: "London",
      onFavoriteClick: () => handleFavoriteClick(5),
      isLoggedIn,
    }
  ];

  const handleFavoriteClick = (index: number) => {
    console.log(`Favorite clicked on product ${index}`);
    // Additional logic for handling favorites can be added here
  };

  return (
    <section className={`product-section ${secClassName || 'bg-[#f1f1f7] pt-[35px] pb-5'}`}>
      <div className="custom-container">
        <div className="product-sec-title-box mb-10 flex sm:flex-col items-start justify-between gap-4">
          <div className="product-title-box-left-cont">
            <h4 className="title h4">You may like</h4>
            <p className="body-small mt-2 empty:hidden"></p>
          </div>
          <div className="product-title-box-right-cont sm:hidden pt-2"></div>
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
              640: { slidesPerView: 2, spaceBetween: 10 },  // Breakpoint for small screens
              768: { slidesPerView: 3, spaceBetween: 15 },  // Breakpoint for medium screens
              1024: { slidesPerView: 5, spaceBetween: 19 }, // Breakpoint for larger screens
            }}
          >
            {productData.map((item, index) => (
              <SwiperSlide key={index}>
                <ProductCard {...item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default RelatedCategoryProducts;
