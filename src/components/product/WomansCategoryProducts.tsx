import React from 'react';
import ProductSlider from '../common/product-slider/ProductSlider';

interface WomansCategoryProductsProps {
  secClassName?: string;  // Optional class name for section
}

const WomansCategoryProducts: React.FC<WomansCategoryProductsProps> = ({ secClassName }) => {
  return (
    <section className={`product-section ${secClassName || ''} bg-[#f1f1f7] pt-[75px] pb-[83px] sm:pt-16`}>
      <div className="custom-container">
        <div className="product-sec-title-box mb-10 flex items-start justify-between gap-4">
          <div className="product-title-box-left-cont">
            <h4 className="title h4">Shop Woman’s</h4>
          </div>
          <div className="product-title-box-right-cont pt-2">
          </div>
        </div>
      </div>
      <div className="custom-container md:!pr-0">
        <div className="product-slides-area pr-[20px] pl-[10px] sm:pr-8 sm:pl-0 overflow-hidden"> 
          <ProductSlider sliderId="womanCategoryProduct" />
        </div>
        </div>
    </section>
  );
};

export default WomansCategoryProducts;
