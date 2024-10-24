import React from 'react';
import ProductSlider from '../common/product-slider/ProductSlider';
import ProductCard from '../common/cards/product/productCard';
import {productData} from '@/libs/productData'

interface BagsCategoryProductsProps {
  secClassName?: string;
  isLoggedIn: boolean;
}

const BagsCategoryProducts: React.FC<BagsCategoryProductsProps> = ({ secClassName, isLoggedIn }) => {



  const handleFavoriteClick = (index: number) => {
    console.log(`Favorite clicked on product ${index}`);
  };

  return (
    <section className={`product-section ${secClassName || 'bg-[#f1f1f7] pt-[13px] pb-10'}`}>
      <div className="custom-container">
        <div className="product-sec-title-box mb-10 flex sm:flex-col items-start justify-between gap-4">
          <div className="product-title-box-left-cont">
            <h4 className="title h4">Shop now to support a great cause</h4>
            <p className="body-small mt-2">
              Want to support a charity or a cause important to you? Take a look at the items available.
            </p>
          </div>
          <div className="product-title-box-right-cont sm:hidden pt-2"></div> 
        </div>
      </div>
      <div className="custom-container md:!pr-0">
        <div className="product-slides-area pr-[16px] pl-[10px] sm:pr-8 sm:pl-0 overflow-hidden"> 
          <ProductSlider 
            sliderId="BagsCategoryProducts"
            data={productData} // Pass product data
            Component={ProductCard} // Pass the product card component
            isLoggedIn={isLoggedIn} // Example: User is logged in
            handleFavoriteClick={handleFavoriteClick} // Optional favorite click handler
            autoplayDelay={3000} // Customize autoplay delay
            slidesPerView={2} // Customize slidesPerView
             breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 10 },  // Breakpoint for small screens
              768: { slidesPerView: 3, spaceBetween: 15 },  // Breakpoint for medium screens
              1024: { slidesPerView: 5, spaceBetween: 19 }, // Breakpoint for larger screens
            }}
            spaceBetween={20} // Customize space between slides
          />
        </div>
      </div>
    </section>
  );
};

export default BagsCategoryProducts;