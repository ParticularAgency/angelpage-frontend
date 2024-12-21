'use client';

import { FavoriteIcon } from '@/icons';
import Link from 'next/link';
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
interface FavoritesResponse {
  favoriteProducts: Array<unknown>;
  favoriteCharities: Array<unknown>;
}
interface FavoritesAlertProps {
  ref: React.Ref<FavoritesAlertRef>;
  className?: string;
}

export interface FavoritesAlertRef {
  reloadFavorites: () => void;
}

const FavoritesAlert = forwardRef<FavoritesAlertRef, FavoritesAlertProps>(
  ({ className = '' }, ref) => {
    const { data: session } = useSession();
    const [favoriteCount, setFavoriteCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchFavoriteCount = async () => {
      if (!session?.token) return;

      setLoading(true);
      try {
        const response = await axios.get<FavoritesResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/favorites/added`,
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          }
        );
        // Log the API response to the console
        console.log('Favorites API Response:', response.data);
        const totalFavorites =
          response.data.favoriteProducts.length +
          response.data.favoriteCharities.length;

        setFavoriteCount(totalFavorites);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    // Expose reloadFavorites to the parent component
    useImperativeHandle(ref, () => ({
      reloadFavorites: fetchFavoriteCount,
    }));

    // Initial load
    useEffect(() => {
      fetchFavoriteCount();
    }, [session]);

    return (
      <div className={`user-saveitem flex items-center ${className} relative`}>
        <Link href="/favorites" aria-label="Go to favorites">
          {loading ? (
            <span className="absolute top-[-8px] w-5 h-5 right-[-8px] bg-gray-500 text-white text-[11px]  flex items-center justify-center  rounded-full p-1">
              ...
            </span>
          ) : favoriteCount > 0 ? (
            <span className="absolute top-[-8px] w-5 h-5 right-[-8px] bg-red-500 text-white text-[11px]  flex items-center justify-center rounded-full p-1">
              {favoriteCount}
            </span>
          ) : null}
          <FavoriteIcon />
        </Link>
      </div>
    );
  }
);

FavoritesAlert.displayName = 'FavoritesAlert';

export default FavoritesAlert;
