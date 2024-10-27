'use client';
import React  from 'react';
import BannerSection from './Banner';
import BasketArea from './BasketArea';
import CheckoutProductItem from './CheckoutProductItem';
import ShippingAddress from './ShippingAddress';
import PaymentMethodsArea from './PaymentMethods';

const BasketPage = () => {

return (
    <div className="basket-page-main-wrapper">
      <div className="custom-container max-w-[1008px]">
        <BannerSection />
        <section className="basket-page-main-content-grid grid grid-cols-12 gap-5">
          <div className="basket-page-left-cont col-span-7 md:col-span-6 sm:col-span-full">
            <CheckoutProductItem />
            <div className="shipping-and-payment-information">
              <ShippingAddress />
              <div className="payment-info-wrapper pt-10">
                <PaymentMethodsArea />
              </div>
            </div>
          </div>
          <BasketArea />
        </section>
      </div>
    </div>
  );
};

export default BasketPage;
