'use client';
import React, { useState, useEffect } from 'react';
import { FavoriteOutlineIcon } from '@/icons';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface FavoriteButtonProps {
  itemId: string;
  type: 'product' | 'charity';
  initialStatus?: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  itemId,
  type,
  initialStatus = false,
}) => {
  const [isFavorite, setIsFavorite] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (status !== 'authenticated') return;

      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/favorites/favorite-status`,
          {
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          }
        );

        const { favoriteProducts, favoriteCharities } = data;

        setIsFavorite(
          type === 'product'
            ? favoriteProducts.some(
                (item: { _id: string }) => item._id === itemId
              )
            : favoriteCharities.some(
                (item: { _id: string }) => item._id === itemId
              )
        );
      } catch (error) {
        console.error(
          'Error fetching favorite status:',
          error.response?.data || error.message
        );
      }
    };

    fetchFavoriteStatus();
  }, [itemId, type, session, status]);

  const handleFavoriteClick = async () => {
    if (status !== 'authenticated') {
      alert('You must be logged in to favorite an item.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/toggle  `,
        { id: itemId, type },
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error(
        'Error toggling favorite:',
        error.response?.data || error.message
      );
      alert('Failed to update favorite status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`favorite-btn-item cursor-pointer p-3 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
      onClick={handleFavoriteClick}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <FavoriteOutlineIcon
        fillColor={isFavorite ? '#611192' : 'none'}
        strokeColor={isFavorite ? '#611192' : '#131313'}
      />
    </div>
  );
};

export default FavoriteButton;
