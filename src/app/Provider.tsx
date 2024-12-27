'use client';

import React from 'react';
import { Provider } from 'react-redux';
import store from '../store/store';
import ToastNotification from '@/components/elements/notifications/ToastService';

const ClientProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <ToastNotification />
      <Provider store={store}>{children}</Provider>
    </>
  );
};

export default ClientProviders;
