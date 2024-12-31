'use client';
import AdminAccount from '@/pages/admin/AdminPage';
import React from 'react';
import ProtectedRoute from '@/utils/ProtectedRoute';

const Adminpage = () => {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="admin-page-main-wrappepr">
        <AdminAccount />
      </div>
    </ProtectedRoute>
  );
};

export default Adminpage;
