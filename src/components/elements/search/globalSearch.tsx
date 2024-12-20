'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
interface Suggestion {
  id: string;
  name: string;
  type: 'Product' | 'Category' | 'Subcategory' | 'Charity';
  storefrontId?: string; // Optional for charities
}
interface SuggestionResponse {
  suggestions: Suggestion[];
}

const GlobalSearch: React.FC = () => {

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
      const response = await axios.get<SuggestionResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/search/suggestions`,
        {
          params: {
            query: searchTerm,
          },
        }
      );

      const sortedSuggestions: Suggestion[] = response.data.suggestions.sort(
        (a, b) => a.name.localeCompare(b.name)
      ); // Sort by name in ascending order

      setSuggestions(sortedSuggestions.slice(0, 8)); // Limit to 8 items
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value); // Fetch suggestions dynamically
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    // Navigate to the appropriate page based on the suggestion type
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
    setSuggestions([]); // Clear suggestions after navigation
  };

  return (
    <div className="global-search-bar sm:hidden w-full max-w-[244px] md:max-w-[160px] relative">
      <form className="global-search-form w-full">
        <div className="global-search-group-field relative w-full">
          <input
            id="searchid1"
            type="search"
            value={query}
            onChange={handleInputChange}
            className="search-input-filed h-10 w-full placeholder:text-primary-color-100 !rounded-[24px] outline-none text-body-form font-normal bg-primary-color-70 pr-2 pl-8 py-[11.5px] text-primary-color-100 leading-[150%] font-secondary"
            placeholder="Search"
          />
          <label
            htmlFor="searchid1"
            className="searchbtn absolute top-[14px] left-3"
          >
            <Image
              src="/images/Search-primary.svg"
              alt="search icon"
              width={13}
              height={13}
            />
          </label>
        </div>
      </form>

      {query.length > 1 && suggestions.length > 0 && (
        <div className="suggestions-dropdown absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-2 z-10 max-h-[200px] overflow-y-auto">
          {loading ? (
            <div className="p-2 text-gray-500 text-sm">Loading...</div>
          ) : (
            suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item p-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span>{suggestion.name}</span>
                <span className="text-xs text-gray-400 ml-2">
                  ({suggestion.type})
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
