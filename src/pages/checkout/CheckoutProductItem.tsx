"use client"
import React, { useState } from 'react';
import Image from 'next/image';

const CheckoutProductIttem = () => {
      const [isPriceSplitOpen, setIsPriceSplitOpen] = useState(false);
  // Handlers for Price Split Modal
  const handlePriceSplitClick = () => setIsPriceSplitOpen(true);
  const handleClosePriceSplit = () => setIsPriceSplitOpen(false);
  return (
    <>
      <div className="basket-product-items">
        <h2 className="h5 font-primary text-mono-100 mb-4">Items</h2>
        <div className="basket-added-product-items">
          <div className="basket-added-product-item">
            <div className="basket-product-item-head gap-[23px] flex items-center">
              <div className="seller-info-box flex items-center gap-[13px] pb-4">
                <Image
                  src="/images/users/users1.jpg"
                  alt="Seller"
                  width={74}
                  height={70}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="seller-info-cont">
                  <p className="caption mb-[2px]">Seller</p>
                  <p className="eyebrow-medium text-black">WHITNEY MOSS</p>
                </div>
              </div>
              <div className="delivery-timeline">
                <span className="p-2 body-bold-small bg-[#FCF2FF] text-primary-color-100 rounded-[24px]">
                  5-7 business days
                </span>
              </div>
            </div>
            <div className="added-product-item-info-box flex items-start gap-5 justify-between py-8">
              <div className="added-product-item-left-cont flex items-start gap-[18px]">
                <Image
                  src="/images/products/handbags.png"
                  alt="Seller"
                  width={74}
                  height={70}
                  className="w-[74px] h-[70px] object-cover"
                />
                <div className="added-product-info">
                  <p className="product-brand eyebrow-medium text-mono-100">
                    PRADA
                  </p>
                  <p className="product-title caption-bold mt-[3px] text-mono-70">
                    Handbag
                  </p>
                  <p className="product-specification caption mt-2">
                    Height: 00in &nbsp;|&nbsp; Weight: 00in
                  </p>
                  <p className="flex items-center gap-[13px] mt-[13px] caption">
                    <Image
                      src="/images/icons/location.svg"
                      alt="location icons"
                      width={10}
                      height={12}
                    />{' '}
                    London
                  </p>
                </div>
              </div>
              <div className="added-product-item-right-cont">
                <p className="body-bold-medium text-mono-100">£60.00</p>
                <button
                  className="caption mt-2 text-primary-color-100 !underline"
                  onClick={handlePriceSplitClick}
                >
                  Price split
                </button>
              </div>
            </div>
          </div>
          <div className="basket-added-product-item pt-6">
            <div className="basket-product-item-head gap-[23px] flex items-center">
              <div className="seller-info-box flex items-center gap-[13px] pb-4">
                <Image
                  src="/images/users/users2.jpg"
                  alt="Seller"
                  width={74}
                  height={70}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="seller-info-cont">
                  <p className="caption mb-[2px]">Seller</p>
                  <p className="eyebrow-medium text-black">Mike Hilll</p>
                </div>
              </div>
              <div className="delivery-timeline">
                <span className="p-2 body-bold-small bg-[#FCF2FF] text-primary-color-100 rounded-[24px]">
                  5-7 business days
                </span>
              </div>
            </div>
            <div className="added-product-item-info-box flex items-start gap-5 justify-between py-8">
              <div className="added-product-item-left-cont flex items-start gap-[18px]">
                <Image
                  src="/images/products/product2.png"
                  alt="Seller"
                  width={74}
                  height={70}
                  className="w-[74px] h-[70px] object-cover"
                />
                <div className="added-product-info">
                  <p className="product-brand eyebrow-medium text-mono-100">
                    Jordan
                  </p>
                  <p className="product-title caption-bold mt-[3px] text-mono-70">
                    Jordan Dunks
                  </p>
                  <p className="product-specification caption mt-2">
                    Size: 10 UK
                  </p>
                  <p className="flex items-center gap-[13px] mt-[13px] caption">
                    <Image
                      src="/images/icons/location.svg"
                      alt="location icons"
                      width={10}
                      height={12}
                    />{' '}
                    Manchester
                  </p>
                </div>
              </div>
              <div className="added-product-item-right-cont">
                <p className="body-bold-medium text-mono-100">£60.00</p>
                <button
                  className="caption mt-2 text-primary-color-100 !underline"
                  onClick={handlePriceSplitClick}
                >
                  Price split
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
                  The charity that hosts the item will receive 90% of the total
                  cost of the item.
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
                  Angelpage administration fees:
                </h4>
                <p className="body-small text-mono-90">
                  Angelpage retains the remaining 10% of each item cost. This
                  helps Angelpage support users of the platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CheckoutProductIttem
