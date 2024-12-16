'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { MinusIcon, PlusIcon } from '@/icons';

interface Seller {
  firstName: string;
  lastName: string;
  profileImage: string;
  addresses: { city: string; country: string }[]; // Fixed to be an array of objects
}

interface Product {
  _id: string; // Backend uses _id
  name: string;
  price: number;
  brand: string;
  size?: string;
  condition?: string;
  images: Array<{ url: string; altText?: string }>;
  location?: string;
  charity: {
    charityName: string;
    profileImage: string;
  };
  dimensions?: {
    height?: string;
    width?: string;
  };
  seller: Seller;
}

interface CartItem {
  productId: Product;
  quantity: number;
}

interface CheckoutProductItemProps {
  cartItems: CartItem[] | undefined; 
  setCartItems: (items: CartItem[]) => void;
}

const CheckoutProductItem = ({
  cartItems = [],
  setCartItems,
}: CheckoutProductItemProps) => {
  const { data: session } = useSession() || {};
  const userId = session?.user?.id;
  const token = session?.token;

  const [isPriceSplitOpen, setIsPriceSplitOpen] = useState(false);

const updateCart = async (productId: string, quantityChange: number) => {
  try {
    // Filter and update cart items
    const updatedCart: CartItem[] = cartItems
      .map(item => {
        if (item.productId._id === productId) {
          const newQuantity = item.quantity + quantityChange;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      })
      .filter((item): item is CartItem => item !== null); // Type guard to exclude null values

    // API call to update the cart
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/cart/add-product-to-cart`,
      { userId, productId, quantity: quantityChange },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Update state with the filtered cart
    setCartItems(updatedCart);
  } catch (error) {
    console.error('Error updating cart:', error);
  }
};

  const handleRemoveItem = async (productId: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/remove`,
        { userId, productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(cartItems.filter(item => item.productId._id !== productId));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // Handlers for Price Split Modal
  const handlePriceSplitClick = () => setIsPriceSplitOpen(true);
  const handleClosePriceSplit = () => setIsPriceSplitOpen(false);

  return (
    <>
      <div className="basket-product-items">
        <h2 className="h5 font-primary text-mono-100 mb-4">Items</h2>
        {cartItems.length > 0 ? (
          <div className="basket-added-product-items">
            {cartItems.map((item: CartItem) => (
              <div
                className="basket-added-product-item"
                key={item.productId._id}
              >
                <div className="basket-product-item-head gap-[23px] flex items-center">
                  <div className="seller-info-box flex items-center gap-[13px] pb-4">
                    <Image
                      src={
                        item.productId?.seller?.profileImage ||
                        '/images/users/default-seller.jpg'
                      }
                      alt="Seller"
                      width={74}
                      height={70}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="seller-info-cont">
                      <p className="caption mb-[2px]">Seller</p>
                      <p className="eyebrow-medium text-black">
                        {item.productId?.seller?.firstName || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="delivery-timeline">
                    <span className="p-2 body-bold-small bg-[#FCF2FF] text-primary-color-100 rounded-[24px]">
                      5-7 business days
                    </span>
                  </div>
                </div>
                <div className="added-product-item-info-box flex items-center gap-5 justify-between py-8">
                  <div className="added-product-item-left-cont flex items-start gap-[18px]">
                    <Image
                      src={
                        item.productId?.images?.[0]?.url ||
                        '/images/products/default-product.jpg'
                      }
                      alt={item.productId?.name || 'Product Image'}
                      width={74}
                      height={70}
                      className="w-[74px] h-[70px] object-cover"
                    />
                    <div className="added-product-info">
                      <p className="product-brand eyebrow-medium text-mono-100">
                        {item.productId?.brand || 'Unknown Brand'}
                      </p>
                      <p className="product-title caption-bold mt-[3px] text-mono-70">
                        {item.productId.name || 'Product Name'}
                      </p>
                      <p className="product-specification caption mt-2">
                        {item.productId?.size
                          ? `Size: ${item.productId?.size}`
                          : `Dimensions: ${item.productId?.dimensions?.height || 'N/A'} x ${item.productId?.dimensions?.width || 'N/A'}`}
                      </p>
                      <p className="flex items-center gap-[13px] mt-[13px] caption">
                        <Image
                          src="/images/icons/location.svg"
                          alt="location icons"
                          width={10}
                          height={12}
                        />{' '}
                        {item.productId?.seller?.addresses[0]?.city ||
                          (item.productId?.seller?.addresses[0]?.country && (
                            <>
                              {item.productId?.seller?.addresses[0]?.city ||
                                'Unknown City'}
                              ,{' '}
                              {item.productId?.seller?.addresses[0]?.country ||
                                'Unknown Country'}
                            </>
                          ))}
                      </p>
                    </div>
                  </div>
                  <div className="product-quantity-area w-full flex gap-[4px] items-center justify-between max-w-[90px] h-[26px] p-[6px] border border-mono-100">
                    <button onClick={() => updateCart(item.productId._id, -1)}>
                      <MinusIcon />
                    </button>
                    <span className="text-[14px]">{item.quantity}</span>
                    <button onClick={() => updateCart(item.productId._id, 1)}>
                      <PlusIcon />
                    </button>
                  </div>
                  <div className="added-product-item-right-cont text-right">
                    <p className="body-bold-medium text-mono-100">
                      £{(item.quantity * item.productId?.price).toFixed(2)}
                    </p>
                    <button
                      className="caption mt-2 block ml-auto text-primary-color-100 !underline"
                      onClick={handlePriceSplitClick}
                    >
                      Price split
                    </button>
                    <button
                      className="caption block ml-auto btn-styles !px-0 accent-btn  text-primary-color-100 !underline"
                      onClick={() => handleRemoveItem(item.productId._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-mono-70">No items in your basket.</p>
        )}
      </div>

      {/* Price Split Modal */}
      {isPriceSplitOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-mono-0 w-full max-w-md pt-[27px] pr-4 pb-16 pl-[23px] sm:pt-7 sm:px-4 sm:pb-9 relative">
            <button
              className="absolute top-4 right-4 p-[9.5px] text-gray-500 hover:text-gray-700"
              onClick={handleClosePriceSplit}
            >
              &times;
            </button>
            <h3 className="h6 font-primary mb-[23px] text-mono-100 text-center">
              Price split
            </h3>
            <div className="flex items-start gap-[9px]">
              <Image
                src="/images/icons/hand-help.svg"
                alt="info icon image"
                className="mt-[2px]"
                width={13}
                height={13}
              />
              <div>
                <h4 className="body-bold-small mb-[5px] text-primary-color-100">
                  Charity profit:
                </h4>
                <p className="body-small text-mono-90">
                  The charity hosting the item will receive 90% of the item's
                  total cost.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-[9px] mt-[29px]">
              <Image
                src="/images/icons/Info-quare.svg"
                alt="info icon image"
                className="mt-[2px]"
                width={13}
                height={13}
              />
              <div>
                <h4 className="body-bold-small mb-[5px] text-primary-color-100">
                  Administration fees:
                </h4>
                <p className="body-small text-mono-90">
                  Angelpage retains 10% of each item's cost to support platform
                  operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutProductItem;
