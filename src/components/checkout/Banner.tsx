"use client"
import React from 'react'
import Link from 'next/link';
const BannerSection = () => {
  return (
    <section className="basket-page-banner-area py-8 flex flex-col items-center">
      <h1 className="h4 banner-title">Basket</h1>
      <ul className="breadcrumb-area flex items-center gap-[10px] mt-[14px]">
        <li className="breadcrumb-item body-caption prev-pages flex items-center gap-[10px]">
          <Link className="body-caption text-mono-100" href="/">
            Basket
          </Link>
          <span className="angle">{'>'}</span>
        </li>
        <li className="breadcrumb-item body-caption current-page text-mono-70 flex items-center gap-[10px]">
          <Link href="" className="body-caption text-mono-70">
            Order confirmation
          </Link>
        </li>
      </ul>
    </section>
  );
}

export default BannerSection
