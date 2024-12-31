'use client';
import ConfirmationPage from '@/components/checkout/confirmation/ConfirmationPage';
import React from 'react';
import ProtectedRoute from '@/utils/ProtectedRoute';

const OrderConfirmationPage = () => {
  return (
    <ProtectedRoute allowedRoles={['CHARITY', 'USER']}>
      <div className="order-confirmation-page-wrapper">
        <ConfirmationPage />
      </div>
    </ProtectedRoute>
  );
};

export default OrderConfirmationPage;
