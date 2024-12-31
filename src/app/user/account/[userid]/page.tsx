'use client';
import UsersAccount from '@/components/pages-component/user-account/UsersAccount';
import React from 'react';
import ProtectedRoute from '@utils/ProtectedRoute';
const UserAccountPage = () => {
  return (
    <ProtectedRoute allowedRoles={['USER']}>
      <div className="user-account-main-page-wrapper">
        <UsersAccount />
      </div>
    </ProtectedRoute>
  );
};

export default UserAccountPage;
