'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FavoriteCharityCardProps {
  charity: {
    id: string;
    charityName: string;
    storefrontId: string; // Ensure storefrontId is included in the charity object
    listedProducts?: Array<string | object>; // Assuming this is an array of products
    profileImage: string;
    description?: string;
  };
}

const FavoriteCharityCard: React.FC<FavoriteCharityCardProps> = ({
  charity,
}) => {


  return (
    <div className="max-w-[358px] w-full sm:w-full overflow-hidden relative col-span-3 md:col-span-6 sm:col-span-full">
      <div className="relative w-full h-48">
        {/* Charity Name Tag */}
        <Link href={`/charity/store/${charity.storefrontId}`}>
          <span className="absolute top-2 left-2 z-10 uppercase text-[#611192] bg-[#F2E8F8] p-2 text-center text-[10px] font-bold">
            {charity.charityName}
          </span>
        </Link>

        {/* Charity Image */}
        <Link
          href={`/charity/store/${charity.storefrontId}`}
          className="block w-full h-full"
        >
          <Image
            src={charity.profileImage}
            alt={charity.charityName}
            width={358}
            height={197}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>

      {/* Charity Details */}
      <div className="p-0 mt-4 bg-transparent">
        <p className="eyebrow-small text-primary-color-100 font-secondary uppercase tracking-[.5px] font-bold">
          {charity.listedProducts?.length || 0} items
        </p>
      </div>
    </div>
  );
};

export default FavoriteCharityCard;
