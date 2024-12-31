'use client';
import SellAnItem from '@/pages/sellAnItem/sellAnItem';
import React from 'react';
import ProtectedRoute from '@/utils/ProtectedRoute';

const SellAnItemPage: React.FC = () => {
  return (
    <>
      <ProtectedRoute allowedRoles={['CHARITY', 'USER']}>
        <SellAnItem />
      </ProtectedRoute>
    </>
  );
};

export default SellAnItemPage;
