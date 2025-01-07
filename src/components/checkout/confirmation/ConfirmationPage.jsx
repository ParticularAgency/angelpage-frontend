'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Use params for dynamic route parsing
import BannerSection from '../Banner';
import CheckoutLoaderScreen from '../loader/Loader';
import { useSession } from 'next-auth/react';
import ThankYouArea from './ThankYouArea';
import OrderSummary from './OrderSummary';
import PreLoader from '@/components/common/pre-loader/PreLoader';

const ConfirmationPage = () => {
 const { orderid } = useParams() || {}; 
 const { data: session } = useSession() || {};
 const [loading, setLoading] = useState(false);
 const [order, setOrder] = useState(null);
 const [orderAddressinfo, setOrderAddressinfo] = useState(null);

 const fetchOrderDetails = async () => {
   if (!orderid) {
     console.error('Order ID not found in URL.');
     setLoading(false);
     return;
   }

   try {
     const response = await fetch(
       `${process.env.NEXT_PUBLIC_API_URL}/order/${orderid}`,
       {
         headers: {
           Authorization: `Bearer ${session?.token}`, // Include token if available
         },
       }
     );

     if (!response.ok) {
       const errorMessage = await response.text();
       console.error('API Error:', errorMessage);
       throw new Error(errorMessage || 'Failed to fetch order details.');
     }

  const { order } = await response.json();
  console.log('Fetched order:', order);

  if (!order || !order.products) {
    throw new Error('Invalid order data: Missing products.');
  }

     setOrder(order); 
     setOrderAddressinfo(order);
   } catch (error) {
     console.error('Error fetching order details:', error);
    //  setError(error.message || 'An unexpected error occurred.');
   } finally {
     setLoading(false);
   }
 };

 useEffect(() => {
   if (session) {
     fetchOrderDetails();
   }
 }, [session]);

 if (loading) {
   return (
     <div className="loader-page-screen h-[80vh]">
       <BannerSection />
       <CheckoutLoaderScreen loading={loading} />
     </div>
   );
 }

 if (!order) {
   return (
     <>
       <PreLoader />
     </>
   );
 }
  return (
    <div className="order-confirmation-page-main-wrapper">
      <div className="custom-container max-w-[960px]">
        {loading ? (
          <div className="loader-page-screen h-[80vh]">
            <BannerSection />
            <CheckoutLoaderScreen loading={loading} />
          </div>
        ) : (
          <>
            <BannerSection />
            <div className="order-confirmation-grid-area grid grid-cols-12 gap-6  pt-3">
              <div className="order-confirmation-grid-left-area col-span-7 sm:order-2 sm:col-span-full">
                <ThankYouArea orderAddressinfo={orderAddressinfo} />
              </div>
              <div className="order-confirmation-grid-right-area sm:order-1 col-span-5 sm:col-span-full">
                <OrderSummary order={order} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmationPage;
