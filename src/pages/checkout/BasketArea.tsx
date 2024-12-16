'use client';

import React, { useState } from 'react';
import { Button } from '@/components/elements';
import { ArrowDownIcon } from '@/icons';
interface Product {
  brand: string;
  name: string;
  price: number;
}
interface CartItem {
  quantity: number;
  productId: Product;
}
interface BasketAreaProps {
  onPay: () => void;
  cartItems: CartItem[];
}

const BasketArea: React.FC<BasketAreaProps> = ({ onPay, cartItems = [] }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [loading] = useState(false);

  // Total calculations
  const totalProductPrice = (cartItems || []).reduce(
    (sum, item) => sum + item.quantity * item.productId.price,
    0
  );
  const charityProfit = totalProductPrice * 0.9; // 90% for charity
  const adminFee = totalProductPrice * 0.1; // 10% for admin fee

  return (
    <div className="basket-page-right-cont col-span-5 md:col-span-6 sm:col-span-full">
      <div className="basket-page-right-cont-wrapper border py-6 bg-[#F1F1F7]">
        <div className="flex justify-between items-end px-6">
          <h3 className="body-bold-medium mb-4">Order summary</h3>
          <p className="font-semibold product-total-price">
            £{totalProductPrice.toFixed(2)}
          </p>
        </div>

        {/* Collapsible Order Details */}
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
                const productCharityProfit =
                  item.quantity * item.productId.price * 0.9; // 90% for charity
                return (
                  <div className="mb-6" key={index}>
                    <p className="eyebrow-medium">{item.productId.brand}</p>
                    <p className="caption-bold text-mono-80">
                      {item.productId.name}
                    </p>
                    <div className="flex justify-between caption-bold pl-[21px]">
                      <p className="caption text-mono-80">Price</p>
                      <p className="caption text-mono-100 mt-1">
                        £{(item.quantity * item.productId.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between caption-bold pl-[21px]">
                      <p className="caption text-mono-80">
                        Charity profit (90%)
                      </p>
                      <p className="caption text-mono-100 mt-1">
                        £{productCharityProfit.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary Footer */}
        <div className="summary-foot border-t pt-6 px-6">
          <div className="flex justify-between mb-2">
            <p className="caption text-mono-80">Angelpage admin fee</p>
            <p className="caption text-mono-100">£{adminFee.toFixed(2)}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="caption text-mono-80">Charity profit (90%)</p>
            <p className="caption text-mono-100">£{charityProfit.toFixed(2)}</p>
          </div>
        </div>

        {/* Total Amount */}
        <div className="flex justify-between font-bold px-6 border-t pt-4 mt-4">
          <p className="body-bold-medium product-total-price">Total</p>
          <p className="body-bold-medium text-mono-100">
            £{totalProductPrice.toFixed(2)}
          </p>
        </div>

        {/* Pay Now Button */}
        <div className="pay px-6 mt-3">
          <Button
            className="w-full"
            variant="primary"
            onClick={onPay}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay now'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BasketArea;
