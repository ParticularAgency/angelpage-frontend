'use client';

import React, { useEffect, useState } from 'react';
import CharityList from '@/components/common/cards/charity/charityList';
import CharitySearch from '@/components/common/search/CharitySearch';
import Image from 'next/image';
import Pagination from '@/components/elements/Pagination';
import type { CharitiesListResponse } from '@/lib/server-api';
import { useGetCharitiesQuery } from '@/store/api/angelpageApi';

const charityImages = [
  '/images/charity/charity1.png',
  '/images/charity/charity2.png',
  '/images/charity/charity3.png',
  '/images/charity/charity4.png',
  '/images/charity/charity5.png',
  '/images/charity/charity6.png',
];

type FindCharityClientProps = {
  initialData?: CharitiesListResponse | null;
};

export default function FindCharityClient({ initialData }: FindCharityClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading: loading, isFetching } = useGetCharitiesQuery({
    page: currentPage,
    limit: 12,
    search: searchTerm,
  });

  const charities = data?.charities ?? initialData?.charities ?? [];
  const totalPages = data?.totalPages ?? initialData?.totalPages ?? 0;
  const [filteredCharities, setFilteredCharities] = useState(charities);

  useEffect(() => {
    setFilteredCharities(charities);
    if (data?.currentPage) {
      setCurrentPage(data.currentPage);
    }
  }, [data, charities]);

  const handleSearch = (term: string) => {
    if (term.length < 3) {
      setSearchMessage('Please write at least 3 characters or more.');
      return;
    }
    setSearchMessage('');
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchMessage('');
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage <= totalPages && newPage >= 1) {
      setCurrentPage(newPage);
    }
  };

  const showSkeleton = (loading || isFetching) && charities.length === 0;

  return (
    <div>
      <div className="custom-container overflow-hidden">
        <div className="flex items-start justify-center flex-nowrap gap-4 sm:gap-2">
          {charityImages.map((image, index) => (
            <div
              key={index}
              className="overflow-hidden shadow-lg w-[237px] min-w-[237px] sm:min-w-[150px] h-[299px]"
            >
              <Image
                src={image}
                alt={`Charity ${index + 1}`}
                width={238}
                height={299}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="pt-[79px] pb-12">
        <h4 className="text-center text-black">Find a Charity</h4>
        <p className="text-center text-[#0B0112] text-[14px] mt-2 mb-[37px]">
          Search for a charity to support
        </p>
        <div className="px-4">
          <CharitySearch onSearch={handleSearch} onClear={handleClear} />
        </div>
      </div>
      <div className="bg-[#F9F9F9] pt-[95px] pb-[173px] mb-[23px]">
        <div className="custom-container">
          {searchMessage && (
            <p className="text-red-600 text-center">{searchMessage}</p>
          )}
          {showSkeleton ? (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 grid-cols-3 gap-8">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-full sm:w-full overflow-hidden relative h-full flex flex-col"
                >
                  <div className="relative w-full h-48">
                    <div className="max-w-[358px] w-full h-full max-h-[197px] skeleton bg-mono-40" />
                  </div>
                  <div className="h-full flex flex-col">
                    <p className="font-bold skeleton h-5 w-full max-w-[280px] bg-mono-40 mt-4 mb-3" />
                    <p className="font-bold skeleton h-8 w-full max-w-[280px] bg-mono-40" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <CharityList charityData={filteredCharities} />
          )}
          <div className="pagination mt-9 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
