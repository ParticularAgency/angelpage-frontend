'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BannerSection from './Banner';
import BasketArea from './BasketArea';
import CheckoutProductItem from './CheckoutProductItem';
import ShippingAddress from './ShippingAddress';
import PaymentMethodsArea from './PaymentMethods';
import CheckoutLoaderScreen from './loader/Loader';

const BasketPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/checkout/confirmation');
    }, 200000); 
  }
  return (
    <div className="basket-page-main-wrapper">
      <div className="custom-container max-w-[1008px]">
        {loading ? (
          <>
            <div className="loader-page-screen h-[80vh]">
              <BannerSection />
              <CheckoutLoaderScreen loading={loading} />
            </div>
          </>
        ) : (
          <>
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
              <BasketArea onPay={handlePayment} />
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default BasketPage;
