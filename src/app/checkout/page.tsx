'use client';

import BasketPage from '@/components/checkout/checkout';
import ProtectedRoute from '@/utils/ProtectedRoute';

export default function CheckoutPage(){
  return (
    <ProtectedRoute allowedRoles={['CHARITY', 'USER']}>
      <div className="checkout-page-main-wrapper">
        <BasketPage />
      </div>
    </ProtectedRoute>
  );
};

