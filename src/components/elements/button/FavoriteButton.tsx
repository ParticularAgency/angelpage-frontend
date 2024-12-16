'use client';

import React, { useEffect, useState } from 'react';
import { FavoriteOutlineIcon } from '@/icons';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface FavoriteButtonProps {
  itemId: string; // ID of the product or charity
  type: 'Product' | 'Charity'; // Type of the item
}
interface FavoriteResponse {
  favoriteProducts: string[]; // Array of product IDs or another type
  favoriteCharities: string[]; // Array of charity IDs or another type
}
const FavoriteButton: React.FC<FavoriteButtonProps> = ({ itemId, type }) => {
  const { data: session } = useSession(); // Fetch the current session
  const [isFavorite, setIsFavorite] = useState(false); // Track favorite state
  const [loading, setLoading] = useState(false); // Track loading state

  // Fetch favorite status on component mount
useEffect(() => {
  const fetchFavoriteStatus = async () => {
    if (!session?.token) {
      console.error('No token available in session');
      return;
    }

    try {
       const response = await axios.get<FavoriteResponse>(
         `${process.env.NEXT_PUBLIC_API_URL}/favorites/added`,
         {
           headers: {
             Authorization: `Bearer ${session.token}`,
           },
         }
       );
      console.log('Favorite status fetched successfully', response.data);

      const { favoriteProducts, favoriteCharities } = response.data;

      const isItemFavorite =
        type === 'Product'
          ? favoriteProducts.includes(itemId)
          : favoriteCharities.includes(itemId);

      setIsFavorite(isItemFavorite);
    } catch (error) {
      
    }
  };

  fetchFavoriteStatus();
}, [itemId, type, session]);


  // Toggle favorite status
  const handleFavoriteToggle = async () => {
    if (!session?.user?.id) {
      alert('You must be logged in to favorite an item.');
      return;
    }

    setLoading(true); // Set loading state to true during the operation

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/toggle`,
        {
          userId: session.user.id, // Pass the user ID
          itemId,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${session.token}`, // Authenticate the request
          },
        }
      );

      setIsFavorite(prev => !prev); // Toggle the favorite state
    } catch (error) {
     
    } finally {
      setLoading(false); // Reset loading state
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
