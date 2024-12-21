'use client';

import React, { useEffect, useState } from 'react';
import { FavoriteOutlineIcon } from '@/icons';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { ToastService } from '@/components/elements/notifications/ToastService';

interface FavoriteButtonProps {
  itemId: string;
  type: 'Product' | 'Charity';
}
interface FavoriteButtonProps {
  itemId: string;
  type: 'Product' | 'Charity';
}

interface FavoriteProduct {
  _id: string;
}

interface FavoriteCharity {
  _id: string;
}

interface FavoriteResponse {
  favoriteProducts: (string | FavoriteProduct)[];
  favoriteCharities: (string | FavoriteCharity)[];
}
const FavoriteButton: React.FC<FavoriteButtonProps> = ({ itemId, type }) => {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch favorite status on component mount
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!session?.token) return;

      try {
        const response = await axios.get<FavoriteResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/favorites/added`,
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          }
        );

        const { favoriteProducts, favoriteCharities } = response.data;

        // Extract IDs from products and charities
        const favoriteProductIds = favoriteProducts.map(product =>
          typeof product === 'string' ? product : product._id
        );

        const favoriteCharityIds = favoriteCharities.map(charity =>
          typeof charity === 'string' ? charity : charity._id
        );

        const isItemFavorite =
          type === 'Product'
            ? favoriteProductIds.includes(itemId)
            : favoriteCharityIds.includes(itemId);

        setIsFavorite(isItemFavorite);
      } catch (error) {
        console.error('Error fetching favorite status:', error);
      }
    };

    fetchFavoriteStatus();
  }, [itemId, type, session]);

  // Toggle favorite status
  const handleFavoriteToggle = async () => {
    if (!session?.user?.id) {
      ToastService.error('You must be logged in to favorite an item.');
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/toggle`,
        {
          userId: session.user.id,
          itemId,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      // Update the local favorite state
      setIsFavorite(prev => !prev);
      ToastService.success(
        isFavorite ? 'Removed from favorites' : 'Added to favorites'
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`favorite-btn-item cursor-pointer p-3 ${
        loading ? 'opacity-50 pointer-events-none' : ''
      }`}
      onClick={handleFavoriteToggle}
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
