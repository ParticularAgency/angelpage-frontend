'use client';

import React, {  useState } from 'react';
import { ArrowDownIcon } from '@/icons';
import Image from 'next/image';

const OrderSummary  = ({order}) => {
   const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="basket-page-right-cont">
      <div className="basket-page-right-cont-wrapper border py-6 bg-[#F1F1F7] relative">
        <div className="paid-mark-imaage absolute top-[-30px] left-[-40px] sm:left-auto sm:right-0 sm:top-[-40px]">
          <Image
            src="/images/paid-mark.svg"
            alt="paid mark image"
            width={72}
            height={72}
          />
        </div>
        <div className="flex justify-between items-end px-6 pl-7">
          <div className="group-details">
            <h3 className="body-bold-medium mb-2">Order summary</h3>
          </div>
          <p className="font-semibold product-total-price">
            £{order?.totalAmount.toFixed(2)}
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
              ({order?.products.length} item)
            </span>{' '}
            <span className="arrow-down">
              <ArrowDownIcon />
            </span>
          </p>
          {!isCollapsed && (
            <div className="product-list px-6">
              {order?.products.map((item, index) => {
                return (
                  <div className="mb-6" key={index}>
                    <p className="eyebrow-medium">{item.name || ''}</p>
                    <p className="caption-bold text-mono-80">
                      {item?.productId.brand || ''}
                    </p>
                    <div className="flex justify-between caption-bold pl-[21px]">
                      <p className="caption text-mono-80">Price</p>
                      <p className="caption text-mono-100 mt-1">
                        £{item?.price.toFixed(2) || ''}
                      </p>
                    </div>
                    <div className="flex justify-between caption-bold pl-[21px]">
                      <p className="caption text-mono-80">
                        Charity profit (90%)
                      </p>
                      <p className="caption text-mono-100 mt-1">
                        £{item?.charityProfit.toFixed(2) || ''}
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
            <p className="caption text-mono-100">
              £
              {order?.products
                .reduce((sum, item) => sum + item.adminFee, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="caption text-mono-80">Charity profit (90%)</p>
            <p className="caption text-mono-100">
              £
              {order?.products
                .reduce((sum, item) => sum + item.charityProfit, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="caption text-mono-80">Shipping cost</p>
            <p className="caption text-mono-100">
              £{order?.shipmentCost.toFixed(2)}{' '}
            </p>
          </div>
        </div>

        {/* Total Amount */}
        <div className="flex justify-between font-bold px-6 border-t pt-4 mt-4">
          <p className="body-bold-medium product-total-price">Total</p>
          <p className="body-bold-medium text-mono-100">
            £{order?.grandTotal.toFixed(2) || ''}
          </p>
        </div>
        {/* <p className="body-small !text-[11px] text-center px-6 mt-1">NOTE: Shipping cost can be recalculate, it can be increased the total cost</p> */}
      </div>
    </div>
  );
};

export default OrderSummary;

