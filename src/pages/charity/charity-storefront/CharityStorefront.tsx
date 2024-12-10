'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import StoreFrontBanner from './banner';
import AboutInfoComponent from './about';
import CharityStoreListing from './listing';
import FavoriteButton from '@/components/elements/button/FavoriteButton';
interface CharityData {
  charityName?: string;
  charityNumber?: string;
  charityID?: string;
  description?: string;
  storefrontId?: string;
  addresses?: Array<{
    address: string;
    city: string;
    country: string;
    postcode: string;
  }>;
  profileImage?: string;
  charityBannerImage?: string;
}

const CharityStorefront: React.FC<{ storefrontid: string }> = ({
  storefrontid,
}) => {
  const { data: session, status } = useSession();
  const [charityData, setCharityData] = useState<CharityData | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

useEffect(() => {
  const fetchCharityData = async () => {
    if (status === 'authenticated' && session?.token) {
      console.log('Fetching storefront with id:', storefrontid); // Debug: Log the storefrontId being fetched

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/storefront/${storefrontid}`,
          {
            headers: {
              Authorization: `Bearer ${session?.token}`, // Use the access token from the session
            },
          }
        );
        console.log('Charity Data fetched successfully:', response.data); // Debug: Log the response data
        setCharityData(response.data.charity); // <-- Update this line to get the `charity` object from response.data
      } catch (error) {
        console.error('Error fetching charity data:', error);
      }
    }
  };

  fetchCharityData();
}, [storefrontid, session, status]);

  if (!charityData) {
    return <p>Loading storefront...</p>;
  }

  return (
    <div className="charity-storefront-main-page-wrapper">
      <StoreFrontBanner charityStore={charityData} />
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
                  <div className="favorite-btn-item cursor-pointer p-3">
                    {activeTab === 1 && (
                      <FavoriteButton
                        itemId={charityData.storefrontId}
                        type="charity"
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
                    <CharityStoreListing />
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