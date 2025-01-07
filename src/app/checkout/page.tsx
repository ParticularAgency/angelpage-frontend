'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import BasketPage from '@/components/checkout/checkout';
import ProtectedRoute from '@/utils/ProtectedRoute';

const stripePublishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

export default function CheckoutPage() {
  if (!stripePromise) {
    return <div>Error: Stripe publishable key is missing.</div>;
  }

  return (
    <ProtectedRoute allowedRoles={['CHARITY', 'USER']}>
      <div className="checkout-page-main-wrapper">
        <Elements stripe={stripePromise}>
          <BasketPage />
        </Elements>
      </div>
    </ProtectedRoute>
  );
}
