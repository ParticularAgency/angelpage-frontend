'use client';
import React, { useEffect, useState } from 'react';
import CharityList from '@/components/common/cards/charity/charityList';
import CharitySearch from '@/components/common/search/CharitySearch';
import Image from 'next/image';
import axios from 'axios';
import Pagination from '@/components/elements/Pagination';

interface Charity {
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
interface CharityResponse {
  charities: Charity[];
  totalPages: number;
  currentPage: number;
}
const FindCharity: React.FC = () => {
  const charityImages = [
    '/images/charity/charity1.png',
    '/images/charity/charity2.png',
    '/images/charity/charity3.png',
    '/images/charity/charity4.png',
    '/images/charity/charity5.png',
    '/images/charity/charity6.png',
  ];

  const [charities, setCharities] = useState<Charity[]>([]);
  const [filteredCharities, setFilteredCharities] = useState<Charity[]>([]);
  const [searchMessage, setSearchMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch charities dynamically from the backend with pagination
  const fetchCharities = async (page: number = 1, search: string = '') => {
    setLoading(true);
    try {
      const response = await axios.get<CharityResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/charity/charities`,
        {
          params: {
            page,
            limit: 12,
            search, // Send the search term to the backend
          },
        }
      );
      // Safeguard against missing 'charities' in response
      const fetchedCharities = response?.data?.charities || [];
      setCharities(fetchedCharities);
      setFilteredCharities(fetchedCharities);
      setTotalPages(response?.data?.totalPages || 0);
      setCurrentPage(response?.data?.currentPage || 1);
    } catch (error) {
      console.error('Error fetching charities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharities(currentPage, searchTerm); // Fetch charities when page or search term changes
  }, [currentPage, searchTerm]);

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.length < 3) {
      setSearchMessage('Please write at least 3 characters or more.');
      setFilteredCharities(charities); // Reset to full list
      return;
    }

    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = charities.filter(charity => {
      if (charity?.charityName && typeof charity?.charityName === 'string') {
        return charity?.charityName.toLowerCase().includes(lowercasedTerm);
      }
      return false;
    });
    if (filtered.length === 0) {
      setSearchMessage('No results found. Please try a different search term.');
    } else {
      setSearchMessage('');
    }
    setSearchTerm(searchTerm);
    setFilteredCharities(filtered);
  };

  const handleClear = () => {
    setFilteredCharities(charities); // Reset to full list
    setSearchMessage('');
  };

  const handlePageChange = (newPage: number) => {
    if (newPage <= totalPages && newPage >= 1) {
      setCurrentPage(newPage); // Change the page number
    }
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
      <div className="pt-[79px] pb-12">
        <h4 className="text-center text-[#000]">Find a Charity</h4>
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
          {loading ? (
            <>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 grid-cols-3 gap-8">
                <div className="w-full sm:w-full overflow-hidden relative h-full flex flex-col">
                  <div className="relative w-full h-48">
                    <span className="absolute skeleton max-w-[250px] h-5 w-full top-2 left-2 z-10 uppercase text-[#611192] bg-[#F2E8F8] p-2 text-center text-[10px] font-bold"></span>
                    <div className="max-w-[358px] w-full h-full max-h-[197px] skeleton bg-mono-40"></div>
                  </div>
                  <div className="h-full flex flex-col">
                    <p className="font-bold skeleton h-5 w-full max-w-[280px] bg-mono-40 mt-4 mb-3"></p>
                    <p className="font-bold skeleton h-8 w-full max-w-[280px] bg-mono-40"></p>
                    <button className="mt-4 skeleton h-10 w-full !block bg-mono-40">
                      <span></span>
                    </button>
                  </div>
                </div>
                <div className="w-full sm:w-full overflow-hidden relative h-full flex flex-col">
                  <div className="relative w-full h-48">
                    <span className="absolute skeleton max-w-[250px] h-5 w-full top-2 left-2 z-10 uppercase text-[#611192] bg-[#F2E8F8] p-2 text-center text-[10px] font-bold"></span>
                    <div className="max-w-[358px] w-full h-full max-h-[197px] skeleton bg-mono-40"></div>
                  </div>
                  <div className="h-full flex flex-col">
                    <p className="font-bold skeleton h-5 w-full max-w-[280px] bg-mono-40 mt-4 mb-3"></p>
                    <p className="font-bold skeleton h-8 w-full max-w-[280px] bg-mono-40"></p>
                    <button className="mt-4 skeleton h-10 w-full !block bg-mono-40">
                      <span></span>
                    </button>
                  </div>
                </div>
                <div className="w-full sm:w-full overflow-hidden relative h-full flex flex-col">
                  <div className="relative w-full h-48">
                    <span className="absolute skeleton max-w-[250px] h-5 w-full top-2 left-2 z-10 uppercase text-[#611192] bg-[#F2E8F8] p-2 text-center text-[10px] font-bold"></span>
                    <div className="max-w-[358px] w-full h-full max-h-[197px] skeleton bg-mono-40"></div>
                  </div>
                  <div className="h-full flex flex-col">
                    <p className="font-bold skeleton h-5 w-full max-w-[280px] bg-mono-40 mt-4 mb-3"></p>
                    <p className="font-bold skeleton h-8 w-full max-w-[280px] bg-mono-40"></p>
                    <button className="mt-4 skeleton h-10 w-full !block bg-mono-40">
                      <span></span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <CharityList charityData={filteredCharities} />
            </>
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
};

export default FindCharity;
