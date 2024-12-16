import CharityAccountMain from '@/pages/charity/charity-account/CharityAccount';
import ProtectedRoute from '@/utils/ProtectedRoute';
import React from 'react';

const CharityAccountPage = () => {
  return (
    <ProtectedRoute allowedRoles={['CHARITY']}>
      <div className="charity-account-page-wrapper-main">
        <CharityAccountMain />
      </div>
    </ProtectedRoute>
  );
};

export default CharityAccountPage;
