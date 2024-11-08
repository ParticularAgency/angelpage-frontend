'use client';
import React, { useState } from 'react';
import StoreFrontBanner from './banner';
import { FavoriteOutlineIcon } from '@/icons';
import AboutInfoComponent from './about';
import CharityStoreListing from './listing';


const CharityStorefront: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    // if (onFavoriteClick) {
    //   onFavoriteClick();
    // }
  };
  return (
    <div className="charity-storefront-main-page-wrapper">
      <StoreFrontBanner />
      <div className="charity-storefront-wrapper-area">
        <div className="storefront-tabs-area">
          <div className="storefront-tabs-box">
            <div className="custom-container">
              <div className="storefront-tabs-btn-box  pt-[51px] pb-[17px] flex justify-between items-center gap-6">
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
                {activeTab === 1 && (
                  <div
                    className="favorite-btn-item cursor-pointer p-3"
                    onClick={handleFavoriteClick}
                  >
                    <FavoriteOutlineIcon
                      fillColor={isFavorite ? '#611192' : 'none'}
                      strokeColor={isFavorite ? '#611192' : '#131313'}
                    />
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
                    <CharityStoreListing />
                  </div>
                </li>
              )}
              {activeTab === 1 && (
                <li className="tabs-cont-item">
                  <AboutInfoComponent />
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
