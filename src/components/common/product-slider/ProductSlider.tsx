import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation'; // Import Swiper styles

import ProductCard from '@/components/common/cards/product/productCard'; // Adjust import according to your project structure
interface ProductSliderProps {
  sliderId: string; // Add sliderId as a prop for unique className
}

const ProductSlider: React.FC<ProductSliderProps> = ({ sliderId }) => {
  const handleFavoriteClick = () => {
    console.log('Favorite clicked');
  };

const productData = [
    {
        "charityImageSrc": "/images/icons/charity-img.png",
        "charityImageAlt": "The Salvation Army Logo",
        "productImageSrc": "/images/products/product1.png",
        "productImageAlt": "Hollister Crew Neck Jumper",
        "productBrand": "Hollister",
        "productTitle": "Crew Neck Jumper",
        "productSize": "12 UK",
        "productPrice": "£11.50",
        "location": "London"
    },
    {
        "charityImageSrc": "/images/icons/charity-img2.png",
        "charityImageAlt": "RSPCA Logo",
        "productImageSrc": "/images/products/product2.png",
        "productImageAlt": "Jordan Dunks",
        "productBrand": "Jordan",
        "productTitle": "Jordan Dunks",
        "productSize": "10 UK",
        "productPrice": "£40.00",
        "location": "London"
    },
    {
        "charityImageSrc": "/images/icons/charity-img3.png",
        "charityImageAlt": "WaterAid Logo",
        "productImageSrc": "/images/products/product3.png",
        "productImageAlt": "Addison Ross Fine Bone China Mug",
        "productBrand": "Addison Ross",
        "productTitle": "Fine Bone China Mug",
        "productSize": "N/A",
        "productPrice": "£3.00",
        "location": "London"
    },
    {
        "charityImageSrc": "/images/icons/charity-img4.png",
        "charityImageAlt": "Decor Logo",
        "productImageSrc": "/images/products/product4.png",
        "productImageAlt": "Balineum Flora Wall Mirror",
        "productBrand": "Balineum",
        "productTitle": "Flora Wall Mirror",
        "productSize": "100x100",
        "productPrice": "£15.00",
        "location": "London"
    },
    {
        "charityImageSrc": "/images/icons/charity-img4.png",
        "charityImageAlt": "Decor Logo",
        "productImageSrc": "/images/products/product4.png",
        "productImageAlt": "Balineum Flora Wall Mirror",
        "productBrand": "Balineum",
        "productTitle": "Flora Wall Mirror",
        "productSize": "100x100",
        "productPrice": "£15.00",
        "location": "London"
    },
    {
        "charityImageSrc": "/images/icons/charity-img4.png",
        "charityImageAlt": "Decor Logo",
        "productImageSrc": "/images/products/product4.png",
        "productImageAlt": "Balineum Flora Wall Mirror",
        "productBrand": "Balineum",
        "productTitle": "Flora Wall Mirror",
        "productSize": "100x100",
        "productPrice": "£15.00",
        "location": "London"
    }
];


  return (
    <div className="product-slides-area">
      <Swiper
        spaceBetween={14}
        slidesPerView={2} 
        navigation={true}
         modules={[Navigation, Autoplay]} 
           autoplay={{
              delay: 5000, 
              disableOnInteraction: false, 
            }}
        className={`product-slides-area slider-${sliderId}`}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 14,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 18,
          }, 
          1024: {
            slidesPerView: 5,
            spaceBetween: 22,
          },
        }}
      > 
        {productData.map((product, index) => (
          <SwiperSlide key={index}>
            <ProductCard
              charityImageSrc={product.charityImageSrc}
              charityImageAlt={product.charityImageAlt}
              productImageSrc={product.productImageSrc}
              productImageAlt={product.productImageAlt}
              productBrand={product.productBrand}
              productTitle={product.productTitle}
              productSize={product.productSize}
              productPrice={product.productPrice}
              location={product.location}
              onFavoriteClick={handleFavoriteClick}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
