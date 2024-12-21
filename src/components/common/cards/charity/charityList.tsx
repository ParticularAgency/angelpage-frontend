import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface CharityDataProps {
  _id: string;
  storefrontId: string;
  charityName: string;
  charityNumber?: string;
  description?: string;
  profileImage?: string;
  contact?: {
    phone?: string;
    website?: string;
  };
}

interface CharityListProps {
  charityData: CharityDataProps[];
}

const CharityList: React.FC<CharityListProps> = ({ charityData }) => {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 grid-cols-3 gap-8">
      {charityData.map(charity => (
        <div
          className="w-[358px] sm:w-full overflow-hidden relative h-full flex flex-col"
          key={charity._id}
        >
          <div className="relative w-full h-48">
            <Link href={`/charity/find-a-charity/${charity._id}`}>
              <span className="absolute top-2 left-2 z-10 uppercase text-[#611192] bg-[#F2E8F8] p-2 text-center text-[10px] font-bold">
                {charity.charityName}
              </span>
            </Link>
            <Link
              href={`/charity/find-a-charity/${charity._id}`}
              className="block w-full h-full"
            >
              <Image
                src={
                  charity.profileImage ||
                  '/images/products/card-placeholder-image.webp'
                }
                alt={charity.charityName}
                width={358}
                height={197}
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
          <div className="h-full flex flex-col">
            <p className="font-bold text-[10px] uppercase text-[#611192] mt-4 mb-3">
              {charity.charityName}
            </p>
            <p className="text-[#474648] text-[14px]">{charity.description}</p>
            <Link
              href={`/charity/find-a-charity/${charity._id}`}
              className="block mt-auto"
              passHref
            >
              <button className="mt-4 bg-[#0B0112] text-white py-2 px-4 w-full text-[14px]">
                Donate
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CharityList;
