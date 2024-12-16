'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LocationIcon } from '@/icons';
import { useSession } from 'next-auth/react';
import { ToastService } from '@/components/elements/notifications/ToastService';
import { Button } from '@/components/elements';
import FavoriteButton from '@/components/elements/button/FavoriteButton';
import axios from 'axios';

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartResponse {
  cart: {
    items: CartItem[];
  };
}

interface AddToCartResponse {
  cart: {
    items: CartItem[];
  };
}

interface ProductCardProps {
  id: string;
  charityImageSrc?: string;
  charityImageAlt?: string;
  images: Array<{ url: string; altText?: string }>;
  brand?: string;
  name?: string;
  size?: string;
  price?: string;
  location?: string;
  isLoggedIn?: boolean;
  dimensionHeight?: string;
  dimensionWidth?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
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
  const { data: session } = useSession();
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false);

  const fetchCartCount = useCallback(async () => {
    if (!session?.token || !session.user?.id) return;

    try {
      const response = await axios.get<CartResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/${session.user.id}`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
      const cartItems = response.data.cart.items || [];
      setIsAddedToCart(cartItems.some(item => item.productId === id));
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  }, [session, id]);

  const handleAddToCart = async () => {
    if (!session?.token) {
      ToastService.error(
        'You need to be logged in to add products to the cart.'
      );
      return;
    }

    setIsAddedToCart(true);

    try {
      await axios.post<AddToCartResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/add-product-to-cart`,
        {
          userId: session.user.id,
          productId: id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
      ToastService.success('Product added to cart successfully!');
    } catch (error) {
      ToastService.error(
        'Failed to add product to cart. Please try again later.'
      );
      setIsAddedToCart(false);
    }
  };

useEffect(() => {
  if (isLoggedIn && session) {
    fetchCartCount();
  }
}, [isLoggedIn, session, fetchCartCount]);

  return (
    <div
      className="product-card-item bg-mono-0 max-w-[289px] sm:min-w-[160px] w-full px-[15px] py-4 flex flex-col gap-[33px]"
      key={id}
    >
      {/* Product Header */}
      <div className="product-head-cont flex justify-between">
        <div className="donate-charity-img h-[46px] flex items-center">
          <Image
            src={charityImageSrc}
            alt={charityImageAlt}
            width={500}
            height={500}
            className="w-full h-full object-cover rounded-[4px]"
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
              images[0]?.url || '/images/icons/elisp-profile-default-img.svg'
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
                variant="secondary"
                className="w-full mt-3 flex items-center justify-center"
                disabled
              >
                ✅ Added
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
