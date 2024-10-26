'use client';
import React, { useState } from 'react';
import CharityList from '@/components/common/cards/charity/charityList';
import CharitySearch from '@/components/common/search/CharitySearch';
import Image from 'next/image';
import { charityData } from '@/libs/charities';

const FindCharity: React.FC = () => {
  const charityImages = [
    '/images/charity/charity1.png',
    '/images/charity/charity2.png',
    '/images/charity/charity3.png',
    '/images/charity/charity4.png',
    '/images/charity/charity5.png',
    '/images/charity/charity6.png',
  ];

  const [filteredCharities, setFilteredCharities] = useState(charityData);
  const [searchMessage, setSearchMessage] = useState<string>('');

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.length < 3) {
      setSearchMessage('Please write at least 3 characters or more.');
      setFilteredCharities(charityData);
      return;
    }

    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = charityData.filter(charity => {
      if (charity.name && typeof charity.name === 'string') {
        return charity.name.toLowerCase().includes(lowercasedTerm);
      }
      return false;
    });

    if (filtered.length === 0) {
      setSearchMessage('No results found. Please try a different search term.');
    } else {
      setSearchMessage('');
    }

    setFilteredCharities(filtered);
  };

  const handleClear = () => {
    setFilteredCharities(charityData);
    setSearchMessage('');
  };

  return (
    <div>
      <div className="custom-container">
        <div className="grid grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-4">
          {charityImages.map((image, index) => (
            <div
              key={index}
              className="overflow-hidden shadow-lg max-w-[237px] w-full h-[299px]"
            >
              <Image
                src={image}
                alt={`Charity ${index + 1}`}
                width={238}
                height={299}
                className="w-full h-full object-cover"
                loading="lazy" // Lazy load images for better performance
              />
            </div>
          ))}
        </div>
      </div>
      <div className="pt-[79px] pb-[59px]">
        <h4 className="text-center text-[#000]">Find a Charity</h4>
        <p className="text-center text-[#0B0112] text-[14px] mt-2 mb-[37px]">
          Search for a charity to support
        </p>
        <div className="px-4">
          <CharitySearch onSearch={handleSearch} onClear={handleClear} />{' '}
          {/* Added onClear prop */}
        </div>
      </div>
      <div className="bg-[#F9F9F9] pt-[95px] pb-[173px] mb-[23px]">
        <div className="custom-container">
          {searchMessage && (
            <p className="text-red-600 text-center">{searchMessage}</p>
          )}
          <CharityList charityData={filteredCharities} />
        </div>
      </div>
    </div>
  );
};

export default FindCharity;
