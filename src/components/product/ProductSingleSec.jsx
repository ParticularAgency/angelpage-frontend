'use client';
import React, { useState } from 'react';
import { FavoriteOutlineSecondaryIcon, ShearIcon } from '@/icons';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../elements';
import RelatedCategoryProducts from './RelatedProductCategory';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  // Autoplay,
  EffectFade,
  FreeMode,
  Navigation,
  Thumbs,
} from 'swiper/modules';
import ToastNotification, {
  ToastService,
} from '@/components/elements/notifications/ToastService';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';



const ProductSinglepage = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const handleAddToBasket = () => {
    console.log('Added to basket');
  };

  const handleViewCharityStorefront = () => {
    console.log('View charity storefront');
  };
  const handleShareProduct = () => {
    const productUrl = window.location.href; // Get the current page URL
    navigator.clipboard
      .writeText(productUrl)
      .then(() => {
        ToastService.success('Product link copied to clipboard!');
      })
      .catch(err => {
        ToastService.error('Failed to copy url: ', err);
      });
  };
  const [isFavorite, setIsFavorite] = useState(false);
  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    // if (onFavoriteClick) {
    //   onFavoriteClick();
    // }
  };
  return (
    <section className="product-singlepage-section">
      <div className="custom-container max-w-[960px] w-full">
        <div className="product-breadcrumb-area pt-4 pb-10 sm:pb-4">
          <ul className="breadcrumb-area flex items-center justify-center gap-[10px]">
            <li className="breadcrumb-item body-caption prev-pages flex items-center gap-[10px]">
              <Link className="body-caption text-mono-100" href="/">
                Home
              </Link>
              <span className="angle">{'>'}</span>
            </li>
            <li className="breadcrumb-item body-caption prev-pages flex items-center gap-[10px]">
              <Link className="body-caption text-mono-100" href="/electronics">
                Electronics
              </Link>
              <span className="angle">{'>'}</span>
            </li>
            <li className="breadcrumb-item body-caption current-page text-mono-70 flex items-center gap-[10px]">
              <span className="body-caption text-mono-70">iPhone 13</span>
            </li>
          </ul>
        </div>

        <div className="product-singlepage-cont-wrapper w-full max-w-[895px] flex items-start justify-between gap-[92px] lg:gap-14 md:gap-10 sm:gap-12 pb-[83px] sm:pb-12 sm:flex-col">
          <div className="product-singlepage-left-cont max-w-[415px] w-full">
            <div className="swiper-product-slider-area">
              <div className="swiper-slider-view w-full relative">
                <Swiper
                  spaceBetween={10}
                  effect="fade"
                  loop
                  // autoplay={{ delay: 6000, disableOnInteraction: false }}
                  thumbs={{
                    swiper:
                      thumbsSwiper && !thumbsSwiper.destroyed
                        ? thumbsSwiper
                        : null,
                  }}
                  modules={[EffectFade, FreeMode, Navigation, Thumbs]}
                  breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 1 },
                    1024: { slidesPerView: 1 },
                  }}
                  className="thumbs w-full rounded-lg"
                >
                  {[
                    'product-view-img1.jpeg',
                    'product-view-img2.jpeg',
                    'product-view-img3.jpeg',
                    'product-view-img4.jpeg',
                    'product-view-img5.jpeg',
                    'product-view-img1.jpeg',
                    'product-view-img2.jpeg',
                    'product-view-img3.jpeg',
                    'product-view-img4.jpeg',
                    'product-view-img5.jpeg',
                  ].map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="slide-view-item">
                        {/* <ReactImageMagnify
                          smallImage={{
                            alt: `Product thumbnail ${index + 1}`,
                            isFluidWidth: true,
                            src: `/images/products/${image}`,
                          }}
                          largeImage={{
                            src: `/images/products/${image}`,
                            width: 1200,
                            height: 1800,
                          }}
                          lensStyle={{ backgroundColor: 'rgba(0,0,0,.3)' }}
                          enlargedImageContainerDimensions={{
                            width: '100%',
                            height: '100%',
                          }}
                        /> */}
                        <Image
                          src={`/images/products/${image}`}
                          className="w-full max-w-full sm:h-[340px] h-[452px] object-cover"
                          alt={`Product list ${index + 1}`}
                          width={359}
                          height={452}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="swiper-product-slide-tab-item mt-2">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  loop={false}
                  spaceBetween={12}
                  slidesPerView={6}
                  freeMode
                  navigation
                  // autoplay={{ delay: 6000, disableOnInteraction: false }}
                  watchSlidesProgress
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="w-full rounded-lg"
                  breakpoints={{
                    640: { slidesPerView: 6, spaceBetween: 12 },
                    738: { slidesPerView: 6, spaceBetween: 12 },
                    1024: { slidesPerView: 6, spaceBetween: 12 },
                  }}
                >
                  {[
                    'product-view-img1.jpeg',
                    'product-view-img2.jpeg',
                    'product-view-img3.jpeg',
                    'product-view-img4.jpeg',
                    'product-view-img5.jpeg',
                    'product-view-img1.jpeg',
                    'product-view-img2.jpeg',
                    'product-view-img3.jpeg',
                    'product-view-img4.jpeg',
                    'product-view-img5.jpeg',
                  ].map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="slide-tab-item w-14 h-14">
                        <Image
                          src={`/images/products/${image}`}
                          className="w-14 h-14 object-cover cursor-pointer"
                          alt={`Product thumbnail ${index + 1}`}
                          width={48}
                          height={48}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>

          <div className="product-singlepage-right-cont max-w-[388px] w-full">
            <div className="product-info-header flex mb-6 items-center gap-3 justify-between">
              <div className="product-posted-user-info flex items-center gap-[13px]">
                <Image
                  src="/images/products/userimg1.jpeg"
                  className="w-8 h-8 rounded-full object-cover"
                  alt="Whitney Moss"
                  width={32}
                  height={32}
                />
                <div className="posted-user-info">
                  <p className="posted-user-name eyebrow-medium text-black">
                    <span className="caption text-mono-90 block">
                      Donated by
                    </span>
                    Whitney Moss
                  </p>
                </div>
              </div>
              <div className="product-states flex items-center gap-[14px]">
                <div
                  className="product-favorite-btn cursor-pointer"
                  onClick={handleFavoriteClick}
                >
                  <FavoriteOutlineSecondaryIcon
                    fillColor={isFavorite ? '#611192' : 'none'}
                  />
                </div>
                <div
                  className="current-product-social-share-link cursor-pointer"
                  onClick={handleShareProduct}
                >
                  <ShearIcon />
                </div>
              </div>
            </div>

            <ul className="product-highlight-info mb-4 flex items-center sm:flex-wrap gap-2">
              <li className="product-highlight-info-item product-condition caption py-[4px] px-2 rounded-[16px] bg-primary-color-70 text-primary-color-100">
                Used
              </li>
              <li className="product-highlight-info-item product-shipping-from caption py-[4px] px-2 rounded-[16px] bg-primary-color-70 text-primary-color-100">
                Shipping from London, UK
              </li>
              <li className="product-highlight-info-item product-delivery-type caption py-[4px] px-2 rounded-[16px] bg-primary-color-70 text-primary-color-100">
                5-7 business days
              </li>
            </ul>

            <h5 className="product-title h5 font-primary mb-[26px]">
              iPhone 13
            </h5>

            <div className="product-price-group flex items-end gap-2 mb-6 max-w-[306px] sm:max-w-[375px] w-full">
              <div className="product-price-box max-w-[103px] w-full">
                <span className="forms text-mono-100">Price</span>
                <p className="input-type-text body-bold-small py-[9.5px] px-2 w-full h-10 bg-[#f1f1f1]">
                  £65.00
                </p>
              </div>
              <div className="product-price-item charity-profit-received max-w-full w-full">
                <span className="forms text-mono-100">Charity receives</span>
                <p className="input-type-text body-bold-small flex items-center py-[9.5px] px-2 w-full h-10 bg-[#f1f1f1] text-[#6A0398]">
                  £58.50<span className="text-mono-70 text-[11px]"> /90%</span>
                </p>
              </div>
            </div>

            <div className="product-cta-box flex flex-col gap-4 mb-6 max-w-[306px] sm:max-w-[375px] w-full">
              <Button
                className="add-to-basket-btn"
                variant="primary"
                onClick={handleAddToBasket}
              >
                Add to basket
              </Button>
              <Link href="/charity/1" className='block w-full'> 
                <Button
                  className="link-to-charity-storefront-btn w-full !text-primary-color-100 !border-primary-color-100"
                  variant="secondary"
                  onClick={handleViewCharityStorefront}
                >
                  View charity storefront
                </Button>
              </Link>
            </div>

            <div className="product-specification-box">
              <p className="body-small mb-3">Product Specifications</p>
              <ul className="product-specification-lists flex flex-col gap-3">
                {[
                  { label: 'Condition', value: 'Used' },
                  { label: 'Brand', value: 'Apple' },
                  { label: 'Material', value: 'Metal' },
                  { label: 'Colour', value: 'Space Grey' },
                  { label: 'Height', value: '13.76 cm' },
                  { label: 'Width', value: '7.15 cm' },
                ].map((spec, index) => (
                  <li
                    key={index}
                    className="specification-items flex items-center gap-2"
                  >
                    <span className="specification-title body-bold-small empty:!hidden">
                      {spec.label}
                    </span>
                    <span className="specification-info body-small">
                      {spec.value}
                    </span>
                  </li>
                ))}
                <li className="specification-items mt-0">
                  <p className="caption text-mono-90">
                    Comes with 20mm charging cable and original packaging
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <ToastNotification />
      <RelatedCategoryProducts isLoggedIn={true} />
    </section>
  );
};

export default ProductSinglepage;
