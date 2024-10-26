import React from 'react';
import Image from 'next/image';
import { FavoriteOutlineIcon, LocationIcon } from '@/icons';
import { Button } from '@/components/elements';
import {Product} from '@/types/productTypes'
import Link from 'next/link';



const ProductCard: React.FC<Product> = ({
  id,
  charityImageSrc = "",
  charityImageAlt = "",
  productImageSrc = "",
  productImageAlt = "",
  productBrand= "",
  productTitle= "",
  productSize = "",
  productPrice = "",
  location = "",
 onFavoriteClick,
  isLoggedIn,
}) => (
  <div className="product-card-item bg-mono-0 max-w-[289px] sm:min-w-[160px] w-full px-[15px] py-4 flex flex-col gap-[33px]" key={id}>
    {/* Product Header */}
    <div className="product-head-cont flex justify-between">
      <div className="donate-charity-img h-[46px] flex items-center">
        <Image
          src={charityImageSrc ?? ""}
          alt={charityImageAlt ?? ""}
          width={46}
          height={46}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="favorite-btn cursor-pointer" onClick={onFavoriteClick}>
        <FavoriteOutlineIcon />
      </div>
    </div>

    {/* Product Image */}
    <Link href="/product/1">
    <div className="product-body-cont px-8 w-full flex justify-center items-center">
      <Image
        className="max-w-[116px] h-[110px] w-full object-cover"
        src={productImageSrc ?? ""}
        alt={productImageAlt ?? ""}
        width={180}
        height={170}
      />
    </div>
    </Link>

    {/* Product Information */}
    <div className="product-info-box">
      <div className="product-info">
        <div className="prod-title-box flex gap-1 justify-between items-start">
          <Link href="/product/1">
          <h6 className="product-brand-title eyebrow-medium">{productBrand ?? ""}</h6>
          </Link>
          <p className="product-price body-bold-small">{productPrice ?? ""}</p>
        </div>
        <Link href="/product/1">
        <p className="product-title text-mono-60 caption-bold">{productTitle ?? ""}</p>
        </Link>
        <div className="product-size eyebrow-small mt-3">{productSize ?? ""}</div>
      </div>

      {/* Location Information */}
      <div className="product-location flex items-center gap-2 mt-4">
        <LocationIcon />
        <span className="location-text caption">{location ?? ""}</span>
      </div>

      {/* Add to Basket Button */}
      {isLoggedIn && (
        <Button
          variant="primary"
          className="w-full mt-3"
          onClick={() => console.log('Add to basket')}
        >
          Add to basket
        </Button>
      )}
    </div>
  </div>
);

export default ProductCard;
