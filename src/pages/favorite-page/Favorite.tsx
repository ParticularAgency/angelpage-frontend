"use client"
import React, { useState } from 'react';
import BannerSection from './Banner'
import { useRouter } from 'next/router';
import FavoriteProductListing from './FavoriteProducts';
import FavoriteCharityListing from './FavoriteCharities';
import { Button } from '@/components/elements';

const FavoritePage = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
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
                    activeTab === 0 ? 'bg-[#FCF2FF] text-primary-color-100' : 'hover:bg-[#FCF2FF] hover:text-primary-color-100'
                  }`}
                  onClick={() => setActiveTab(0)} 
                >
                  Items
                </li>
                <li
                  className={`tabs-btn-list body-small px-[11px] py-2 rounded-[24px] cursor-pointer ${
                    activeTab === 1 ? 'bg-[#FCF2FF] text-primary-color-100' : 'hover:bg-[#FCF2FF] hover:text-primary-color-100' 
                  }`}
                  onClick={() => setActiveTab(1)} // Set active tab to "About"
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
                      {/* <div className="favorites-empty-sates flex flex-col justify-center pt-20 pb-[144px]">
                           <p className="body-bold-medium mb-2 text-mono-100 text-center">No favourites yet!</p>
                           <p className="body-regular max-w-[412px] mx-auto text-mono-90">Click the 'Heart' button on items you love and you'll be able to keep an eye on the items here</p>
                           <Button variant="primary" className="return-to-shopping-btn mt-6 mx-auto" onClick={() => console.log('make me return to shop page')}>Start shopping</Button>
                      </div> */}
                      <FavoriteProductListing />
                    </div>
                  </li>
                )}
                {activeTab === 1 && (
                  <li className="tabs-cont-item">
                      <div className="favorite-charity-tabs-cont">
                        {/* <div className="favorites-empty-sates flex flex-col justify-center pt-20 pb-[144px]">
                           <p className="body-bold-medium mb-2 text-mono-100 text-center">No favourites yet!</p>
                           <p className="body-regular max-w-[412px] mx-auto text-mono-90">Click the 'Heart' button on items you love and you'll be able to keep an eye on the items here</p>
                           <Button variant="primary" className="return-to-shopping-btn mt-6 mx-auto" onClick={() => console.log('make me return to shop page')}>Start shopping</Button>
                      </div> */}
                       <FavoriteCharityListing />
                      </div>
                  </li>
                )}
              </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FavoritePage
