'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartIcon, CloseIcon, MinusIcon, PlusIcon } from '@/icons';
import axios from 'axios';
import { ToastService } from '../elements/notifications/ToastService';
import { Button } from '@/components/elements';
import { useSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const MiniCart = () => {
  const { data: session } = useSession() || {};
  const userId = session?.user?.id;
  const token = session?.token;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchCart = async () => {
    if (!userId || !token) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/cart/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(response.data.cart.items || []); 
    } catch (error) {
      console.log('Failed to load cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity optimistically
  const updateQuantity = (productId, quantityChange) => {
  
    const updatedCart = cartItems.map(item =>
      item.productId._id === productId
        ? { ...item, quantity: Math.max(item.quantity + quantityChange, 0) } 
        : item
    );
    const filteredCart = updatedCart.filter(item => item.quantity > 0); 
    setCartItems(filteredCart);

    // Sync with backend in the background
    syncQuantityWithBackend(productId, quantityChange);
  };

  // Sync quantity with backend
  const syncQuantityWithBackend = async (
    productId,
    quantityChange
  ) => {
    try {
      await axios.post(
        `${API_BASE_URL}/cart/add-product-to-cart`,
        { userId, productId, quantity: quantityChange },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      ToastService.error('Failed to update cart. Backend sync issue.');
      // Re-fetch cart to resolve discrepancies
      await fetchCart();
    }
  };

  // Remove an item from the cart optimistically
  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(
      item => item.productId._id !== productId
    );
    setCartItems(updatedCart); // Optimistic removal

    // Sync with backend
    syncRemoveFromBackend(productId);
  };

  // Sync remove with backend
  const syncRemoveFromBackend = async (productId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/cart/remove`,
        { userId, productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      ToastService.success('Product removed from cart successfully!');
    } catch (error) {
      ToastService.error('Failed to remove product. Please try again.');
      await fetchCart(); // Re-fetch cart on failure
    }
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc + Number(item.productId?.price || 0) * Number(item.quantity || 0),
    0
  );

  // Helper function for item price calculation
  const getItemPrice = (item) => {
    const price = Number(item.productId?.price || 0);
    const quantity = Number(item.quantity || 0);
    return price * quantity;
  };

  useEffect(() => {
    fetchCart();
  }, [userId, token]);

  return (
    <div className="cart-box flex items-center">
      <div className="mini-cart-offcanvas">
        <div className="drawer drawer-end">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="my-drawer-4"
              className="drawer-button btn !bg-transparent !p-0 !border-none"
            >
              {cartItems.length > 0 && (
                <span className="absolute top-[1px] w-5 h-5  right-[-19px] sm:right-[-8px] bg-red-500 text-white text-[11px]  flex items-center justify-center rounded-full p-1">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
              <CartIcon />
            </label>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
            <div className="menu offcanvas-main-wrapper bg-mono-0 text-base-content min-h-full max-w-[439px] w-full p-0">
              <div className="offcanvas-head mini-cart-header-and-main-wrea min-h-full">
                <div className="minicart-header px-6">
                  <div className="cart-head-top border-b pt-8 pb-5 flex justify-between items-center border-b-mono-60">
                    <p className="eyebrow-large">Cart</p>
                    <label
                      htmlFor="my-drawer-4"
                      aria-label="close sidebar"
                      className="close-btn w-8 h-8 flex items-center justify-center cursor-pointer"
                    >
                      <CloseIcon />
                    </label>
                  </div>
                </div>

                <div className="minicart-body-product-info px-6">
                  {loading ? (
                    <p>Loading...</p>
                  ) : cartItems.length === 0 ? (
                    <div className="empty-cart-message my-auto py-12">
                      <p className="font-secondary font-medium text-body-caption text-center text-mono-100">
                        Your cart is empty.
                      </p>
                    </div>
                  ) : (
                    cartItems.map(item => (
                      <div
                        className="cart-add-product-item-wrapper"
                        key={item.productId._id}
                      >
                        <div className="cart-add-product-item flex items-center gap-5 py-5">
                          <div className="minicart-product-img max-w-[116px] sm:max-w-[80px] w-full">
                            <Image
                              src={
                                item.productId.images?.[0]?.url ||
                                '/placeholder.png'
                              }
                              width={116}
                              height={110}
                              alt="Product image"
                              className="object-cover"
                            />
                          </div>
                          <div className="minicart-product-info w-full">
                            <h5 className="body-medium sm:!text-[16px]">
                              {item.productId.brand}
                            </h5>
                            <p className="body-small text-mono-100">
                              {item.productId.name}
                            </p>
                            <p className="body-small text-mono-100">
                              Charity: {'  '}
                              {item.productId?.selectedCharityName ? (
                                <>{item.productId?.selectedCharityName}</>
                              ) : (
                                <>{item.productId?.charity?.charityName}</>
                              )}
                              {'  '}
                              {/* {item.productId?.charity?.addresses[0].country}
                              {item.productId?.seller?.addresses[0].country} */}
                            </p>
                            <div className="minicart-states mt-[23px] flex items-center justify-between gap-2">
                              <div className="minicart-states-group flex items-center gap-3">
                                <div className="product-inc-dsc-states relative p-[6px] max-w-[90px] w-full h-[26px] border border-mono-100 flex items-center justify-between">
                                  <button
                                    className="dsc-btn w-full max-w-[20px] relative top-0 bottom-0 py-[3px] px-[4px] left-0"
                                    onClick={() =>
                                      updateQuantity(item.productId._id, -1)
                                    }
                                  >
                                    <MinusIcon />
                                  </button>
                                  <input
                                    value={item.quantity}
                                    type="text"
                                    className="max-w-[90px] px-2 w-full text-center"
                                    readOnly
                                  />
                                  <button
                                    className="inc-btn relative w-full max-w-[20px] top-0 bottom-0 py-[3px] px-[4px] right-0"
                                    onClick={() =>
                                      updateQuantity(item.productId._id, 1)
                                    }
                                  >
                                    <PlusIcon />
                                  </button>
                                </div>
                                <p className="product-current-price caption">
                                  Price: <br />{' '}
                                  <span>£{getItemPrice(item).toFixed(2)}</span>
                                </p>
                              </div>
                              <Button
                                variant="accend-link"
                                className="!underline !px-0"
                                onClick={() => removeItem(item.productId._id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="offcanvas-main footer-mini-cart-area min-h-full mt-auto">
                <div className="cart-canvas-area min-h-full">
                  <div className="cart-footer-area px-6 pt-[46px] pb-12 sm:py-7">
                    <div className="totat-price flex items-center justify-between">
                      <p className="body-bold-small">Total</p>
                      <p className="body-small">£{totalPrice.toFixed(2)}</p>
                    </div>
                    <p className="info-text forms-bold mt-[9px]">
                      Tax and shipping are calculated at checkout.
                    </p>
                    <Link href="/checkout" className="block">
                      <Button
                        variant="primary"
                        className="max-w-full w-full rounded-[50px] mt-4 !h-12 !body-bold-small !text-mono-0"
                      >
                        Checkout
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniCart;
