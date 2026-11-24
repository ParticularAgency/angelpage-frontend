'use client';

import React, { useState } from 'react';
import { Button } from '@/components/elements';
import { ArrowDownIcon } from '@/icons';
import { calculateProfitSplit } from '@/lib/profitSplit';

interface CartProduct {
  brand: string;
  name: string;
  price: number;
  sellerSharePercent?: number;
  charityProfit?: number;
}

interface CartItem {
  quantity: number;
  productId: CartProduct;
}

interface BasketAreaProps {
  onPay: () => void;
  cartItems: CartItem[];
  isLoading: boolean;
  shipmentCost: number;
  grandTotal: number;
}

function lineSplit(item: CartItem) {
  const price = item?.productId?.price || 0;
  const qty = item?.quantity || 0;
  const total = price * qty;
  const pct = item?.productId?.sellerSharePercent ?? 0;
  const split = calculateProfitSplit(total, pct);
  return split;
}

const BasketArea: React.FC<BasketAreaProps> = ({
  onPay,
  cartItems = [],
  isLoading,
  shipmentCost,
  grandTotal,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [loading, setLoading] = useState(false);

  const totalProductPrice = cartItems.reduce((acc, item) => {
    const price = item?.productId?.price || 0;
    const quantity = item?.quantity || 0;
    return acc + price * quantity;
  }, 0);

  const totals = cartItems.reduce(
    (acc, item) => {
      const split = lineSplit(item);
      return {
        charity: acc.charity + split.charityProfit,
        platform: acc.platform + split.platformFee,
        seller: acc.seller + split.sellerProfit,
      };
    },
    { charity: 0, platform: 0, seller: 0 },
  );

  const handlePayClick = async () => {
    setLoading(true);
    await onPay();
    setLoading(false);
  };

  return (
    <div className="basket-page-right-cont sm:order-1 col-span-5 md:col-span-6 sm:col-span-full">
      <div className="basket-page-right-cont-wrapper border py-6 bg-[#F1F1F7]">
        <div className="flex justify-between items-end px-6">
          <h3 className="body-bold-medium mb-4">Order summary</h3>
          <p className="font-semibold product-total-price">
            £{totalProductPrice.toFixed(2)}
          </p>
        </div>

        <div className="order-item-list-box">
          <p
            className={`colaps-title body-regular px-6 mb-4 cursor-pointer flex items-center gap-[4px] ${
              isCollapsed ? 'collapsed' : 'collapsed-open'
            }`}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            Order details{' '}
            <span className="number-of-product-for-price">
              ({cartItems.length} items)
            </span>{' '}
            <span className="arrow-down">
              <ArrowDownIcon />
            </span>
          </p>
          {!isCollapsed && (
            <div className="product-list px-6">
              {cartItems.map((item, index) => {
                const split = lineSplit(item);
                return (
                  <div className="mb-6" key={index}>
                    <p className="eyebrow-medium">{item.productId.brand}</p>
                    <p className="caption-bold sm:text-[14px] mt-1 text-mono-80">
                      {item.productId.name}
                    </p>
                    <div className="flex justify-between mt-2 caption-bold">
                      <p className="caption text-mono-80">Price</p>
                      <p className="caption text-mono-100 mt-1">
                        £{(item.quantity * item.productId.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between caption-bold">
                      <p className="caption text-mono-80">Charity</p>
                      <p className="caption text-mono-100 mt-1">
                        £{split.charityProfit.toFixed(2)}
                      </p>
                    </div>
                    {split.sellerProfit > 0 && (
                      <div className="flex justify-between caption-bold">
                        <p className="caption text-mono-80">Seller share</p>
                        <p className="caption text-mono-100 mt-1">
                          £{split.sellerProfit.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="summary-foot border-t pt-6 px-6">
          <div className="flex justify-between mb-2">
            <p className="caption text-mono-80">Angelpage platform fee</p>
            <p className="caption text-mono-100">
              £{totals.platform.toFixed(2)}
            </p>
          </div>
          {totals.seller > 0 && (
            <div className="flex justify-between mb-2">
              <p className="caption text-mono-80">Seller share</p>
              <p className="caption text-mono-100">
                £{totals.seller.toFixed(2)}
              </p>
            </div>
          )}
          <div className="flex justify-between mb-2">
            <p className="caption text-mono-80">Charity total</p>
            <p className="caption text-mono-100">
              £{totals.charity.toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="caption text-mono-80">Shipping cost</p>
            <p className="caption text-mono-100">£{shipmentCost.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex justify-between font-bold px-6 border-t pt-4 mt-4">
          <p className="body-bold-medium product-total-price">Total</p>
          <p className="body-bold-medium sm:text-[16px] text-mono-100">
            £{grandTotal.toFixed(2)}
          </p>
        </div>

        <div className="pay px-6 mt-3">
          <Button
            className="w-full"
            variant="primary"
            onClick={handlePayClick}
            disabled={loading || isLoading}
          >
            {loading || isLoading ? 'Processing...' : 'Payment proceed '}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BasketArea;
