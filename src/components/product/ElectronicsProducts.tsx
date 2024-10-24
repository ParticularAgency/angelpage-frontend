import React from 'react';
import CategoryProductSlider from '../common/product-slider/ProductCategorySlider';
import ProductCategoryCardV1 from '../common/cards/product/ProductCategoryCardV1';

interface ElectronicsTopCategoryProductsProps {
  secClassName?: string;
}
const electronicsCategories = [
  { imageSrc: '/images/products/electronics-cat-img1.png', imageAlt: 'Phone', categoryTitle: 'Phone' },
  { imageSrc: '/images/products/electronics-cat-img2.png', imageAlt: 'Laptop', categoryTitle: 'Laptop' },
  { imageSrc: '/images/products/electronics-cat-img3.png', imageAlt: 'Headphone', categoryTitle: 'Headphone' },
  { imageSrc: '/images/products/electronics-cat-img4.png', imageAlt: 'Light', categoryTitle: 'Light' },
  { imageSrc: '/images/products/electronics-cat-img5.png', imageAlt: 'Monitor', categoryTitle: 'Monitor' },
];
const ElectronicsTopCategoryProducts: React.FC<ElectronicsTopCategoryProductsProps> = ({ secClassName }) => {
  return (
    <section className={`product-section ${secClassName || ''} bg-mono-0 pt-20 pb-[70px]`}>
      <div className="custom-container">
        <div className="product-sec-title-box mb-6 flex sm:flex-col items-start justify-between gap-4"> 
          <div className="product-title-box-left-cont">
            <h4 className="title h4">Electronics favourites</h4>
            <p className="body-small mt-2">
              All electronics items are brand new and in the original packaging
            </p>
          </div>
          <div className="product-title-box-right-cont sm:hidden pt-2"></div>
        </div>
      </div>
        <div className="custom-container md:!pr-0">
        <div className="product-category-area sm:pr-8 sm:pl-4 overflow-hidden"> 
             <div className="product-category-wrapper">
                  <CategoryProductSlider
                     sliderId="electronics" // Unique ID for the slider
                     data={electronicsCategories} // Pass the data for the slider
                     Component={ProductCategoryCardV1} // Pass the card component to be used in each slide
                     autoplayDelay={4000} // Optional customization
                     slidesPerView={2} // Custom slidesPerView
                      breakpoints={{
                        640: { slidesPerView: 2, spaceBetween: 10 },  // Breakpoint for small screens
                        768: { slidesPerView: 3, spaceBetween: 15 },  // Breakpoint for medium screens
                        1024: { slidesPerView: 5, spaceBetween: 19 }, // Breakpoint for larger screens
                      }}
                     spaceBetween={20} // Custom space between slides
                  />
             </div>
        </div>
        </div>
    </section>
  );
};

export default ElectronicsTopCategoryProducts;
