import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FavoriteCharityCardProps {
  charity: {
    id: string;
    name: string;
    listingPrtoduct?: string;
    image: string;
  };
}

const FavoriteCharityCard: React.FC<FavoriteCharityCardProps> = ({ charity }) => {
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
        <Link href={`/charity/find-a-charity/${charity.id}`} className="block w-full h-full">
          <Image
            src={charity.image}
            alt={charity.id}
            width={358}
            height={197}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>

      {/* Charity Details */}
      <div>
        <p className="eyebrow-small mt-6 text-primary-color-100">{charity.listingPrtoduct}</p>
        
      </div>
    </div>
  );
};

export default FavoriteCharityCard;
