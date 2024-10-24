"use client"
import {  FavoriteOutlineSecondaryIcon, ShearIcon } from '@/icons'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../elements'
import RelatedCategoryProducts from './RelatedProductCategory'

const ProductSinglepage = () => {
  return (
    <section className="product-singlepage-section">
      <div className="custom-container max-w-[960px] w-full">
        <div className="product-breadcrumb-area pt-4 pb-10 sm:pb-4">
          <ul className="breadcrumb-area flex items-center justify-center gap-[10px]">
            <li className="breadcrumb-item body-caption prev-pages flex items-center gap-[10px]">
              <Link className="body-caption text-mono-100" href="/">Home</Link>
              <span className="angle">{">"}</span>
            </li>
            <li className="breadcrumb-item body-caption prev-pages flex items-center gap-[10px]">
              <Link className="body-caption text-mono-100" href="/electronics">Electronics</Link>
              <span className="angle">{">"}</span>
            </li>
            <li className="breadcrumb-item body-caption current-page text-mono-70 flex items-center gap-[10px]">
              <span className="body-caption text-mono-70">iPhone 13</span>
            </li>
          </ul>
        </div>
        <div className="product-singlepage-cont-wrapper w-full max-w-[895px] flex items-start justify-between gap-[92px] lg:gap-14 md:gap-10 sm:gap-12 pb-[83px] sm:pb-12 sm:flex-col">
          <div className="product-singlepage-left-cont max-w-[415px] w-full">
            <div className="swiper-product-slider-area flex sm:flex-col-reverse items-start gap-2">
              <div className="swiper-product-slide-tab-item flex flex-col sm:flex-row gap-3">
                <div className="slide-tab-item"><Image src="/images/products/product-view-img1.jpeg" className="w-12 h-12 object-cover cursor-pointer" alt="product list image" width={48} height={48} /></div>
                <div className="slide-tab-item"><Image src="/images/products/product-view-img2.jpeg" className="w-12 h-12 object-cover cursor-pointer" alt="product list image" width={48} height={48} /></div>
                <div className="slide-tab-item"><Image src="/images/products/product-view-img3.jpeg" className="w-12 h-12 object-cover cursor-pointer" alt="product list image" width={48} height={48} /></div>
                <div className="slide-tab-item"><Image src="/images/products/product-view-img4.jpeg" className="w-12 h-12 object-cover cursor-pointer" alt="product list image" width={48} height={48} /></div>
                <div className="slide-tab-item"><Image src="/images/products/product-view-img5.jpeg" className="w-12 h-12 object-cover cursor-pointer" alt="product list image" width={48} height={48} /></div>
              </div>
              <div className="swiper-slider-view w-full relative">
                <Image src="/images/icons/charity-img.png" className="w-12 h-12 object-cover absolute p-1 top-2 left-2" alt="product list image" width={64} height={64} />
                <Image src="/images/products/product-view-img3.jpeg" className="w-full max-w-[359px] sm:h-[340px] h-[452px] object-cover" alt="product list image" width={359} height={452} />
                </div>
            </div>
          </div>
          <div className="product-singlepage-right-cont max-w-[388px] w-full">
            <div className="product-info-header flex mb-6 items-center gap-3 justify-between">
              <div className="product-posted-user-info flex items-center gap-[13px]">
                <Image src="/images/products/userimg1.jpeg" className="w-8 h-8 rounded-full object-cover" alt="Whitney Moss" width={32} height={32} />
                <div className="posted-user-info">
                  <p className="posted-user-name eyebrow-medium text-black">
                    <span className='caption text-mono-90 block'>Donated by</span>
                    Whitney Moss
                  </p>
                </div>
              </div>
              <div className="product-states flex items-center gap-[14px]">
                <div className="product-favorite-btn cursor-pointer">
                  <FavoriteOutlineSecondaryIcon />
                </div>
                <div className="current-product-social-share-link cursor-pointer">
                  <ShearIcon />
                </div>
              </div>
            </div>
            <ul className="product-highlight-info mb-4 flex items-center sm:flex-wrap gap-2">
              <li key="condition" className="product-highlight-info-item product-condition caption py-[4px] px-2 rounded-[16px] bg-primary-color-70 text-primary-color-100">Used</li>
              <li key="shipping" className="product-highlight-info-item product-shipping-from caption py-[4px] px-2 rounded-[16px] bg-primary-color-70 text-primary-color-100">Shipping from London, UK</li>
              <li key="delivery" className="product-highlight-info-item product-delivery-type caption py-[4px] px-2 rounded-[16px] bg-primary-color-70 text-primary-color-100">5-7 business days</li>
            </ul>
            <h5 className="product-title h5 font-primary mb-[26px]">iPhone 13</h5>
            <div className="product-price-group flex items-end gap-2 mb-6 max-w-[306px] sm:max-w-[375px] w-full">
              <div className="product-price-box  max-w-[103px] w-full"> 
              <span className="label-text forms">Price</span>
              <p className="input-type-text body-bold-small py-[9.5px] px-2 w-full h-10 bg-[#f1f1f1]">£65.00</p>
            </div>
            <div className="product-price-item charity-profit-received  max-w-full w-full">
              <span className="label-text forms">Charity receives</span>
              <p className="input-type-text body-bold-small flex items-center py-[9.5px] px-2 w-full h-10 bg-[#f1f1f1]">£58.50<span className='text-mono-70 text-[11px]'> /90%</span></p>
            </div>
            </div>
            <div className="product-cta-box flex flex-col gap-4 mb-6 max-w-[306px] sm:max-w-[375px] w-full">
              <Button className='add-to-basket-btn' variant='primary' onClick={() => console.log('Added to basket')}>
                Add to basket
              </Button>
              <Button className='link-to-charity-storefront-btn !text-primary-color-100 !border-primary-color-100' variant='secondary' onClick={() => console.log('View charity storefront')}>
                View charity storefront
              </Button>
            </div>
            <div className="product-specification-box">
              <p className="body-small mb-3">Product Specifications</p>
              <ul className="product-specification-lists flex flex-col gap-3">
                <li key="spec-condition" className="specification-items flex items-center gap-2">
                  <span className="specification-title body-bold-small">Condition:</span> 
                  <span className="specification-info body-small">Used</span>
                </li>
                  <li key="spec-condition" className="specification-items flex items-center gap-2">
                  <span className="specification-title body-bold-small">Brand:</span> 
                  <span className="specification-info body-small">Apple</span>
                </li>
                  <li key="spec-condition" className="specification-items flex items-center gap-2">
                  <span className="specification-title body-bold-small">Material:</span> 
                  <span className="specification-info body-small">Metal</span>
                </li>
                  <li key="spec-condition" className="specification-items flex items-center gap-2">
                  <span className="specification-title body-bold-small">Colour:</span> 
                  <span className="specification-info body-small">Space Grey</span>
                </li>
                  <li key="spec-condition" className="specification-items flex items-center gap-2">
                  <span className="specification-title body-bold-small">Height:</span> 
                  <span className="specification-info body-small">13.76 cm</span>
                </li>
                  <li key="spec-condition" className="specification-items flex items-center gap-2">
                  <span className="specification-title body-bold-small">Width:</span> 
                  <span className="specification-info body-small">7,15 cm</span>
                </li>
                  <li key="spec-condition" className="specification-items flex flex-col items-center gap-2">
                  <span className="specification-title body-bold-small w-full">Additional info</span> 
                  <span className="specification-info body-small">Comes with 20mm charging cable and original packaging</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
     <RelatedCategoryProducts isLoggedIn={true} />
    </section>
  )
}

export default ProductSinglepage
