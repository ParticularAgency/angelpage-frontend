'use client';
import React from 'react';
import CharityStorefront from '@/components/pages-component/charity/charity-storefront/CharityStorefront';

const StorefrontPage = ({ params }: { params: { storefrontid: string } }) => {
  return (
    <div className="charity-storefront-page-main">
      <CharityStorefront storefrontid={params.storefrontid} />
    </div>
  );
};

export default StorefrontPage;
