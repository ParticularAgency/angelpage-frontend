import Image from 'next/image'
import React from 'react'

const StoreFrontBanner = () => {
  return (
    <section className="storefront-banner-component bg-mono-100 sm:bg-transparent sm:mt-2">
         <div className="custom-container-full laptop-m:pl-6 sm:px-3">
            <div className="storefront-banner-wrapper grid grid-cols-12 gap-0 sm:block sm:h-[286px] sm:relative sm:bg-mono-100">
                 <div className="col-span-5 w-full pr-[57px] laptop-x:pr-[103px] laptop-m:pr-14 py-[42px] flex flex-col justify-end  sm:absolute bottom-0 left-0 sm:bg-mono-100 sm:pb-6 sm:pt-5 sm:px-6">
                      <div className="storefront-banner-cont max-w-[385px] ml-auto">
                         <Image src="/images/icons/charity-img.png" className="w-10 h-10 object-cover mb-2 sm:mb-1 sm:w-8 sm:h-8" alt="storefront charity logo image" width={40} height={40} />
                         <h1 className="h3 storefront-banner-tittle !text-mono-0">Salvation Army Trading Co Ltd</h1>
                         <p className="available-product-total-number body-small mt-2 sm:mt-1 !text-mono-0">24 items for sale</p>
                      </div>
                 </div>
                 <div className="col-span-7 w-full">
                    <div className="storefront-banner-modal-img w-full h-[387px] sm:h-[286px]"><Image src="/images/charity-storefront/charity-banner-img1.png" className="w-full h-full object-cover object-top" alt="storefront charity model image" width={831} height={387} /></div>
                 </div>
            </div>
         </div>
    </section>
  )
}

export default StoreFrontBanner
