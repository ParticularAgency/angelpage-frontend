'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Suggestion {
  id: string;
  name: string;
  type: 'Product' | 'Category' | 'Subcategory' | 'Charity';
  storefrontId?: string; // Optional for charities
  brand?: string; // For products
  charityId?: string; // For charities
}

const GlobalSearchSecondary: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchSuggestions = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/search/suggestions`,
        {
          params: { query: searchTerm },
        }
      );

      console.log('Raw API Response:', response.data);

      const suggestionsData = response.data || [];
      if (Array.isArray(suggestionsData)) {
        const mappedSuggestions: Suggestion[] = suggestionsData.map(item => ({
          id: item.id || item._id, // Product or Charity ID
          name: item.name || item.title, // Product, Category, or Charity Name
          type: item.type || 'Unknown', // Type (Product, Category, Subcategory, Charity)
          storefrontId: item.storefrontId || undefined, // Storefront ID (for charities)
          brand: item.brand || undefined, // Product brand
          charityId: item.charityId || undefined, // Charity ID
        }));

        setSuggestions(
          mappedSuggestions
            .sort((a, b) => a.name.localeCompare(b.name))
            .slice(0, 8)
        );
        console.log('Mapped Suggestions:', mappedSuggestions);
      } else {
        console.error('Suggestions data is not an array:', suggestionsData);
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.type === 'Product') {
      router.push(`/product/${suggestion.id}`);
    } else if (
      suggestion.type === 'Category' ||
      suggestion.type === 'Subcategory'
    ) {
      router.push(
        `/products/listing?${suggestion.type.toLowerCase()}=${suggestion.name}`
      );
    } else if (suggestion.type === 'Charity') {
      router.push(`/charity/store/${suggestion.storefrontId}`);
    }
    setSuggestions([]);
  };

  return (
    <div className="global-search-bar global-search-bar-secondary relative mt-6 mb-4 px-4 w-full  max-w-full">
      <form action="get" className="global-search-form w-full">
        <div className="global-search-group-field relative w-full">
          <input
            id="searchid1"
            type="search"
            value={query}
            onChange={handleInputChange}
            className="search-input-filed h-12 w-full placeholder:text-[#7B7C79] placeholder:font-normal placeholder:font-secondary !rounded-none outline-none text-body-caption font-normal bg-transparent border-b-2 border-b-mono-40 pr-0 pl-[6px] py-[15px] text-mono-100 leading-[150%] font-secondary"
            placeholder="Search"
          />
          <label
            htmlFor="searchid1"
            className="searchbtn absolute top-[17px] right-[17px]"
          >
            <Image
              src="/images/Search-default-icon.svg"
              alt="search icon"
              width={13}
              height={13}
            />
          </label>
        </div>
      </form>

      {query.length > 1 && (
        <div className="suggestions-dropdown absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-2 z-10 max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="p-2 text-gray-500 text-sm">Loading...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item p-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 flex flex-col"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className="body-bold">{suggestion.name}</span>
                <span className="caption-bold text-gray-400">
                  {suggestion.type}{' '}
                  {suggestion.brand ? `| Brand: ${suggestion.brand}` : ''}{' '}
                  {suggestion.charityId
                    ? `| Charity ID: ${suggestion.charityId}`
                    : ''}
                </span>
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500 text-sm">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearchSecondary;
