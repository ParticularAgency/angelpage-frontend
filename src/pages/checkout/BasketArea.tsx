import { Button } from '@/components/elements';
import { ArrowDownIcon } from '@/icons';
import React, { useState } from 'react';

interface Product {
  name: string;
  brand: string;
  price: number;
}
interface BasketAreaProps {
  onPay: () => void; // Define onPay as a function with no parameters and no return type
}

const BasketArea: React.FC<BasketAreaProps> = ({ onPay }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Sample data for products
  const products: Product[] = [
    { name: 'Handbag', brand: 'PRADA', price: 60.0 },
    { name: 'Jordan Dunks', brand: 'JORDAN', price: 60.0 },
  ];

  // Total calculation
  const totalProductPrice = products.reduce(
    (sum, product) => sum + product.price,
    0
  );
  const charityProfit = totalProductPrice * 0.9; // Total charity profit
  const adminFee = totalProductPrice * 0.1; // Total admin fee
  const totalAmount = totalProductPrice;

  return (
    <div className="basket-page-right-cont col-span-5 md:col-span-6 sm:col-span-full">
      <div className="basket-page-right-cont-wrapper border py-6 bg-[#F1F1F7]">
        <div className="flex justify-between items-end px-6">
          <h3 className="body-bold-medium mb-4">Order summary</h3>
          <p className="font-semibold product-total-price">
            £{totalAmount.toFixed(2)}
          </p>
        </div>

        {/* Collapsible Order Details */}
        <div className="order-item-list-box">
          <p
            className={`colaps-title body-regular  px-6 mb-4 cursor-pointer flex items-center gap-[4px] ${isCollapsed ? 'collapsed' : 'collapsed-open'}`}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            Order details{' '}
            <span className="number-of-product-for-price">
              ({products.length} items)
            </span>{' '}
            <span className="arrow-down">
              <ArrowDownIcon />
            </span>
          </p>
          {!isCollapsed && (
            <div className="product-list  px-6">
              {products.map((product, index) => {
                const productCharityProfit = product.price * 0.9; // 90% for charity
                return (
                  <div className="mb-6" key={index}>
                    <p className="eyebrow-medium">{product.brand}</p>
                    <p className="caption-bold text-mono-80">{product.name}</p>
                    <div className="flex justify-between caption-bold pl-[21px]">
                      <p className="caption text-mono-80">Price</p>
                      <p className="caption text-mono-100 mt-1">
                        £{product.price.toFixed(2)}
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
                    {/* <div className="flex justify-between caption-bold pl-[21px]">
                      <p className="caption-bold text-mono-80">
                        Admin fee (10%)
                      </p>
                      <p className="caption-bold text-mono-80 mt-1">
                        £{productAdminFee.toFixed(2)}
                      </p>
                    </div> */}
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
            £{totalAmount.toFixed(2)}
          </p>
        </div>

        {/* Pay Now Button */}
        <div className="pay px-6 mt-3">
          <Button className="w-full" variant="primary" onClick={onPay}>
            Pay now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BasketArea;
