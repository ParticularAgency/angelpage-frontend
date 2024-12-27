'use client'
import LoadingModal from '@/icons/loadingModal';
import React from 'react';

interface CheckoutLoadingScreenProps {
  loading: boolean;
}

const CheckoutLoadingScreen: React.FC<CheckoutLoadingScreenProps> = ({ loading }) => {
  if (!loading) return null; // Render nothing if not loading

  return (
    <div className="relative bg-mono-0 flex justify-center items-center h-[80%]">
      <div className="">
        <LoadingModal />
        <p className="body-small text-mono-100">
          {' '}
          Loading... , please do not refresh this page.
        </p>
      </div>
    </div>
  );
};

export default CheckoutLoadingScreen;
