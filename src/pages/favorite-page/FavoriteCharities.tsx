'use client';
import React from 'react';
import FavoriteCharityCard from '@/components/common/cards/charity/favoriteCharityCard';

interface FavoriteCharityListingProps {
  charities: Array<{
    id: string;
    name: string;
    listingProduct?: string;
    image: string;
    description?: string;
  }>;
}

const FavoriteCharityListing: React.FC<FavoriteCharityListingProps> = ({
  charities = [],
}) => {
  return (
    <section className="products-lists-section pt-[56px] pb-[54px] md:pb-9 sm:pt-10 sm:pb-12 bg-[#F1F1F7]">
      <div className="custom-container">
        <div className="charity-favorite-lists-wrapper grid grid-cols-12 gap-x-5 gap-y-6 sm:gap-y-8">
          {charities.length === 0 ? (
            <p>No favorite charities yet!</p>
          ) : (
            charities.map(charity => (
              <FavoriteCharityCard key={charity.id} charity={charity} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FavoriteCharityListing;
