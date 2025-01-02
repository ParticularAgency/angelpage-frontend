'use client';

import React, { useState, useEffect } from 'react';
import BannerSection from './Banner';
import FavoriteProductListing from './FavoriteProducts';
import FavoriteCharityListing from './FavoriteCharities';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Product } from '@/types/productTypes';
import ProductSkeletonCard from '@/components/common/cards/product/productskeletonCard';
import { Button } from '@/components/elements';
import Link from 'next/link';
import PreLoader from '@/components/common/pre-loader/PreLoader';


interface Charity {
  id: string;
  charityName: string;
  storefrontId: string;
  listedProducts?: (string | object)[];
  profileImage: string;
  description?: string;
}

interface FavoriteResponse {
  favoriteProducts: Product[];
  favoriteCharities: Charity[];
}

const FavoritePage = () => {
   const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
   const [favoriteCharities, setFavoriteCharities] = useState<Charity[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession() || {};

  const fetchFavorites = async () => {
    if (!session?.token) return;

    setLoading(true);
    try {
      const response = await axios.get<FavoriteResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/added`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      if (response.data) {
        setFavoriteProducts(response.data.favoriteProducts || []);
        setFavoriteCharities(response.data.favoriteCharities || []);
      } else {
        setFavoriteProducts([]);
        setFavoriteCharities([]);
      }
    } catch (error) {
      console.error('Error fetching favourites:', error);
      setFavoriteProducts([]);
      setFavoriteCharities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [session]);

  if (loading) {
    return <PreLoader />;
  }

  console.log('favourite Products:', favoriteProducts);

  return (
    <div className="favorite-page-content-wrapper">
      <BannerSection
        totalProducts={favoriteProducts.length}
        totalCharities={favoriteCharities.length}
      />
      <div className="favorites-wrapper-area">
        <div className="favorites-tabs-area">
          <div className="favorites-tabs-box">
            <div className="custom-container">
              <div className="favorites-tabs-btn-box pt-3 pb-4 flex justify-between items-center gap-6">
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
                      <>
                        <div className="not-found-screen-design flex flex-col items-center pt-20 pb-24 custom-container">
                          <h5 className="body-bold-medium text-mono-100 font-medium font-secondary mb-2 text-center">
                            No favourites yet!
                          </h5>
                          <p className="body-regular font-secondary font-regular text-mono-90 text-center max-w-[412px] w-full mx-auto">
                            Click the 'Heart' button on items you love and
                            you'll be able to keep an eye on the items here
                          </p>
                          <Link href="/product/">
                            <Button variant="primary" className="mx-auto mt-6">
                              Start shopping
                            </Button>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        {loading ? (
                          <>
                            <div className="skeleton-sec-area custom-container">
                              <div className="grid grid-cols-12 gap-6 product-handle-listing-wrapper bg-[#F1F1F7] py-8 px-6 sm:px-[5px]">
                                <div className="col-span-3 sm:col-span-full">
                                  <ProductSkeletonCard />
                                </div>
                                <div className="col-span-3 sm:hidden">
                                  <ProductSkeletonCard />
                                </div>
                                <div className="col-span-3 md:hidden">
                                  <ProductSkeletonCard />
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <FavoriteProductListing
                              isLoggedin={!!session?.token}
                              products={favoriteProducts}
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>
                </li>
              )}
              {activeTab === 1 && (
                <li className="tabs-cont-item">
                  <div className="favorite-charity-tabs-cont">
                    {favoriteCharities.length === 0 ? (
                      <>
                        <div className="not-found-screen-design flex flex-col items-center pt-20 pb-24 custom-container">
                          <h5 className="body-bold-medium text-mono-100 font-medium font-secondary mb-2 text-center">
                            No favourites yet!
                          </h5>
                          <p className="body-regular font-secondary font-regular text-mono-90 text-center max-w-[412px] w-full mx-auto">
                            Click the 'Heart' button on items you love and
                            you'll be able to keep an eye on the items here
                          </p>
                          <Link href="/product/">
                            <Button variant="primary" className="mx-auto mt-6">
                              Start shopping
                            </Button>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        {loading ? (
                          <>
                            <div className="skeleton-sec-area custom-container">
                              <div className="grid grid-cols-12 gap-6 product-handle-listing-wrapper bg-[#F1F1F7] py-8 px-6 sm:px-[5px]">
                                <div className="col-span-3 sm:col-span-full">
                                  <ProductSkeletonCard />
                                </div>
                                <div className="col-span-3 sm:hidden">
                                  <ProductSkeletonCard />
                                </div>
                                <div className="col-span-3 md:hidden">
                                  <ProductSkeletonCard />
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <FavoriteCharityListing
                              charities={favoriteCharities}
                            />
                          </>
                        )}
                      </>
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
