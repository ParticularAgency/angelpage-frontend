import React from 'react'

const BasketArea = () => {
  return (
    <div className="basket-page-right-cont col-span-5 md:col-span-6 sm:col-span-full">
      <div className="border p-6 bg-[#F1F1F7]">
        <div className="flex justify-between items-end">
          <h3 className="body-bold-medium mb-4">Order summary</h3>
          <p className="font-semibold product-total-price">£100.00</p>
        </div>
        <div className="order-item-list-box">
          <p className="colaps-title body-regular mb-4">
            Order details{' '}
            <span className="number-of-product-for-price">(2 items)</span>
          </p>
        </div>
        <div className="mb-6">
          <p className="eyebrow-medium">PRADA</p>
          <p className="caption-bold text-mono-80">Handbag</p>
          <div className="flex justify-between  caption-bold pl-[21px]">
            <p className="caption-bold text-mono-80">Price</p>
            <p className="caption-bold text-mono-80 mt-1">£50.00</p>
          </div>
          <div className="flex justify-between caption-bold pl-[21px]">
            <p className="caption-bold text-mono-80">Charity profit (90%)</p>
            <p className="caption-bold text-mono-80 mt-1">£45.00</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="eyebrow-medium">JORDAN</p>
          <p className="caption-bold text-mono-80">Jordan Dunks</p>
          <div className="flex justify-between  caption-bold pl-[21px]">
            <p className="caption-bold text-mono-80">Price</p>
            <p className="caption-bold text-mono-80">£40.00</p>
          </div>
          <div className="flex justify-between caption-bold pl-[21px]">
            <p className="caption-bold text-mono-80">Charity profit (90%)</p>
            <p className="caption-bold text-mono-80">£36.00</p>
          </div>
        </div>

        <div className="summary-foot border-t pt-6">
          <div className="flex justify-between mb-2">
            <p className="caption-bold text-mono-80">Angelpage admin fee</p>
            <p className="caption-bold text-mono-80">£10.00</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="caption-bold text-mono-80">Charity profit (90%)</p>
            <p className="caption-bold text-mono-80">£90.00</p>
          </div>
        </div>

        <div className="flex justify-between font-bold border-t pt-4 mt-4">
          <p className="body-bold-medium product-total-price">Total</p>
          <p className="body-bold-medium">£100.00</p>
        </div>

        <button className="mt-6 w-full bg-black text-white py-2">
          Pay now
        </button>
      </div>
    </div>
  );
}

export default BasketArea
