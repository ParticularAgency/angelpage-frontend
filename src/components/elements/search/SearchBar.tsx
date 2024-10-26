import Image from 'next/image';
import React, { useState, useEffect } from 'react';

// Define the props interface
interface SearchBarProps {
  onSearch: (query: string) => void; // Function type, accepts a string argument
  filteredProducts: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  filteredProducts,
}) => {
  const [query, setQuery] = useState('');

  // Watch for query changes and call onSearch when the query changes
  useEffect(() => {
    if (query.trim()) {
      onSearch(query); // Call the onSearch function with the current query
    }
  }, [query, onSearch]); // Effect will run when query or onSearch changes

  return (
    <div className="search-bar relative">
      <input
        type="text"
        value={query}
        className="py-[11px] px-2 pl-10  rounded-[24px] bg-[#F4E8F9] forms !text-primary-color-100 placeholder:!text-primary-color-100"
        onChange={e => setQuery(e.target.value)} // Update query state on input change
        placeholder={`Search all ${filteredProducts} items`}
      />
      <button onClick={() => onSearch(query)}>
        <Image
          src="/images/Search-primary.svg"
          className="absolute top-0 left-4 bottom-0 my-auto"
          alt="search icon"
          width={13}
          height={13}
        />
      </button>
    </div>
  );
};

export default SearchBar;
