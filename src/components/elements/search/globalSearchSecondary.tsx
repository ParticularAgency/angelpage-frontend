import Image from 'next/image';
import React from 'react';

const GlobalSearchSecondary = () => {
  return (
    <div className="global-search-bar global-search-bar-secondary mt-6 mb-4 px-4 w-full  max-w-full">
      <form action="get" className="global-search-form w-full">
        <div className="global-search-group-field relative w-full">
          <input
            id="searchid1"
            type="search"
            className="search-input-filed h-12 w-full placeholder:text-[#7B7C79] placeholder:font-normal placeholder:font-secondary !rounded-none outline-none text-body-caption font-normal bg-transparent border-b-2 border-b-mono-40 pr-0 pl-[6px] py-[15px] text-mono-100 leading-[150%] font-secondary"
            placeholder="Search"
          />
          <label
            htmlFor="searchid1"
            className="searchbtn absolute top-[17px] right-0"
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
    </div>
  );
};

export default GlobalSearchSecondary;
