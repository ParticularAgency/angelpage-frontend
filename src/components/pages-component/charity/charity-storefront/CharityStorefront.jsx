'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import StoreFrontBanner from './banner';
import AboutInfoComponent from './about';
import CharityStoreListing from './listing';
import FavoriteButton from '@/components/elements/button/FavoriteButton';
import Loading from '@/app/loading';

const CharityStorefront = () => {
  const params = useParams();
  const storefrontid = Array.isArray(params?.storefrontid)
    ? params.storefrontid[0]
    : params?.storefrontid;

  const [charityData, setCharityData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!storefrontid) {
      return;
    }

    const fetchCharityData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/storefront/${storefrontid}`
        );
        if (!response.data?.charity) {
          setNotFound(true);
          setCharityData(null);
          return;
        }
        setCharityData(response.data.charity);
        setNotFound(false);
      } catch (error) {
        console.error('Error fetching charity data:', error);
        setNotFound(true);
        setCharityData(null);
      }
    };

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/storefront/${storefrontid}/products`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProductCount(data.charity?.listedProducts?.length || 0);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharityData();
    fetchProducts();
  }, [storefrontid]);

  if (!storefrontid) {
    return (
      <div className="custom-container py-16 text-center">
        <h1 className="h4 text-mono-100 mb-2">Storefront not available</h1>
        <p className="body-regular text-mono-70 mb-6">
          Invalid storefront link.
        </p>
        <button
          type="button"
          className="rounded-full bg-primary-color-100 px-6 py-2 text-mono-0"
          onClick={() => router.push('/')}
        >
          Return home
        </button>
      </div>
    );
  }

  if (loading && !charityData && !notFound) {
    return <Loading />;
  }

  if (notFound || !charityData) {
    return (
      <div className="custom-container py-16 text-center">
        <h1 className="h4 text-mono-100 mb-2">Storefront not available</h1>
        <p className="body-regular text-mono-70 mb-6">
          This charity storefront could not be found.
        </p>
        <button
          type="button"
          className="rounded-full bg-primary-color-100 px-6 py-2 text-mono-0"
          onClick={() => router.push('/')}
        >
          Return home
        </button>
      </div>
    );
  }

  return (
    <div className="charity-storefront-main-page-wrapper">
      <StoreFrontBanner
        charityStore={charityData}
        productCount={productCount}
      />
      <div className="charity-storefront-wrapper-area">
        <div className="storefront-tabs-area">
          <div className="storefront-tabs-box">
            <div className="custom-container">
              <div className="storefront-tabs-btn-box pt-[51px] pb-[17px] flex justify-between items-center gap-6">
                <ul className="tabs-btn-items flex items-center gap-6">
                  {/* Tab buttons */}
                  <li
                    className={`tabs-btn-list body-small px-[11px] py-2 rounded-[24px] cursor-pointer ${
                      activeTab === 0
                        ? 'bg-[#FCF2FF] text-primary-color-100'
                        : 'hover:bg-[#FCF2FF] hover:text-primary-color-100'
                    }`}
                    onClick={() => setActiveTab(0)}
                  >
                    Shop
                  </li>
                  <li
                    className={`tabs-btn-list body-small px-[11px] py-2 rounded-[24px] cursor-pointer ${
                      activeTab === 1
                        ? 'bg-[#FCF2FF] text-primary-color-100'
                        : 'hover:bg-[#FCF2FF] hover:text-primary-color-100'
                    }`}
                    onClick={() => setActiveTab(1)}
                  >
                    About
                  </li>
                </ul>
                {activeTab === 1 && charityData?.storefrontId && (
                  <div className="favorite-btn-item-store test cursor-pointer p-3">
                    {charityData?._id && (
                      <FavoriteButton
                        itemId={charityData?._id}
                        type="Charity"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tab content */}
          <div className="store-front-tabs-cont-area">
            <ul className="tabs-content-area">
              {activeTab === 0 && (
                <li className="tabs-cont-item">
                  <div className="storefront-shop-tabs-cont bg-[#F1F1F7] sm:py-0!">
                    <CharityStoreListing storefrontid={storefrontid} />
                  </div>
                </li>
              )}
              {activeTab === 1 && (
                <li className="tabs-cont-item">
                  <AboutInfoComponent charityData={charityData} />
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharityStorefront;
