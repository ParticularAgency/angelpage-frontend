'use client';
import React, { useState } from 'react';
import BannerSection from './Banner';
import CharityAccountInfoMain from './account';
import DeleteAccount from './delete-account';
import CharityProductListingArea from './listing';
import { productData } from '@/libs/postProductData';
import SoldItems from './sold';
import AnalyticsPage from './Analytics';
const CharityAccount = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="charity-account-main-wrapper">
      <BannerSection />
      <div className="charity-storefront-wrapper-area">
        <div className="storefront-tabs-area">
          <div className="storefront-tabs-box">
            <div className="custom-container">
              <div className="storefront-tabs-btn-box pt-[51px] pb-[17px] flex justify-between items-center gap-6 sm:pb-0 sm:pt-8">
                <ul className="tabs-btn-items flex items-center sm:overflow-hidden sm:pb-6 sm:overflow-x-auto  gap-6 md:gap-y-4 sm:gap-3">
                  {/* Tab buttons */}
                  <li
                    className={`tabs-btn-list body-small  whitespace-nowrap px-[11px] py-2 rounded-[24px] cursor-pointer ${
                      activeTab === 0
                        ? 'bg-[#FCF2FF] text-primary-color-100'
                        : 'hover:bg-[#FCF2FF] hover:text-primary-color-100'
                    }`}
                    onClick={() => setActiveTab(0)}
                  >
                    Analytics
                  </li>
                  <li
                    className={`tabs-btn-list body-small  whitespace-nowrap px-[11px] py-2 rounded-[24px] cursor-pointer ${
                      activeTab === 1
                        ? 'bg-[#FCF2FF] text-primary-color-100'
                        : 'hover:bg-[#FCF2FF] hover:text-primary-color-100'
                    }`}
                    onClick={() => setActiveTab(1)} // Set active tab to "Account"
                  >
                    Account
                  </li>
                  <li
                    className={`tabs-btn-list body-small  whitespace-nowrap px-[11px] py-2 rounded-[24px] cursor-pointer ${
                      activeTab === 2
                        ? 'bg-[#FCF2FF] text-primary-color-100'
                        : 'hover:bg-[#FCF2FF] hover:text-primary-color-100'
                    }`}
                    onClick={() => setActiveTab(2)} // Set active tab to "Listings"
                  >
                    Listings
                  </li>
                  <li
                    className={`tabs-btn-list body-small  whitespace-nowrap px-[11px] py-2 rounded-[24px] cursor-pointer ${
                      activeTab === 3
                        ? 'bg-[#FCF2FF] text-primary-color-100'
                        : 'hover:bg-[#FCF2FF] hover:text-primary-color-100'
                    }`}
                    onClick={() => setActiveTab(3)} // Set active tab to "Sold"
                  >
                    Sold
                  </li>

                  <li
                    className={`tabs-btn-list body-small  whitespace-nowrap px-[11px] py-2 rounded-[24px] cursor-pointer ${
                      activeTab === 4
                        ? 'bg-[#FCF2FF] text-primary-color-100'
                        : 'hover:bg-[#FCF2FF] hover:text-primary-color-100'
                    }`}
                    onClick={() => setActiveTab(4)} // Set active tab to "Delete Account"
                  >
                    Delete account
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tab content */}
          <div className="charity-account-tabs-cont-area pb-20">
            <div className="custom-container">
              <ul className="tabs-content-area">
                {activeTab === 0 && (
                  <li className="tabs-cont-item">
                    <AnalyticsPage />
                  </li>
                )}
                {activeTab === 1 && (
                  <li className="tabs-cont-item">
                    <CharityAccountInfoMain />
                  </li>
                )}
                {activeTab === 2 && (
                  <li className="tabs-cont-item">
                    <CharityProductListingArea products={productData} />
                  </li>
                )}
                {activeTab === 3 && (
                  <li className="tabs-cont-item">
                    <SoldItems />
                  </li>
                )}
                {activeTab === 4 && (
                  <li className="tabs-cont-item">
                    <DeleteAccount />
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharityAccount;
