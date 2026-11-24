'use client';
import React from 'react';
import HomeLanding from './home-landing/HomeLanding';
import StorefrontHomeContent from '@/components/homepage/StorefrontHomeContent';
import { useSession } from 'next-auth/react';

const HomePage = () => {
  const { status } = useSession() || {};

  if (status === 'loading') {
    return null;
  }

  if (status === 'authenticated') {
    return <StorefrontHomeContent />;
  }

  return <HomeLanding />;
};

export default HomePage;
