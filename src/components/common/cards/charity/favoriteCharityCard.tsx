'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface FavoriteCharityCardProps {
  charity: {
    id: string;
    name: string;
    listingProduct?: string;
    image: string;
    description?: string;
  };
}

const FavoriteCharityCard: React.FC<FavoriteCharityCardProps> = ({
  charity,
}) => {
  const [isFavorited, setIsFavorited] = useState(true);

  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
    // Here you would also add the logic to update the backend with the favorite status
  };

  return (
    <div className="max-w-[358px] w-full sm:w-full overflow-hidden relative col-span-3 md:col-span-6 sm:col-span-full">
      <div className="relative w-full h-48">
        {/* Charity Name Tag */}
        <Link href={`/charity/find-a-charity/${charity.id}`}>
          <span className="absolute top-2 left-2 z-10 uppercase text-[#611192] bg-[#F2E8F8] p-2 text-center text-[10px] font-bold">
            {charity.name}
          </span>
        </Link>

        {/* Charity Image */}
        <Link
          href={`/charity/find-a-charity/${charity.id}`}
          className="block w-full h-full"
        >
          <Image
            src={charity.image}
            alt={charity.name}
            width={358}
            height={197}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>

      {/* Charity Details */}
      <div className="p-4 bg-white">
        <p className="eyebrow-small text-primary-color-100 font-bold mb-2">
          {charity.name}
        </p>
        {charity.description && (
          <p className="text-mono-100 text-sm mb-2">{charity.description}</p>
        )}
        {charity.listingProduct && (
          <p className="text-mono-100 text-sm">{charity.listingProduct}</p>
        )}
        <button
          onClick={handleFavoriteToggle}
          className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium ${
            isFavorited ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      </div>
    </div>
  );
};

export default FavoriteCharityCard;
