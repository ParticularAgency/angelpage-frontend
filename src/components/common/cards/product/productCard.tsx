import React from 'react';
import Image from 'next/image';
import { FavoriteOutlineIcon, LocationIcon } from '@/icons'; // Adjust paths based on your structure
import { Button } from '@/components/elements';

// Define the prop types for the ProductCard component
interface ProductCardProps {
  charityImageSrc: string;
  charityImageAlt: string;
  productImageSrc: string;
  productImageAlt: string;
  productBrand: string;
  productTitle: string;
  productSize: string;
  productPrice: string;
  location: string;
  onFavoriteClick: () => void;
  isLoggedIn?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  charityImageSrc,
  charityImageAlt,
  productImageSrc,
  productImageAlt,
  productBrand,
  productTitle,
  productSize,
  productPrice,
  location,
  onFavoriteClick,
  isLoggedIn,
}) => {

  return (
    <div className="product-card-item bg-mono-0 max-w-[289px] sm:min-w-[160px]   w-full px-[15px] py-4 flex flex-col gap-[33px]"> 
      <div className="product-head-cont flex justify-between">
        <div className="donate-charity-img h-[46px] flex items-center">
          <Image
            src={charityImageSrc}
            alt={charityImageAlt}
            className="w-full h-full object-cover"
            width={46}
            height={46}
          />
        </div>
        <div className="favorite-btn cursor-pointer" onClick={onFavoriteClick}>
          <FavoriteOutlineIcon />
        </div>
      </div>

      <div className="product-body-cont">
        <div className="product-image-modal px-8 w-full flex justify-center items-center">
          <Image
            className="max-w-[116px] h-[110px] w-full min-w-[118px] object-cover sm:h-auto"
            src={productImageSrc}
            alt={productImageAlt}
            width={180}
            height={170}
          />
        </div>
      </div>

      <div className="product-footer-cont">
        <div className="product-info-box">
          <div className="product-info">
            <div className="prod-title-box flex gap-1 justify-between items-start">
            <h6 className="product-brand-title eyebrow-medium">{productBrand}</h6>
              <p className="product-price  sm:hidden body-bold-small">{productPrice}</p>
            </div>
            <p className="product-title caption-bold sm:h-[33px] mt-[3px] text-mono-60">{productTitle}</p>
            <div className="product-size-and-aspect mt-3 eyebrow-small">{productSize}</div>
          </div>
          <p className="product-price mt-3 hidden sm:block body-bold-small">{productPrice}</p>
        </div>
        <div className="product-location mt-4 flex items-center gap-2">
          <span>
            <LocationIcon />
          </span>
          <span className="location-text caption">{location}</span>
        </div>
        <div className="product-card-btn-box">
          {/* Uncomment and modify the button if needed */}
         {isLoggedIn && (
          <Button variant='primary' className='w-full max-w-full mt-3' type='submit' onClick={() => console.log('Add to basket')} >Add to basket</Button>
         )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
