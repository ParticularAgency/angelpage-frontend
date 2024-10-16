import React from 'react';
import { Button } from '../elements';
import ProductSlider from '../common/product-slider/ProductSlider';

interface TopCategoryProductsProps {
  secClassName?: string;  // Optional class name for section
}

const TopCategoryProducts: React.FC<TopCategoryProductsProps> = ({ secClassName }) => {
  return (
    <section className={`product-section ${secClassName || ''} bg-[#f1f1f7] pt-[31px]`}>
      <div className="custom-container">
        <div className="product-sec-title-box mb-10 flex sm:flex-col items-start justify-between gap-4">
          <div className="product-title-box-left-cont">
            <h4 className="title h4">Shop now to support a great cause</h4>
            <p className="body-small mt-2">
              Want to support a charity or a cause important to you? Take a look at the items available.
            </p>
          </div>
          <div className="product-title-box-right-cont sm:hidden pt-2">
            <Button variant="primary" onClick={() => console.log('View all clicked')}>
              View all
            </Button>
          </div>
        </div>
      </div>
        <div className="custom-container md:!pr-0">
        <div className="product-slides-area pr-[16px] pl-[10px] sm:pr-8 sm:pl-0 overflow-hidden"> 
          <ProductSlider sliderId="topCategoryProduct" />
          <div className="product-btn-box hidden sm:flex justify-center pt-8">
            <Button variant="primary" className='sm:hidden' onClick={() => console.log('View all clicked')}>
              View all
            </Button>
          </div>
        </div>
        </div>
    </section>
  );
};

export default TopCategoryProducts;
