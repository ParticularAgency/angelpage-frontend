'use client';
import React from 'react';
import { ChevronRight } from 'lucide-react';

const ProductBannerSec = ({
  category,
  subcategory,
}: {
  category: string;
  subcategory?: string;
}) => {
  return (
    <section className="product-banner-section bg-mono-0 py-9 sm:py-5">
      <div className="custom-container">
        <div className="product-banner-wrapper flex flex-col items-center justify-center">
          <ul className="breadcrumb-area flex items-center gap-[10px]">
            <li className="breadcrumb-item body-caption prev-pages flex items-center gap-[10px]">
              <a className="body-caption text-mono-100" href="/">
                Home
              </a>
              <ChevronRight className="h-3.5 w-3.5 text-mono-70" aria-hidden />
            </li>
            {subcategory ? (
              <>
                <li className="breadcrumb-item body-caption current-page text-mono-70 flex items-center gap-[10px]">
                  <a
                    href={`/product?category=${category}`}
                    className="body-caption text-mono-70 capitalize"
                  >
                    {category}
                  </a>
                  <ChevronRight className="h-3.5 w-3.5 text-mono-70" aria-hidden />
                </li>
                <li className="breadcrumb-item body-caption capitalize text-mono-70">
                  {subcategory}
                </li>
              </>
            ) : (
              <li className="breadcrumb-item body-caption capitalize text-mono-70">
                {category}
              </li>
            )}
          </ul>
          <h4 className="h4 current-category-title capitalize mt-[15px] sm:mt-2">
            {subcategory || category}
          </h4>
        </div>
      </div>
    </section>
  );
};

export default ProductBannerSec;
