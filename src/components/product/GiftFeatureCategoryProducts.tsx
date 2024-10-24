import React from 'react';
import ProductSlider from '../common/product-slider/ProductSlider';
import ProductCard from '../common/cards/product/productCard';

interface GiftFeaturedCategoryProductsProps {
  secClassName?: string;
  isLoggedIn: boolean;
}

const GiftFeaturedCategoryProducts: React.FC<GiftFeaturedCategoryProductsProps> = ({ secClassName,isLoggedIn }) => {

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
const handleFavoriteClick = (index: number) => {
  console.log(`Favorite clicked on product ${index}`);
};
  return (
    <section className={`product-section ${secClassName || 'bg-[#f1f1f7] pt-20 pb-[25px]'}`}>
      <div className="custom-container">
        <div className="product-sec-title-box mb-10 flex sm:flex-col items-start justify-between gap-4">
          <div className="product-title-box-left-cont">
            <h4 className="title h4">Gifts for a loved one?</h4>
            <p className="body-small mt-2">
              Here are some great gift ideas!
            </p>
          </div>
          <div className="product-title-box-right-cont sm:hidden pt-2"></div> 
        </div>
      </div>
        <div className="custom-container md:!pr-0">
        <div className="product-slides-area pr-[16px] pl-[10px] sm:pr-8 sm:pl-0 overflow-hidden"> 
          
           <ProductSlider 
           sliderId="GiftFeaturedCategoryProducts"
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

export default GiftFeaturedCategoryProducts;
