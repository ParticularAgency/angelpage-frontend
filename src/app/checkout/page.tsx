'use client';
import React from 'react';
import BasketPage from '@/pages/checkout/checkout';
import ProtectedRoute from '@/utils/ProtectedRoute';

const CheckoutPage = () => {
  return (
    <ProtectedRoute allowedRoles={['CHARITY', 'USER']}>
      <div className="checkout-page-main-wrapper">
        <BasketPage />
      </div>
    </ProtectedRoute>
  );
};

export default CheckoutPage;
