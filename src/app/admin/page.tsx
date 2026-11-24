import React from 'react';
import AdminAccount from '@/views/admin/AdminPage';
import ProtectedRoute from '@/utils/ProtectedRoute';
import { ALL_ADMIN_ROLES } from '@/constants/adminPanels';

const Adminpage = () => {
  return (
    <ProtectedRoute allowedRoles={[...ALL_ADMIN_ROLES]}>
      <div className="admin-page-main-wrappepr">
        <AdminAccount />
      </div>
    </ProtectedRoute>
  );
};

export default Adminpage;
