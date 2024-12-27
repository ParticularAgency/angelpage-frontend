'use client';

import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Checkmark, LocationIcon } from '@/icons';
import { Button } from '@/components/elements';
import FavoriteButton from '@/components/elements/button/FavoriteButton';
import { ToastService } from '@/components/elements/notifications/ToastService';
import {useSelector,  useDispatch } from 'react-redux';
import { addOrUpdateProduct } from '@/store/cartSlice';
import { useSession } from 'next-auth/react';


const ProductCard  = ({
  id,
  charityImageSrc = '/images/icons/elisp-profile-default-img.svg',
  charityImageAlt = 'Charity Image',
  images = [],
  brand = '',
  name = '',
  size = '',
  price = '',
  location = '',
  dimensionHeight = '',
  dimensionWidth = '',
  isLoggedIn = false,
}) => {
  const dispatch = useDispatch();
  const { data: session } = useSession() || {};
  const userId = session?.user?.id;
  const token = session?.token;
 const cartItems = useSelector(state => state.cart.items);
  // Local state for "Added to Cart" button
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // Sync local state with Redux store on mount and when cartItems change
  useEffect(() => {
    const productInCart = cartItems.some(item => item.productId === id);
    setIsAddedToCart(productInCart);
  }, [cartItems, id]);
  // Check if the product is already in the cart
  // const isAddedToCart = cartItems.some(item => item.productId === id);
  const handleAddToCart = async () => {
    if (!token) {
      ToastService.error('Please log in to add products to your cart.');
      return;
    }

    try {
      // Dispatch Redux action to add or update product in the cart
      await dispatch(
        addOrUpdateProduct({
          userId,
          productId: id,
          token,
        })
      );
      ToastService.success('Product added to cart!');
      setIsAddedToCart(true);
    } catch (error) {
      ToastService.error('Failed to add product to cart.');
      console.error('Error adding product to cart:', error);
    }
  };
  const validatedImageSrc =
    images[0]?.url &&
    (images[0].url.startsWith('/') || images[0].url.startsWith('http'))
      ? images[0].url
      : '/images/products/card-placeholder-image.webp';

  return (
    <div
      className="product-card-item bg-mono-0 max-w-[289px] sm:min-w-[160px] w-full px-[15px] py-4 flex flex-col gap-[33px]"
      key={id}
    >
      {/* Product Header */}
      <div className="product-head-cont flex justify-between">
        <div className="donate-charity-img h-[46px] flex items-center">
          <Image
            src={
              charityImageSrc.startsWith('/') ||
              charityImageSrc.startsWith('http')
                ? charityImageSrc
                : '/images/icons/elisp-profile-default-img.svg'
            }
            alt={charityImageAlt}
            width={500}
            height={500}
            className="w-full h-full sm:w-8 sm:h-8  object-cover rounded-[4px]"
          />
        </div>
        <FavoriteButton itemId={id} type="Product" />
      </div>

      {/* Product Image */}
      <Link href={`/product/${id}`} passHref>
        <div className="product-body-cont px-8 sm:px-0 w-full flex justify-center items-center">
          <Image
            className="max-w-[116px] h-[110px] w-full object-cover sm:object-contain"
            src={
              validatedImageSrc ||
              '/images/products/card-placeholder-image.webp'
            }
            alt={images[0]?.altText || 'Product Image'}
            width={180}
            height={170}
          />
        </div>
      </Link>

      {/* Product Information */}
      <div className="product-info-box">
        <div className="product-info">
          <div className="prod-title-box flex gap-1 justify-between items-start">
            <Link href={`/product/${id}`} passHref>
              <h6 className="product-brand-title eyebrow-medium">{brand}</h6>
            </Link>
            <p className="product-price body-bold-small">£{price || 'N/A'}</p>
          </div>
          <Link href={`/product/${id}`} passHref>
            <p className="product-title text-mono-60 h-9 overflow-hidden caption-bold">
              {name}
            </p>
          </Link>
          <div className="product-size eyebrow-small mt-3">
            {size ? (
              <>{size}</>
            ) : (
              <>
                Height: {dimensionHeight} | Width: {dimensionWidth}
              </>
            )}
          </div>
        </div>

        {/* Location Information */}
        <div className="product-location flex items-center gap-2 mt-4">
          <LocationIcon />
          <span className="location-text caption">{location}</span>
        </div>

        {/* Add to Basket Button */}
        {isLoggedIn && (
          <div className="product-card-btn-states">
            {isAddedToCart ? (
              <Button
                variant="primary"
                className="w-full mt-3 flex items-center justify-center"
                disabled
              >
                <Checkmark /> Added
              </Button>
            ) : (
              <Button
                variant="primary"
                className="w-full mt-3"
                onClick={handleAddToCart}
              >
                Add to basket
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

