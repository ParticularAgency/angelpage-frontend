'use client';
import React, { useState, useEffect } from 'react';
import BannerSection from './Banner';
import FavoriteProductListing from './FavoriteProducts';
import FavoriteCharityListing from './FavoriteCharities';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Product } from '@/types/productTypes';

interface FavoriteResponse {
  favoriteProducts: Array<{
    products: Product[];
  }>;
  favoriteCharities: Array<{
    id: string;
    name: string;
    listingProduct?: string;
    image: string;
    description?: string;
  }>;
}

const FavoritePage = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const { data: session, status } = useSession();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [favoriteCharities, setFavoriteCharities] = useState<
    FavoriteResponse['favoriteCharities']
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (status !== 'authenticated') return;

      try {
        const response = await axios.get<FavoriteResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/favorites/added`,
          {
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          }
        );

        // Flatten the favoriteProducts array
        const products = response.data.favoriteProducts.flatMap(
          item => item.products
        );
        setFavoriteProducts(products);
        setFavoriteCharities(response.data.favoriteCharities);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [status, session]);

  if (loading) {
    return <div>Loading favorites...</div>;
  }
  return (
    <div className="favorite-page-content-wrapper">
      <BannerSection />
      <div className="favorites-wrapper-area">
        <div className="favorites-tabs-area">
          <div className="favorites-tabs-box">
            <div className="custom-container">
              <div className="favorites-tabs-btn-box pt-3 pb-4 flex justify-between items-center  gap-6">
                <ul className="tabs-btn-items flex items-center gap-6">
                  <li
                    className={`tabs-btn-list body-small px-[11px] py-2 rounded-[24px] cursor-pointer ${
                      activeTab === 0
                        ? 'bg-[#FCF2FF] text-primary-color-100'
                        : 'hover:bg-[#FCF2FF] hover:text-primary-color-100'
                    }`}
                    onClick={() => setActiveTab(0)}
                  >
                    Items
                  </li>
                  <li
                    className={`tabs-btn-list body-small px-[11px] py-2 rounded-[24px] cursor-pointer ${
                      activeTab === 1
                        ? 'bg-[#FCF2FF] text-primary-color-100'
                        : 'hover:bg-[#FCF2FF] hover:text-primary-color-100'
                    }`}
                    onClick={() => setActiveTab(1)}
                  >
                    Charities
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="favorites-tabs-cont-area">
            <ul className="tabs-content-area">
              {activeTab === 0 && (
                <li className="tabs-cont-item">
                  <div className="favorite-product-tabs-cont">
                    {favoriteProducts.length === 0 ? (
                      <p>No favorite products yet!</p>
                    ) : (
                      <FavoriteProductListing products={favoriteProducts} />
                    )}
                  </div>
                </li>
              )}
              {activeTab === 1 && (
                <li className="tabs-cont-item">
                  <div className="favorite-charity-tabs-cont">
                    {favoriteCharities.length === 0 ? (
                      <p>No favorite charities yet!</p>
                    ) : (
                      <FavoriteCharityListing charities={favoriteCharities} />
                    )}
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritePage;
