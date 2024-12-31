'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateItemQuantity, removeItem } from '@/store/cartSlice';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { CartIcon, MinusIcon, PlusIcon, CloseIcon } from '@/icons';
import Link from 'next/link';
import { Button } from '@/components/elements';

const MiniCart = () => {
  const { data: session } = useSession() || {};
  const userId = session?.user?.id;
  const token = session?.token;

  const dispatch = useDispatch();
  const {
    items: cartItems,
    totalItems,
    status,
  } = useSelector(state => state.cart);

  useEffect(() => {
    if (userId && token) {
      dispatch(fetchCart({ userId, token }));
    }
  }, [userId, token, dispatch]);

  const handleUpdateQuantity = (productId, quantityChange) => {
    dispatch(updateItemQuantity({ userId, productId, quantityChange, token }));
  };

  const handleRemoveItem = productId => {
    dispatch(removeItem({ userId, productId, token }));
  };
console.log('cart item response:' , cartItems)
const totalPrice = cartItems.reduce((acc, item) => {
  const price = item?.productId?.price || 0; // Use 0 if price is missing
  const quantity = item?.quantity || 0; // Use 0 if quantity is missing
  return acc + price * quantity;
}, 0);


  return (
    <div className="cart-box flex items-center">
      <div className="mini-cart-offcanvas">
        <div className="drawer drawer-end">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="my-drawer-4"
              className="drawer-button relative btn !bg-transparent !p-0 !border-none"
            >
              {status === 'loading' ? (
                <span className="absolute top-[1px] w-5 h-5 right-[-10px] sm:right-[-8px] bg-gray-500 text-white text-[11px] flex items-center justify-center rounded-full p-1">
                  ...
                </span>
              ) : totalItems > 0 ? (
                <span className="absolute top-[1px] w-5 h-5 right-[-9px] sm:right-[-8px] bg-red-500 text-white text-[11px] flex items-center justify-center rounded-full p-1">
                  {totalItems}
                </span>
              ) : null}
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
                      className="close-btn w-8 h-8 flex items-center justify-center cursor-pointer"
                    >
                      <CloseIcon />
                    </label>
                  </div>
                </div>
                <div className="minicart-body-product-info px-6">
                  {status === 'loading' ? (
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
                        key={item?.productId?._id}
                      >
                        <div className="cart-add-product-item flex items-center gap-5 py-5">
                          <Image
                            src={
                              item?.productId?.images?.[0]?.url ||
                              '/placeholder.png'
                            }
                            width={116}
                            height={110}
                            alt="Product"
                            className="object-cover"
                          />
                          <div className="minicart-product-info w-full">
                            <h5 className="body-medium sm:!text-[16px]">
                              {item?.productId?.brand}
                            </h5>
                            <p className="body-small text-mono-100">
                              {item?.productId?.name}
                            </p>
                            <p className="body-small text-mono-100">
                              Charity:{' '}
                              {item?.productId?.selectedCharityName ||
                                item?.productId?.charity?.charityName}
                            </p>
                            <div className="minicart-states mt-[23px] flex items-center justify-between gap-2">
                              <div className="minicart-states-group flex items-center gap-3">
                                <div className="product-inc-dsc-states relative p-[6px] max-w-[90px] w-full h-[26px] border border-mono-100 flex items-center justify-between">
                                  <button
                                    className="dsc-btn"
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        item?.productId?._id,
                                        -1
                                      )
                                    }
                                    disabled={item.quantity <= 1}
                                  >
                                    <MinusIcon />
                                  </button>
                                  <input
                                    value={item.quantity}
                                    type="text"
                                    readOnly
                                    className="max-w-[90px] px-2 w-full text-center"
                                  />
                                  <button
                                    className="inc-btn"
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        item?.productId?._id,
                                        1
                                      )
                                    }
                                  >
                                    <PlusIcon />
                                  </button>
                                </div>
                                <p className="product-current-price caption">
                                  £{item?.productId?.price}
                                </p>
                              </div>
                              <Button
                                variant="accend-link"
                                className="!underline !px-0"
                                onClick={() =>
                                  handleRemoveItem(item?.productId?._id)
                                }
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
  );
};

export default MiniCart;
