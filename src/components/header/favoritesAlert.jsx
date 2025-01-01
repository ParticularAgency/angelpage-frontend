'use client';

import React, { useEffect } from 'react';
import { FavoriteIcon } from '@/icons';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites } from '../../store/favoritesSlice';
import { useSession } from 'next-auth/react';

const FavoritesAlert = ({ className }) => {
  const dispatch = useDispatch();
  const { data: session } = useSession() || {};
  const favoriteCount = useSelector(state => state.favorites.count);
  const loading = useSelector(state => state.favorites.status === 'loading');

  useEffect(() => { 
    if (session?.token) {
      dispatch(fetchFavorites(session.token));
    }
  }, [session, dispatch]);

  return (
    <div className={`user-saveitem flex items-center relative ${className}`}>
      <Link href="/favourite" aria-label="Go to favorites">
        {loading ? (
          <span className="absolute top-[-8px] w-5 h-5 right-[-8px] bg-gray-500 text-white text-[11px] flex items-center justify-center rounded-full p-1">
            ...
          </span>
        ) : favoriteCount > 0 ? (
          <span className="absolute top-[-8px] w-5 h-5 right-[-8px] bg-red-500 text-white text-[11px] flex items-center justify-center rounded-full p-1">
            {favoriteCount}
          </span>
        ) : null}
        <FavoriteIcon />
      </Link>
    </div>
  );
};

export default FavoritesAlert;
