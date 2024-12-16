import UsersAccount from '@/pages/user-account/UsersAccount';
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
