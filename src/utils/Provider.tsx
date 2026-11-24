'use client';

import React from 'react';
import { Provider } from 'react-redux';
import store from '../store/store';
import ToastNotification from '@/components/elements/notifications/ToastService';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import type { Locale } from '@/i18n/messages';

const ClientProviders: React.FC<{
  children: React.ReactNode;
  locale?: Locale;
}> = ({ children, locale = 'en' }) => {
  return (
    <>
      <ToastNotification />
      <LocaleProvider initialLocale={locale}>
        <Provider store={store}>{children}</Provider>
      </LocaleProvider>
    </>
  );
};

export default ClientProviders;
