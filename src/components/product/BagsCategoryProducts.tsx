import React from 'react';
import ProductSlider from '../common/product-slider/ProductSlider';
import ProductCard from '../common/cards/product/productCard';
import { productData } from '@/libs/productData';
import { Product } from '@/types/productTypes'; // Import Product type

interface BagsCategoryProductsProps {
  secClassName?: string;
  isLoggedIn: boolean;
}

const BagsCategoryProducts: React.FC<BagsCategoryProductsProps> = ({
  secClassName,
  isLoggedIn,
}) => {
  const handleFavoriteClick = (index: number) => {
    console.log(`Favorite clicked on product ${index}`);
  };

  // Transforming product data to ensure correct types
  const productCardsData: Product[] = productData.map((product, index) => ({
    ...product,
    id: product.id, // Keep id as a number
    onFavoriteClick: () => handleFavoriteClick(index), // Add the required onFavoriteClick function
  }));

  return (
    <section
      className={`product-section ${secClassName || 'bg-[#f1f1f7] pt-8 pb-[70px]'}`} 
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
        </div>
      </div>
      <div className="custom-container md:!pr-0">
        <div className="product-slides-area pr-[16px] pl-[10px] sm:pr-8 sm:pl-0 overflow-hidden">
          <ProductSlider
            sliderId="BagsCategoryProducts"
            data={productCardsData}
            Component={ProductCard}
            isLoggedIn={isLoggedIn}
            autoplayDelay={3000}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 10 },
              768: { slidesPerView: 3, spaceBetween: 15 },
              1024: { slidesPerView: 5, spaceBetween: 19 },
            }}
            spaceBetween={20}
          />
        </div>
      </div>
    </section>
  );
};

export default BagsCategoryProducts;
