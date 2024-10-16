import React from 'react'
import { Button } from '../elements'
import Image from 'next/image'

const OurPlatformSection = () => {
  return (
    <section className='our-platform-section bg-[#f1f1f8] py-20 md:py-16'>
      <div className="custom-container">
        <div className="our-platform-wrapper grid grid-cols-12 gap-6 sm:gap-8 sm:grid-cols-6">
            <div className="our-platform-left-cont col-span-4 sm:col-span-full">
                <h2 className="our-platform-sec-title h2 mb-4">Our Platform</h2>
                <p className="body-regular mb-[38px]">Explore our platform and discover how you can make a difference:</p>
                <Button variant='primary' >Become a donor</Button>
            </div>
            <div className="our-platform-highlight-category-cont grid grid-cols-12 gap-5 md:gap-4 sm:gap-3 sm:grid-cols-6 col-span-8 sm:col-span-full ml-[31px] laptop-x:ml-0">
               <div className="category-overly-card-item overflow-hidden relative col-span-6 sm:col-span-full">
                  <div className="img-modal-box h-[240px] w-full max-w-[390px]">
                    <Image src="/images/home/category/category-card-img1.png" className='h-full w-full' alt='highlight category overly image' width={390} height={240} />
                  </div>
                  <div className="category-card-info-box z-50  absolute p-4 bottom-0 left-0 w-full h-full flex flex-col justify-end items-start">
                      <p className="highlight-category-title body-small text-mono-0">Clothing and Accessories </p>
                      <p className="highlight-category-desc mt-1 body-small text-mono-0">Find and sell pre-loved fashion items, supporting sustainable practices and charitable causes.</p>
                  </div>
               </div>
               <div className="category-overly-card-item overflow-hidden relative col-span-6 sm:col-span-full">
                  <div className="img-modal-box h-[240px] w-full max-w-[390px]">
                    <Image src="/images/home/category/category-card-img2.png" className='h-full w-full' alt='highlight category overly image' width={390} height={240} />
                  </div>
                  <div className="category-card-info-box z-50  absolute p-4 bottom-0 left-0 w-full h-full flex flex-col justify-end items-start">
                      <p className="highlight-category-title body-small text-mono-0">Electronics</p>
                      <p className="highlight-category-desc mt-1 body-small text-mono-0">Buy and sell gadgets, ensuring they find a new home while benefiting a charity.</p>
                  </div>
               </div>
               <div className="category-overly-card-item overflow-hidden relative col-span-6 sm:col-span-full">
                  <div className="img-modal-box h-[240px] w-full max-w-[390px]">
                    <Image src="/images/home/category/category-card-img3.png" className='h-full w-full' alt='highlight category overly image' width={390} height={240} />
                  </div>
                  <div className="category-card-info-box z-50  absolute p-4 bottom-0 left-0 w-full h-full flex flex-col justify-end items-start">
                      <p className="highlight-category-title body-small text-mono-0">Homeware</p>
                      <p className="highlight-category-desc mt-1 body-small text-mono-0">Give your furniture and home goods a second life and support local communities.</p>
                  </div>
               </div>
               <div className="category-overly-card-item overflow-hidden relative col-span-6 sm:col-span-full">
                  <div className="img-modal-box h-[240px] w-full max-w-[390px]">
                    <Image src="/images/home/category/category-card-img4.png" className='h-full w-full' alt='highlight category overly image' width={390} height={240} />
                  </div>
                  <div className="category-card-info-box z-50  absolute p-4 bottom-0 left-0 w-full h-full flex flex-col justify-end items-start">
                      <p className="highlight-category-title body-small text-mono-0">Excess Stock</p>
                      <p className="highlight-category-desc mt-1 body-small text-mono-0">Businesses can sell excess stock, fulfilling their CSR commitments without out-of-pocket donations.</p>
                  </div>
               </div>
            </div>
        </div>
      </div>
    </section>
  )
}

export default OurPlatformSection
