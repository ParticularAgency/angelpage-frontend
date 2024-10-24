import React from 'react';
import CategoryProductSlider from '../common/product-slider/ProductCategorySlider';
import ProductCategoryCardV1 from '../common/cards/product/ProductCategoryCardV1';

interface HomewareTopCategoryProductsProps {
  secClassName?: string;

}
const homewareCategories = [
  { imageSrc: '/images/products/homeware-cat-img1.png', imageAlt: 'Cutlery', categoryTitle: 'Cutlery' },
  { imageSrc: '/images/products/homeware-cat-img2.png', imageAlt: 'Bedding', categoryTitle: 'Bedding' },
  { imageSrc: '/images/products/homeware-cat-img3.png', imageAlt: 'Crockery', categoryTitle: 'Crockery' },
  { imageSrc: '/images/products/homeware-cat-img4.png', imageAlt: 'Decor', categoryTitle: 'Decor' },
  { imageSrc: '/images/products/homeware-cat-img5.png', imageAlt: 'Curtains', categoryTitle: 'Curtains' },
];
const HomewareTopCategoryProducts: React.FC<HomewareTopCategoryProductsProps> = ({ secClassName }) => {
  return (
    <section className={`product-section ${secClassName || ''} bg-mono-0 pt-20 pb-[70px]`}>
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
                  <CategoryProductSlider
                     sliderId="homeware" // Unique ID for the slider
                     data={homewareCategories} // Pass the data for the slider
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

export default HomewareTopCategoryProducts;
