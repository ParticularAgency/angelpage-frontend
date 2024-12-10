import React from 'react';

const SearchBar: React.FC = () => {
  return (
    <div className="flex justify-center mt-8">
      <input
        type="text"
        placeholder="Search a charity"
        className="text-[12px] search-border py-2 px-2 w-full max-w-md focus:outline-none"
      />
      <button className="bg-[#0B0112] text-white py-2 px-4">Go</button>
    </div>
  );
};

export default SearchBar;
