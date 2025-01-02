'use client';

import React from 'react';
import { FavoriteOutlineIcon } from '@/icons';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../../../store/favoritesSlice';
import { ToastService } from '../notifications/ToastService';


const FavoriteButton = ({ itemId, type }) => {
  const { data: session } = useSession() || {};
  const dispatch = useDispatch();
  const isFavorite = useSelector(state =>
    state.favorites.items.includes(itemId)
  );

  const handleFavoriteToggle = () => {
    if (!session?.user?.id) {
        ToastService.error('User must be logged in to favourite an item');
      return;
    }
        ToastService.success('Favourite toggled successfully');

    dispatch(
      toggleFavorite({
        userId: session.user.id,
        itemId,
        type,
        token: session.token,
      })
    );
  };

  return (
    <div
      className="favorite-btn-item cursor-pointer p-3"
      onClick={handleFavoriteToggle}
      title={isFavorite ? 'Remove from favourites' : 'Add to favorites'}
    >
      <FavoriteOutlineIcon
        fillColor={isFavorite ? '#611192' : 'none'}
        strokeColor={isFavorite ? '#611192' : '#131313'}
      />
    </div>
  );
};

export default FavoriteButton;
