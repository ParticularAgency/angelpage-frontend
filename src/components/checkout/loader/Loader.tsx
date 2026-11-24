'use client';

import React from 'react';
import FullScreenLoader from '@/components/common/loading/FullScreenLoader';

interface CheckoutLoadingScreenProps {
  loading: boolean;
}

const CheckoutLoadingScreen: React.FC<CheckoutLoadingScreenProps> = ({ loading }) => {
  if (!loading) return null;
  return <FullScreenLoader label="Loading your basket" />;
};

export default CheckoutLoadingScreen;
