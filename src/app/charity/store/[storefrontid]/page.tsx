import CharityStorefront from '@/pages/charity/charity-storefront/CharityStorefront';
import ProtectedRoute from '@/utils/ProtectedRoute';
import React from 'react';

const StorefrontPage = ({ params }: { params: { storefrontid: string } }) => {
  return (
    <ProtectedRoute allowedRoles={['USER', 'CHARITY']}>
      <div className="charity-storefront-page-main">
        <CharityStorefront storefrontid={params.storefrontid} />
      </div>
    </ProtectedRoute>
  );
};

export default StorefrontPage;
