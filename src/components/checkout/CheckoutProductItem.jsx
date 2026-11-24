'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import {  useDispatch } from 'react-redux';
import { MinusIcon, PlusIcon } from '@/icons';
import {
  updateItemQuantity,
  removeItem,
  updateGuestItemQuantity,
  removeGuestItem,
} from '../../store/cartSlice';
import {
  calculateProfitSplit,
  getFulfillmentLabel,
  PLATFORM_FEE_PERCENT,
} from '@/lib/profitSplit';
import { formatProductLocation } from '@/lib/productLocation';
import { formatMarketMoney } from '@/lib/marketPreference';
import { useLocale } from '@/i18n/LocaleProvider';

const getProductLocation = product =>
  formatProductLocation(product?.seller, product?.charity);

const CheckoutProductItem = ({
isLoading,
  cartItems = [],
}) => {
  const dispatch = useDispatch();
  const { locale } = useLocale();
  const money = amount => formatMarketMoney(amount, locale);
  const { data: session } = useSession() || {};
  const userId = session?.user?.id;
  const token = session?.token;
  const isGuest = !userId;

  const [loadingItems] = useState([]);
  const [isPriceSplitOpen, setIsPriceSplitOpen] = useState(false);
  const [splitItemIndex, setSplitItemIndex] = useState(null);

  const cartSplits = useMemo(
    () =>
      cartItems.map(item => {
        const total = (item.quantity || 0) * (item.productId?.price || 0);
        const pct = item.productId?.sellerSharePercent ?? 0;
        return calculateProfitSplit(total, pct);
      }),
    [cartItems],
  );

  const handleUpdateQuantity = (productId, quantityChange) => {
    if (isGuest) {
      dispatch(updateGuestItemQuantity({ productId, quantityChange }));
      return;
    }
    dispatch(
      updateItemQuantity({ userId, productId, quantityChange, token })
    );
  };

  const handleRemoveItem = productId => {
    if (isGuest) {
      dispatch(removeGuestItem(productId));
      return;
    }
    dispatch(removeItem({ userId, productId, token }));
  };



  // Handlers for Price Split Modal
  const handlePriceSplitClick = index => {
    setSplitItemIndex(index);
    setIsPriceSplitOpen(true);
  };
  const handleClosePriceSplit = () => {
    setIsPriceSplitOpen(false);
    setSplitItemIndex(null);
  };

if (!cartItems.length) {
  return (
    <>
      <div className="skeleton-basket-product-item basket-product-items">
        <div className="skeleton bg-mono-40 block h-2 w-10 mb-4"></div>
        <div className="basket-added-product-items">
          <div className="basket-added-product-item">
            <div className="basket-product-item-head gap-[23px] flex items-center">
              <div className="seller-info-box flex items-center gap-[13px] pb-4">
                <div className="skeleton bg-mono-40 block h-8 w-8 rounded-full mt-0"></div>
                <div className="seller-info-cont">
                  <div className="skeleton bg-mono-40 block h-2 w-10 mb-2"></div>
                  <div className="skeleton bg-mono-40 block h-2 w-10 mt-0"></div>
                </div>
              </div>
              <div className="delivery-timeline">
                <div className="skeleton bg-mono-40 block h-2 w-24 mt-0"></div>
              </div>
            </div>
            <div className="added-product-item-info-box flex items-center gap-5 justify-between py-8">
              <div className="added-product-item-left-cont flex items-start gap-[18px]">
                <div className="skeleton bg-mono-40 block h-[70px] w-[74px] rounded-[4px] max-w-10 mt-0"></div>
                <div className="added-product-info">
                  <div className="skeleton bg-mono-40 block h-2 w-16 mt-0]"></div>
                  <div className="skeleton bg-mono-40 block h-2 w-16 mt-[3px]"></div>
                  <div className="skeleton bg-mono-40 block h-2 w-16 mt-2"></div>
                  <div className="skeleton bg-mono-40 block h-2 w-16 mt-[13px]"></div>
                </div>
              </div>
              <div className="skeleton bg-mono-40 block h-8 w-24 mt-2"></div>
              <div className="added-product-item-right-cont text-right">
                <div className="skeleton bg-mono-40 block h-2 w-8 mt-2"></div>
                <div className="skeleton bg-mono-40 block h-2 w-8 mt-2"></div>
                <div className="skeleton bg-mono-40 block h-2 w-8 mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
  return (
    <>
      <div className="basket-product-items">
        <h2 className="h5 font-primary text-mono-100 mb-4">Items</h2>
        {cartItems.length > 0 ? (
          <div className="basket-added-product-items">
            {cartItems.map((item, index) => {
              const productId = item.productId?._id || item.productId;
              const split = cartSplits[index];
              const fulfillmentType = item.productId?.fulfillmentType || 'uk_shipping';
              const sellAreas = item.productId?.sellAreas || [];
              const deliveryLabel =
                fulfillmentType === 'uk_shipping'
                  ? 'Est. 5–7 business days'
                  : fulfillmentType === 'personal_delivery'
                    ? 'Personal delivery'
                    : getFulfillmentLabel(fulfillmentType, sellAreas);
              return (
              <div
                className="basket-added-product-item mb-4 rounded-2xl border border-[#E6E3E7] bg-white p-4"
                key={productId}
              >
                <div className="basket-product-item-head gap-[23px] flex  items-center">
                  <div className="seller-info-box flex items-center gap-[13px] sm:gap-2 pb-4">
                    {item.productId?.seller ? (
                      <>
                        <Image
                          src={
                            item.productId?.seller?.profileImage ||
                            '/images/icons/elisp-profile-default-img.svg'
                          }
                          alt="Seller"
                          width={74}
                          height={70}
                          className="w-8 h-8 sm:min-w-7 sm:min-h-7 sm:max-h-7 sm:h-7 rounded-full object-cover"
                        />
                        <div className="seller-info-cont">
                          <p className="caption mb-[2px]">Donated by</p>
                          <p className="eyebrow-medium text-black">
                            {item.productId?.seller?.firstName ||
                              item.productId?.seller?.charityName ||
                              'Unknown'}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Image
                          src={
                            item.productId?.charity?.profileImage ||
                            '/images/icons/elisp-profile-default-img.svg'
                          }
                          alt="Seller"
                          width={74}
                          height={70}
                          className="w-8 h-8 sm:min-w-8 sm:min-h-8 sm:max-h-8 sm:h-8 rounded-full object-cover"
                        />
                        <div className="seller-info-cont">
                          <p className="caption mb-[2px]">Seller</p>
                          <p className="eyebrow-medium sm:eyebrow-small text-black">
                            {item.productId?.charity?.charityName || ''}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="delivery-timeline  pb-4">
                    <span className="p-2 body-bold-small sm:text-[12px] whitespace-nowrap bg-[#FCF2FF] text-primary-color-100 rounded-[24px]">
                      {deliveryLabel}
                    </span>
                  </div>
                </div>
                <div className="added-product-item-info-box  flex items-center sm:items-start gap-5 sm:gap-3 justify-between py-8">
                  <div className="added-product-item-left-cont  flex items-start gap-[18px] sm:gap-3">
                    <Image
                      src={
                        item.productId?.images?.[0]?.url ||
                        '/images/products/default-product.jpg'
                      }
                      alt={item.productId?.name || 'Product Image'}
                      width={74}
                      height={70}
                      className="w-[74px] h-[70px] sm:w-16 sm:h-16  object-cover"
                    />
                    <div className="added-product-info">
                      <p className="product-brand sm:whitespace-nowrap eyebrow-medium text-mono-100">
                        {item.productId?.brand || 'Unknown Brand'}
                      </p>
                      <p className="product-title sm:whitespace-nowrap h-auto! caption-bold mt-[3px] text-mono-70">
                        {item.productId.name || 'Product Name'}
                      </p>
                      <p className="product-specification sm:whitespace-nowrap caption mt-2">
                        {item.productId?.size
                          ? `Size: ${item.productId?.size}`
                          : `Height: ${item.productId?.dimensions?.height || 'N/A'} | Width: ${item.productId?.dimensions?.width || 'N/A'}`}
                      </p>
                      <p className="flex items-center gap-[13px] mt-[13px] caption">
                        {getProductLocation(item.productId) && (
                          <>
                            <Image
                              src="/images/icons/location.svg"
                              alt="location icons"
                              width={10}
                              height={12}
                            />{' '}
                            {getProductLocation(item.productId)}
                          </>
                        )}
                      </p>
                      {split && (
                        <p className="mt-2 text-[11px] font-medium text-[#611192]">
                          {money(split.charityProfit)} to charity
                          {split.sellerProfit > 0
                            ? ` · ${money(split.sellerProfit)} to seller`
                            : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="product-quantity-area w-full sm:hidden  flex gap-[4px] items-center justify-between max-w-[90px] h-[26px] p-[6px] border border-mono-100">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(productId, -1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      <MinusIcon />
                    </button>
                    <span className="text-[14px]">
                      {isLoading ? (
                        <>
                          <div className="skeleton h-2 w-8 px-2 bg-mono-40"></div>
                        </>
                      ) : (
                        <>{item.quantity}</>
                      )}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(productId, 1)
                      }
                    >
                      <PlusIcon />
                    </button>
                  </div>
                  <div className="added-product-item-right-cont sm:w-full sm:max-w-20  text-right">
                    <div className="product-quantity-area w-full   gap-[4px] items-center hidden sm:flex mb-3 justify-between max-w-[90px] h-[26px] p-[6px] border border-mono-100">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(productId, -1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <MinusIcon />
                      </button>
                      <span className="text-[14px]">
                        {isLoading ? (
                          <>
                            <div className="skeleton h-2 w-6 px-2 bg-mono-40"></div>
                          </>
                        ) : (
                          <>{item.quantity}</>
                        )}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(productId, 1)
                        }
                      >
                        <PlusIcon />
                      </button>
                    </div>
                    <p className="body-bold-medium text-mono-100 sm:body-bold-small">
                      {isLoading ? (
                        <>
                          <div className="skeleton h-4 w-20 px-2 bg-mono-40"></div>
                        </>
                      ) : (
                        <>
                          {' '}
                          {money(item.quantity * item.productId?.price)}
                        </>
                      )}
                    </p>
                    <button
                      className="caption mt-2 block ml-auto text-primary-color-100 underline!"
                      onClick={() => handlePriceSplitClick(index)}
                    >
                      Price split
                    </button>
                    <button
                      className="caption block ml-auto btn-styles px-0! accent-btn  text-primary-color-100 underline!"
                      onClick={() => handleRemoveItem(productId)}
                      disabled={loadingItems.includes(productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        ) : (
          <p className="text-mono-70">No items in your basket.</p>
        )}
      </div>

      {/* Price Split Modal */}
      {isPriceSplitOpen && splitItemIndex != null && cartItems[splitItemIndex] && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
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
            <p className="body-small text-mono-70 mb-4 text-center">
              {cartItems[splitItemIndex].productId?.name}
            </p>
            {(() => {
              const split = cartSplits[splitItemIndex];
              const lineTotal =
                cartItems[splitItemIndex].quantity *
                cartItems[splitItemIndex].productId?.price;
              return (
                <div className="space-y-3 rounded-lg border border-[#E8D4F4]/60 bg-[#FAF9FC] p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-mono-70">Item total</span>
                    <span className="font-medium">{money(lineTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mono-70">
                      Platform ({PLATFORM_FEE_PERCENT}%)
                    </span>
                    <span>{money(split.platformFee)}</span>
                  </div>
                  {split.sellerProfit > 0 && (
                    <div className="flex justify-between">
                      <span className="text-mono-70">
                        Seller ({split.sellerSharePercent}%)
                      </span>
                      <span>{money(split.sellerProfit)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-[#E8D4F4]/60 pt-2 font-semibold text-[#611192]">
                    <span>Charity ({split.charitySharePercent}%)</span>
                    <span>{money(split.charityProfit)}</span>
                  </div>
                </div>
              );
            })()}
            <p className="body-small text-mono-90 mt-4">
              Each listing sets its own split when posted. Angelpage keeps{' '}
              {PLATFORM_FEE_PERCENT}% as a platform fee; the rest is shared
              between seller and charity as shown above.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutProductItem;
