'use client';
import React, { useState } from 'react';
import BannerSection from './Banner';
import AnalyticsPage from './Analytics';
import UsersAccountInfoMain from './Account';
import LogoutButton from '@/components/elements/button/LogoutButton';
// import { Button } from '@/components/elements';

const AdminAccount = () => {
  const [activeTab, setActiveTab] = useState(0);


  return (
    <div className="charity-account-main-wrapper">
      <BannerSection />
      <div className="charity-storefront-wrapper-area">
        <div className="storefront-tabs-area">
          <div className="storefront-tabs-box">
            <div className="custom-container">
              <div className="storefront-tabs-btn-box pb-[17px] flex justify-between items-center gap-6 sm:pb-0 sm:pt-8">
                <ul className="tabs-btn-items flex items-center sm:overflow-hidden sm:pb-6 sm:overflow-x-auto  gap-6 md:gap-y-4 sm:gap-3">
                  {/* Tab buttons */}
                  <li
                    className={`tabs-btn-list body-small whitespace-nowrap px-[11px] py-2 rounded-[24px] cursor-pointer ${
                      activeTab === 0
                        ? 'bg-[#FCF2FF] text-primary-color-100'
                        : 'hover:bg-[#FCF2FF] hover:text-primary-color-100'
                    }`}
                    onClick={() => setActiveTab(0)}
                  >
                    Analytics
                  </li>
                  {/* <li
                    className={`tabs-btn-list body-small whitespace-nowrap px-[11px] py-2 rounded-[24px] cursor-pointer ${
                      activeTab === 1
                        ? 'bg-[#FCF2FF] text-primary-color-100'
                        : 'hover:bg-[#FCF2FF] hover:text-primary-color-100'
                    }`}
                    onClick={() => setActiveTab(1)} // Set active tab to "Account"
                  >
                    Category
                  </li> */}
                  <li
                    className={`tabs-btn-list body-small relative whitespace-nowrap px-[11px] py-2 rounded-[24px] cursor-pointer ${
                      activeTab === 1
                        ? 'bg-[#FCF2FF] text-primary-color-100'
                        : 'hover:bg-[#FCF2FF] hover:text-primary-color-100'
                    }`}
                    onClick={() => setActiveTab(1)} // Set active tab to "Listings"
                  >
                    Account
                  </li>
                  {/* <li className="tabs-btn-list body-small whitespace-nowrap px-[11px] py-2 rounded-[24px] cursor-pointer">
                    <Button variant="secondary">Add charity list</Button>
                  </li> */}
                  <li className="tabs-btn-list body-small whitespace-nowrap px-[11px] py-2 rounded-[24px] cursor-pointer">
                    <LogoutButton />
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
                {/* {activeTab === 1 && <li className="tabs-cont-item"></li>} */}

                {activeTab === 1 && (
                  <li className="tabs-cont-item">
                    {' '}
                    <UsersAccountInfoMain />
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

export default AdminAccount;
