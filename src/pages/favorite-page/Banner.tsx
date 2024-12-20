import React from 'react';

interface BannerSectionProps {
  totalProducts: number;
  totalCharities: number;
}

const BannerSection: React.FC<BannerSectionProps> = ({
  totalProducts,
  totalCharities,
}) => {
  return (
    <section className="favorite-banner-section pt-10 pb-7 sm:pt-6">
      <div className="custom-container">
        <div className="favorite-banner-wrapper">
          <h1 className="h3 banner-title mb-1 font-primary text-mono-100">
            Favourites
          </h1>
          <div className="favorite-info flex items-center gap-[15px]">
            <p className="total-favorite-product body-small text-mono-80">
              {totalProducts  || '0'} items
            </p>
            <p className="total-favorite-charity body-small text-mono-80">
              {totalCharities || '0'} Charities
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
