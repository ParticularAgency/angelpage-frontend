'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import StoreFrontBanner from './banner';
import AboutInfoComponent from './about';
import CharityStoreListing from './listing';
import FavoriteButton from '@/components/elements/button/FavoriteButton';
import { ToastService } from '@/components/elements/notifications/ToastService';
import Loading from '@/app/loading';


const CharityStorefront = ({
  storefrontid,
}) => {
  const [charityData, setCharityData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);
const router = useRouter();
  useEffect(() => {
    const fetchCharityData = async () => {
      if (!storefrontid) {
        console.error('Storefront ID is missing.');
         router.push('/');
         ToastService.error(
           'Store not available. Redirecting to home page...'
         );
        return;
      }
      console.log('Fetching storefront with id:', storefrontid);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/storefront/${storefrontid}`
        );
         if (!response.data.charity) {
           setLoading(false);
           setCharityData(null);
           router.push('/');
           return;
         }
        setCharityData(response.data.charity);
        console.log('charity response data' , response.data.charity);
      } catch (error) {
        console.log('Error fetching charity data:', error);
        router.push('/');
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
        setProductCount(data.charity.listedProducts?.length || 0);
        console.log('list product:', data.charity.listedProducts);
        console.log('total product:', data.charity.listedProducts?.length || 0);
        // ToastService.success('Products loaded successfully.');
      } catch (error) {
        console.error('Error fetching products:', error);
        // ToastService.error('Error loading products.');
      } finally {
        setLoading(false);
      }
    };

    fetchCharityData();
    fetchProducts();
  }, [storefrontid]);

    if (loading && !charityData) {
      return <Loading />;
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
                  <div className="storefront-shop-tabs-cont bg-[#F1F1F7] sm:!py-0">
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
