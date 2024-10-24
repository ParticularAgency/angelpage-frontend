import { FavoriteIcon } from '@/icons';
import Link from 'next/link';
import React from 'react';

const FavoritesAlert = ({ favoriteCount = 0 }) => {
  return (
    <div className="user-saveitem flex items-center sm:hidden relative">
      <Link href="/favorite" aria-label="Go to favorites">
        <FavoriteIcon />
        {favoriteCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
            {favoriteCount}
          </span>
        )}
      </Link>
    </div>
  );
};

export default FavoritesAlert;

