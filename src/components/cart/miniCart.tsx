import { CartIcon, CloseIcon, MinusIcon, PlusIcon } from '@/icons';
import React, { useState } from 'react';
import { Button } from '../elements';
import Image from 'next/image';

const MiniCart = () => {
  // State to hold the quantity of products in the cart
  const [productQuantity, setProductQuantity] = useState(1);

  // Function to handle incrementing the product quantity
  const incrementQuantity = () => {
    setProductQuantity(prevQuantity => prevQuantity + 1);
  };

  // Function to handle decrementing the product quantity, but not going below 1
  const decrementQuantity = () => {
    if (productQuantity > 1) {
      setProductQuantity(prevQuantity => prevQuantity - 1);
    }
  };

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
              <CartIcon />
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-4"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <div className="menu offcanvas-main-wrapper bg-mono-0 text-base-content min-h-full max-w-[430px] w-full p-0">
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
                  <div className="empty-cart-message my-auto py-12 hidden">
                    <p className="font-secondary font-medium text-body-caption text-center text-mono-100">
                      Cart is empty
                    </p>
                  </div>

                  <div className="cart-add-product-item-wrapper">
                    <div className="cart-add-product-item flex items-center gap-5 py-5">
                      <div className="minicart-product-img">
                        <Image
                          src="/images/products/product1.png"
                          width={116}
                          height={110}
                          alt="product small image"
                        />
                      </div>
                      <div className="minicart-product-info">
                        <h5 className="body-medium">Hollister</h5>
                        <p className="body-small">Crew Neck Jumper</p>
                        <p className="body-small flex items-center gap-1">
                          Charity: <span>The Salvation Army</span>
                        </p>
                        <div className="minicart-states mt-[23px] flex items-center justify-between">
                          <div className="minicart-states-group flex items-center gap-3">
                            <div className="product-inc-dsc-states relative p-[6px] max-w-[90px] w-full h-[26px] border border-mono-100 flex items-center justify-between">
                              <button
                                className="dsc-btn w-full max-w-[20px] absolute top-0 bottom-0 py-[3px] px-[4px] left-0"
                                onClick={decrementQuantity}
                              >
                                <MinusIcon />
                              </button>
                              <input
                                value={productQuantity}
                                type="text"
                                className="max-w-[90px] px-2 w-full text-center"
                                name="productTotalNumber"
                                id="productTotalNumber"
                                readOnly
                              />
                              <button
                                className="inc-btn absolute w-full max-w-[20px] top-0 bottom-0 py-[3px] px-[4px] right-0"
                                onClick={incrementQuantity}
                              >
                                <PlusIcon />
                              </button>
                            </div>
                            <p className="product-current-price caption-bold">
                              Price: <br /> <span>£24.99</span>
                            </p>
                          </div>
                          <Button variant="accend-link">Remove</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="offcanvas-main footer-mini-cart-area min-h-full mt-auto">
                <div className="cart-canvas-area min-h-full">
                  <div className="cart-footer-area px-6 pt-[46px] pb-12">
                    <div className="totat-price flex items-center justify-between">
                      <p className="body-bold-small">Total</p>
                      <p className="body-small">
                        £{(24.99 * productQuantity).toFixed(2)}
                      </p>
                    </div>
                    <p className="info-text forms-bold mt-[9px]">
                      Tax and shipping are calculated at checkout
                    </p>
                    <Button
                      variant="primary"
                      className="max-w-full w-full rounded-[50px] mt-4"
                      onClick={() => console.log('Should not click')}
                    >
                      Checkout
                    </Button>
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
