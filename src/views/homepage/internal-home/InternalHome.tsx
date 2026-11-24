'use client';
import React from 'react';
import StorefrontHomeContent from '@/components/homepage/StorefrontHomeContent';
import ProtectedRoute from '@/utils/ProtectedRoute';

const InternalHome = () => {
  return (
    <ProtectedRoute allowedRoles={['CHARITY', 'USER']}>
      <StorefrontHomeContent />
    </ProtectedRoute>
  );
};

export default InternalHome;
