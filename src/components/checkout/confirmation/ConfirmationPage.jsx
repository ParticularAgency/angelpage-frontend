'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import BannerSection from '../Banner';
import CheckoutLoaderScreen from '../loader/Loader';
import { useSession } from 'next-auth/react';
import ThankYouArea from './ThankYouArea';
import OrderSummary from './OrderSummary';
import PreLoader from '@/components/common/pre-loader/PreLoader';

const ConfirmationPage = () => {
  const { orderid } = useParams() || {};
  const searchParams = useSearchParams();
  const guestEmail = searchParams?.get('email') || '';
  const guestTokenParam = searchParams?.get('guestToken') || '';
  const { data: session } = useSession() || {};
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [orderAddressinfo, setOrderAddressinfo] = useState(null);
  const [fetchError, setFetchError] = useState('');

  const fetchOrderDetails = async () => {
    if (!orderid) {
      setFetchError('Order ID not found.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setFetchError('');

    try {
      const api = process.env.NEXT_PUBLIC_API_URL;
      const isGuestLookup = !session?.token && guestEmail;
      const guestToken =
        guestTokenParam ||
        (typeof window !== 'undefined' && orderid
          ? sessionStorage.getItem(`guest-order-token-${orderid}`)
          : '') ||
        '';

      const url = isGuestLookup
        ? `${api}/order/guest-confirmation/${orderid}?email=${encodeURIComponent(guestEmail)}&guestToken=${encodeURIComponent(guestToken)}`
        : `${api}/order/${orderid}`;

      const response = await fetch(url, {
        ...(session?.token
          ? { headers: { Authorization: `Bearer ${session.token}` } }
          : {}),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || err.message || 'Failed to fetch order.');
      }

      const { order: orderData } = await response.json();
      if (!orderData?.products) {
        throw new Error('Invalid order data.');
      }

      setOrder(orderData);
      setOrderAddressinfo(orderData);
    } catch (error) {
      setFetchError(
        error instanceof Error ? error.message : 'Could not load order details.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.token || (guestEmail && (guestTokenParam || orderid))) {
      fetchOrderDetails();
    } else if (session === null && !guestEmail) {
      setLoading(false);
      setFetchError(
        'Sign in or use the confirmation link from your checkout email to view this order.'
      );
    }
  }, [session, orderid, guestEmail, guestTokenParam]);

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
      <div className="custom-container max-w-[960px] py-16 text-center">
        <BannerSection />
        <p className="body-small text-mono-70 mt-8">{fetchError}</p>
        <a href="/" className="text-primary-color-100 underline mt-4 inline-block">
          Return to homepage
        </a>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page-main-wrapper">
      <div className="custom-container max-w-[960px]">
        <BannerSection />
        <div className="order-confirmation-grid-area grid grid-cols-12 gap-6 pt-3">
          <div className="order-confirmation-grid-left-area col-span-7 sm:order-2 sm:col-span-full">
            <ThankYouArea
              orderAddressinfo={orderAddressinfo}
              guestEmail={guestEmail}
              isGuestOrder={order?.isGuestOrder}
            />
          </div>
          <div className="order-confirmation-grid-right-area sm:order-1 col-span-5 sm:col-span-full">
            <OrderSummary order={order} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
