'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Checkmark, ShearIcon } from '@/icons';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../elements';
import RelatedCategoryProducts from './RelatedProductCategory';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { ToastService } from '@/components/elements/notifications/ToastService';

import { useSelector, useDispatch } from 'react-redux';
import { addOrUpdateProduct } from '@/store/cartSlice';
import { useSession } from 'next-auth/react';

import axios from 'axios';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/swiper-bundle.css';

import PreLoader from '../common/pre-loader/PreLoader';
import countries from 'i18n-iso-countries';
import FavoriteButton from '../elements/button/FavoriteButton';
import enLocale from 'i18n-iso-countries/langs/en.json';
// import type { Swiper as SwiperInstance } from 'swiper';

countries.registerLocale(enLocale);

const ProductSinglepage = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession() || {};
  const userId = session?.user?.id;
  const token = session?.token;
  const cartItems = useSelector(state => state.cart.items);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const params = useParams();

  // Safely parse product ID
  const productid = params?.productid;
  const [product, setProduct] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Sync local state with Redux store on mount and when cartItems change
  useEffect(() => {
    const productInCart = cartItems.some(item => item.productId === productid);
    setIsAddedToCart(productInCart);
  }, [cartItems, productid]);

  useEffect(() => {
    if (!productid) return;

    const fetchProductDetails = async () => {
      try {
        setLoading(true);

        const headers = {};
        if (session?.token) {
          headers.Authorization = `Bearer ${session.token}`;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/details/${productid}`,
          {
            params: { isArchived: false },
            headers,
          }
        );

        setProduct(response.data.product);
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productid, session]);

  const handleAddToCart = async () => {
    if (!token) {
      ToastService.error('Please log in to add products to your cart.');
      return;
    }

    try {
      // Dispatch Redux action to add or update product in the cart
      await dispatch(
        addOrUpdateProduct({
          userId,
          productId: productid,
          token,
        })
      );
      ToastService.success('Product added to cart!');
      setIsAddedToCart(true);
    } catch (error) {
      ToastService.error('Failed to add product to cart.');
      console.error('Error adding product to cart:', error);
    }
  };

  const handleShareProduct = () => {
    const productUrl = window.location.href;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(productUrl)
        .then(() => {
          ToastService.success('Product link copied to clipboard!');
        })
        .catch(() => {
          ToastService.error('Failed to copy URL.');
        });
    } else {
      // Fallback: use an input element to copy text
      const tempInput = document.createElement('input');
      tempInput.value = productUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      try {
        document.execCommand('copy');
        ToastService.success('Product link copied to clipboard!');
      } catch (err) {
        ToastService.error('Failed to copy URL.');
      }
      document.body.removeChild(tempInput);
    }
  };

  if (loading) {
    return <PreLoader />;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!product) {
    return <p className="text-gray-500">Product not found.</p>;
  }

  const sellerAddress = product.seller?.addresses;
  const countryCode = sellerAddress?.country
    ? countries.getAlpha2Code(sellerAddresses.country, 'en') || 'N/A'
    : 'N/A';

  const location = sellerAddress
    ? `${sellerAddress.city || 'Unknown City'}, ${countryCode}`
    : 'Location Not Available';

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
              <Link
                className="body-caption text-mono-100"
                href={`/category/${product.category}`}
              >
                {product.category}
              </Link>
              <span className="angle">{'>'}</span>
            </li>
            <li className="breadcrumb-item body-caption current-page text-mono-70 flex items-center gap-[10px]">
              <span className="body-caption text-mono-70">{product.name}</span>
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
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[EffectFade, FreeMode, Navigation, Thumbs]}
                  breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 1 },
                    1024: { slidesPerView: 1 },
                  }}
                  className="thumbs w-full rounded-lg"
                >
                  {product.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="slide-view-item">
                        <Image
                          src={image.url}
                          className="w-full max-w-full sm:h-[340px] h-[452px] object-cover"
                          alt={image.altText || 'Product Image'}
                          width={359}
                          height={452}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="selected-charity-image"></div>
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
                  {product.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="slide-tab-item w-14 h-14">
                        <Image
                          src={image.url}
                          className="w-14 h-14 object-cover cursor-pointer"
                          alt={image.altText || 'Product Image'}
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
                {product.seller?.profileImage ||
                product.seller?.firstName ||
                product.seller?.lastName ? (
                  <>
                    <div className="seller-peofile-image w-8 h-8 rounded-full">
                      <Image
                        src={product.seller?.profileImage || '/placeholder.jpg'}
                        className="w-8 h-8 rounded-full object-cover"
                        alt={`${product.seller?.firstName} ${product.seller?.lastName}`}
                        width={480}
                        height={320}
                      />
                    </div>
                    <div className="posted-user-info">
                      <p className="posted-user-name eyebrow-medium text-black">
                        <span className="caption text-mono-90 block">
                          Donated by
                        </span>
                        {`${product.seller?.firstName} ${product.seller?.lastName}`}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="posted-user-info">
                      <p className="posted-user-name eyebrow-medium text-black">
                        <span className="caption text-mono-90 block">
                          Sold by
                        </span>
                        {`${product.charity?.charityName}`}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="product-states flex items-center gap-[14px]">
                <div className="product-favorite-btn cursor-pointer">
                  <FavoriteButton
                    itemId={product.id.toString()}
                    type="Product"
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

            <ul className="product-highlight-info mb-4 flex items-center flex-wrap gap-2">
              <li className="product-highlight-info-item product-condition caption py-[4px] px-2 rounded-[16px] bg-primary-color-70 text-primary-color-100">
                {product.condition}
              </li>
              <li className="product-highlight-info-item product-shipping-from caption py-[4px] px-2 rounded-[16px] bg-primary-color-70 text-primary-color-100">
                Shipping from {location}
              </li>
              <li className="product-highlight-info-item product-delivery-type caption py-[4px] px-2 rounded-[16px] bg-primary-color-70 text-primary-color-100">
                5-7 business days
              </li>
            </ul>

            <h5 className="product-title h5 font-primary mb-[26px]">
              {product.name}
            </h5>

            <div className="product-price-group flex items-end gap-2 mb-6 max-w-[306px] sm:max-w-[375px] w-full">
              <div className="product-price-box max-w-[103px] w-full">
                <span className="forms text-mono-100">Price</span>
                <p className="input-type-text body-bold-small py-[9.5px] px-2 w-full h-10 bg-[#f1f1f1]">
                  £{product.price}
                </p>
              </div>
              <div className="product-price-item charity-profit-received max-w-full w-full">
                <span className="forms text-mono-100">Charity receives</span>
                <p className="input-type-text body-bold-small flex items-center py-[9.5px] px-2 w-full h-10 bg-[#f1f1f1] text-[#6A0398]">
                  £{product.charityProfit}
                  <span className="text-mono-70 text-[11px]"> /90%</span>
                </p>
              </div>
            </div>

            <div className="product-cta-box flex flex-col gap-4 mb-6 max-w-[306px] sm:max-w-[375px] w-full">
              {!!session?.token && (
                <div className="product-card-btn-states">
                  {isAddedToCart ? (
                    <Button
                      variant="primary"
                      className="add-to-basket-btn  w-full"
                      disabled
                    >
                      <Checkmark /> Added
                    </Button>
                  ) : (
                    <Button
                      className="add-to-basket-btn w-full"
                      variant="primary"
                      onClick={handleAddToCart}
                    >
                      Add to basket
                    </Button>
                  )}
                </div>
              )}

              <Link
                href={`/charity/store/${product.charity?.storefrontId}`}
                className="block w-full"
              >
                <Button
                  className="link-to-charity-storefront-btn w-full !text-primary-color-100 !border-primary-color-100"
                  variant="secondary"
                >
                  View charity storefront
                </Button>
              </Link>
            </div>

            <div className="product-specification-box">
              <p className="body-small mb-3">Product Specifications</p>
              <ul className="product-specification-lists flex flex-col gap-3">
                {[
                  { label: 'Condition', value: `${product.condition}` },
                  { label: 'Brand', value: `${product?.brand}` },
                  { label: 'Material', value: `${product.material}` },
                  { label: 'Colour', value: `${product.color}` },
                  { label: 'Size', value: `${product.size}` },
                  {
                    label: 'Height',
                    value: `${product.dimensions?.height || ''}`,
                  },
                  {
                    label: 'Width',
                    value: `${product.dimensions?.width || ''}`,
                  },
                ]
                  .filter(spec => spec.value)
                  .map((spec, index) => (
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
                    {product.additionalInfo}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <RelatedCategoryProducts
        secClassName="bg-[#f1f1f7] pt-[35px] pb-5"
        category={product.category}
        currentProductId={product.id}
      />
    </section>
  );
};

export default ProductSinglepage;
