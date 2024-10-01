import Image from 'next/image'
import React from 'react'

const GlobalSearch = () => {
  return (

    <div className="global-search-bar sm:hidden w-full  max-w-[244px]">
                <form action="get" className="global-search-form w-full">
                  <div className="global-search-group-field relative w-full">
                    <input id='searchid1' type="search" className="search-input-filed h-10 w-full placeholder:text-primary-color-100 !rounded-[24px] outline-none text-body-form font-normal bg-primary-color-70 pr-2 pl-8 py-[11.5px] text-primary-color-100 leading-[150%] font-secondary" placeholder='Search' />
                    <label htmlFor="searchid1" className='searchbtn absolute top-[14px] left-3'>
                        <Image src="/images/Search-primary.svg" alt='search icon' width={13} height={13} />
                    </label>
                  </div>
                </form>
               </div>
  )
}

export default GlobalSearch
