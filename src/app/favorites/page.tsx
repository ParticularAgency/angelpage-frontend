import React from 'react';
import FavoritePage from '@/pages/favorite-page/Favorite';
import ProtectedRoute from '@/utils/ProtectedRoute';

const FavoritePageMain = () => {
  return (
    <ProtectedRoute allowedRoles={['CHARITY', 'USER']}>
      <div className="favorite-page-main-area">
        <FavoritePage />
      </div>
    </ProtectedRoute>
  );
};

export default FavoritePageMain;
