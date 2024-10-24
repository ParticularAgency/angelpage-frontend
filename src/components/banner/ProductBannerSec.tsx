import Link from 'next/link'
import React from 'react'

const ProductBannerSec = () => {
  return (
    <section className="product-banner-section bg-mono-0 py-9 sm:py-5">
      <div className="custom-container">
        <div className="product-banner-wrapper flex flex-col items-center justify-center">
             <ul className="breadcrumb-area flex items-center gap-[10px]">
                 <li className="breadcrumb-item body-caption prev-pages flex items-center gap-[10px]">
                    <Link className="body-caption text-mono-100" href="/">Home</Link>
                    <span className="angle">{">"}</span>
                 </li>
                  <li className="breadcrumb-item body-caption current-page text-mono-70 flex items-center gap-[10px]">
                    <Link href="" className="body-caption text-mono-70">Electronics</Link>
                 </li>
             </ul>
             <h4 className="h4 current-category-title mt-[15px] sm:mt-2">Electronics</h4>
        </div>
      </div>
    </section>
  )
}

export default ProductBannerSec
