'use client';
import React from 'react';

interface Address {
  address?: string;
  city?: string;
  country?: string;
  postcode?: string;
}

interface AboutInfoComponentProps {
  charityData?: {
    charityName?: string;
    charityNumber?: string;
    charityID?: string;
    description?: string;
    storefrontId?: string;
    addresses?: Address[];
    profileImage?: string;
    charityBannerImage?: string;
  } | null;
}

const AboutInfoComponent: React.FC<AboutInfoComponentProps> = ({
  charityData, // Default to an empty object
}) => {
  const {
    charityName = 'Charity Name Not Available',
    charityNumber = 'N/A',
    charityID = 'N/A',
    description = 'No description available for this charity.',
    addresses = [],
  } = charityData || {};

  const address = addresses[0] || {};

  return (
    <div className="storefront-about-tabs-cont pt-[35px] pb-[90px]">
      <div className="custom-container">
        <div className="storefront-about-tabs-cont-wrapper">
          <h4 className="h4 storefront-about mb-[21px] font-primary">
            {charityName}
          </h4>
          <p className="desc p max-w-[692px] w-full body-small">
            {description}
          </p>
          <ul className="charity-storefront-info-list mt-[21px] flex flex-col gap-4">
            <li className="charity-storefront-info-item flex items-center gap-2 body-bold-small">
              Charity Number:{' '}
              <span className="body-small">{charityNumber}</span>
            </li>
            <li className="charity-storefront-info-item flex items-center gap-2 body-bold-small">
              Charity ID: <span className="body-small">{charityID}</span>
            </li>
            {addresses.length > 0 && (
              <li className="charity-storefront-info-item flex items-center gap-2 body-bold-small">
                Address:{' '}
                <span className="body-small">
                  {address.address || 'Address Not Available'},{' '}
                  {address.city || 'City Not Available'},{' '}
                  {address.country || 'Country Not Available'},{' '}
                  {address.postcode || 'Postcode Not Available'}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutInfoComponent;
