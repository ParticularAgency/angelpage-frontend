'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Checkmark } from '@/icons';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../elements';
import RelatedCategoryProducts from './RelatedProductCategory';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { ToastService } from '@/components/elements/notifications/ToastService';
import { useSelector, useDispatch } from 'react-redux';
import { addOrUpdateProduct, addGuestProduct } from '@/store/cartSlice';
import { openMiniCart } from '@/components/cart/openMiniCart';
import { addAffiliateProduct, hydrateAffiliateCart } from '@/store/affiliateCartSlice';
import { useSession } from 'next-auth/react';
import { useGetProductDetailsQuery } from '@/store/api/angelpageApi';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import PreLoader from '../common/pre-loader/PreLoader';
import FavoriteButton from '../elements/button/FavoriteButton';
import ShareProductButtons from './ShareProductButtons';
import ProductReviewsSection from './ProductReviewsSection';
import ProductFulfillmentBadge from '@/components/product/ProductFulfillmentBadge';
import { calculateProfitSplit, getFulfillmentSpecLabel } from '@/lib/profitSplit';
import { formatProductLocation } from '@/lib/productLocation';
import { formatMarketMoney } from '@/lib/marketPreference';
import { useLocale } from '@/i18n/LocaleProvider';
import MessageButton from '@/app/messaging/chat/startChat';
import { ChevronRight } from 'lucide-react';

const ProductSinglepage = ({ productSlug: productSlugProp, initialProduct } = {}) => {
  const dispatch = useDispatch();
  const { locale } = useLocale();
  const { data: session } = useSession() || {};
  const userId = session?.user?.id;
  const token = session?.token;
  const cartItems = useSelector(state => state.cart.items);
  const affiliateCartItems = useSelector(state => state.affiliateCart.items);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const params = useParams();

  const productSlug = productSlugProp || params?.slug;
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const {
    data: fetchedProduct,
    isLoading: loading,
    isError,
  } = useGetProductDetailsQuery(productSlug, {
    skip: !productSlug,
  });
  const product = fetchedProduct ?? initialProduct;
  const resolvedProductId = product?.id || product?._id;
  const error = isError ? 'Failed to load product details.' : null;

  useEffect(() => {
    dispatch(hydrateAffiliateCart());
  }, [dispatch]);

  useEffect(() => {
    if (!resolvedProductId) return;
    const productInCart = cartItems.some(item => {
      const id = item.productId?._id || item.productId;
      return String(id) === String(resolvedProductId);
    });
    const inAffiliateCart = affiliateCartItems.some(
      item => String(item.productId) === String(resolvedProductId),
    );
    setIsAddedToCart(productInCart || inAffiliateCart);
  }, [cartItems, affiliateCartItems, resolvedProductId]);

  const affiliateUrl = product?.affiliateUrl || product?.ebayAffiliateUrl;
  const isAffiliateCheckout =
    (product?.checkoutMode === 'ebay_redirect' ||
      product?.checkoutMode === 'affiliate_redirect') &&
    affiliateUrl;

  const handleAddToCart = async () => {
    if (isAffiliateCheckout) {
      dispatch(addAffiliateProduct({ product, affiliateUrl }));
      ToastService.success('Added to affiliate cart!');
      setIsAddedToCart(true);
      openMiniCart();
      return;
    }

    if (!token) {
      dispatch(addGuestProduct({ product, quantity: 1 }));
      ToastService.success('Product added to cart!');
      setIsAddedToCart(true);
      openMiniCart();
      return;
    }

    try {
      await dispatch(
        addOrUpdateProduct({
          userId,
          productId: resolvedProductId,
          token,
        })
      );
      ToastService.success('Product added to cart!');
      setIsAddedToCart(true);
      openMiniCart();
    } catch (error) {
      ToastService.error('Failed to add product to cart.');
      console.error('Error adding product to cart:', error);
    }
  };

  const isEbayCheckout =
    product?.checkoutMode === 'ebay_redirect' && product?.ebayAffiliateUrl;

  if (loading) {
    return <PreLoader />;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!product) {
    return <p className="text-gray-500">Product not found.</p>;
  }

  // Safely extract location
  const location = formatProductLocation(product.seller, product.charity);
  const showLocation = location.length > 0;

  const isOwnListing =
    userId &&
    product &&
    [product.seller?.id, product.seller?._id, product.charity?.id]
      .filter(Boolean)
      .some(id => String(id) === String(userId));

  const priceNum = Number(product.price) || 0;
  const sellerSharePct = product.sellerSharePercent ?? 0;
  const split = calculateProfitSplit(priceNum, sellerSharePct);
  const fulfillmentType = product.fulfillmentType || 'uk_shipping';
  const sellAreas = product.sellAreas || [];
  const images = Array.isArray(product.images)
    ? product.images.filter(image => image?.url)
    : [];
  const categoryHref = product.category
    ? `/product?category=${encodeURIComponent(String(product.category).toLowerCase())}`
    : '/product';
  const charityName =
    product.charity?.charityName ||
    product.selectedCharityName ||
    product.selectCharityName ||
    '';
  const money = amount => formatMarketMoney(Number(amount) || 0, locale);
  const specs = [
    ['Condition', product.condition],
    ['Brand', product.brand],
    ['Material', product.material],
    ['Colour', product.color],
    ['Size', product.size],
    ['Fulfillment', getFulfillmentSpecLabel(fulfillmentType, sellAreas)],
    ['Height', product.dimensions?.height],
    ['Width', product.dimensions?.width],
    ['Depth', product.dimensions?.depth],
  ].filter(([, value]) => {
    const text = String(value || '').trim();
    return text && text !== 'undefined' && text !== 'null' && !text.startsWith('Local:');
  });

  return (
    <section className="product-singlepage-section bg-[#FCF2FF] pb-16">
      <div className="custom-container w-full pt-6">
        <ul className="flex flex-wrap items-center gap-2 text-sm text-[#5C5560]">
          <li className="flex items-center gap-2">
            <Link className="hover:text-[#611192]" href="/">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </li>
          <li className="flex items-center gap-2">
            <Link className="capitalize hover:text-[#611192]" href={categoryHref}>
              {product.category || 'Shop'}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </li>
          <li className="max-w-[280px] truncate text-[#0B0112]">{product.name}</li>
        </ul>

        <div className="mt-6 grid grid-cols-12 items-start gap-8 pb-16 sm:grid-cols-1 sm:pb-10">
          <div className="col-span-7 sm:col-span-full">
            <div className="swiper-product-slider-area">
              <div className="swiper-slider-view w-full relative">
                <Swiper
                  spaceBetween={10}
                  effect="fade"
                  loop={images.length > 1}
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[EffectFade, FreeMode, Navigation, Thumbs]}
                  breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 1 },
                    1024: { slidesPerView: 1 },
                  }}
                  className="thumbs overflow-hidden rounded-3xl border border-[#E6E3E7] bg-white"
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="slide-view-item bg-[#FCF2FF]">
                        <Image
                          src={image.url}
                          className="aspect-square w-full object-cover"
                          alt={image.altText || 'Product Image'}
                          width={720}
                          height={720}
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
                  {images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="slide-tab-item h-16 w-16 overflow-hidden rounded-xl border border-[#E6E3E7]">
                        <Image
                          src={image.url}
                          className="h-16 w-16 cursor-pointer object-cover"
                          alt={image.altText || 'Product Image'}
                          width={64}
                          height={64}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>

          <div className="product-singlepage-right-cont col-span-5 rounded-3xl border border-[#E6E3E7] bg-white p-6 sm:col-span-full sm:p-5">
            <div className="product-info-header flex mb-6 items-center gap-3 justify-between">
              <div className="product-posted-user-info flex items-center gap-[13px]">
                {product.sellerType === 'USER' ? (
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
                        {`${product.seller?.charityName}`}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="product-states flex items-center gap-2">
                {!!session?.token && (
                  <MessageButton
                    sellerId={
                      product.seller?._id ||
                      product.seller?.id ||
                      product.charity?._id ||
                      product.charity?.id
                    }
                    sellerType={product.sellerType || 'USER'}
                    productId={product.id || product._id}
                    productName={product.name}
                  />
                )}

                <div className="product-favorite-btn cursor-pointer">
                  <FavoriteButton
                    itemId={String(resolvedProductId)}
                    type="Product"
                  />
                </div>
                <ShareProductButtons
                  product={{
                    productId: String(resolvedProductId || ''),
                    slug: product.slug || productSlug,
                    name: product.name,
                    price: Number(product.price) || 0,
                    charityProfit: Number(product.charityProfit) || 0,
                    sellerSharePercent: product.sellerSharePercent ?? 0,
                    charityName:
                      product.charity?.charityName ||
                      product.selectCharityName ||
                      product.selectedCharityName,
                    description:
                      product.additionalInfo || product.description || '',
                    condition: product.condition,
                    brand: product.brand,
                    material: product.material,
                    color: product.color,
                    size: product.size,
                    category: product.category,
                    imageUrl: product.images?.[0]?.url,
                  }}
                />
              </div>
            </div>

            <ul className="product-highlight-info mb-4 flex items-center flex-wrap gap-2">
              <li className="product-highlight-info-item product-condition caption py-[4px] px-2 rounded-[16px] bg-primary-color-70 text-primary-color-100">
                {product.condition}
              </li>
              {product.reviewSummary?.trustLabel && (
                <li className="product-highlight-info-item caption py-[4px] px-2 rounded-[16px] bg-[#FCF2FF] text-primary-color-100">
                  {product.reviewSummary.trustLabel}
                </li>
              )}
              {product.reviewSummary?.reviewCount > 0 && (
                <li className="product-highlight-info-item caption py-[4px] px-2 rounded-[16px] bg-primary-color-70 text-primary-color-100">
                  {product.reviewSummary.averageRating}★ ({product.reviewSummary.reviewCount})
                </li>
              )}
              {showLocation && (
              <li className="product-highlight-info-item product-shipping-from caption py-[4px] px-2 rounded-[16px] bg-primary-color-70 text-primary-color-100">
                {fulfillmentType === 'self_collect'
                  ? `Collect from ${location}`
                  : fulfillmentType === 'personal_delivery'
                    ? `Delivered around ${location}`
                    : `From ${location}`}
              </li>
              )}
              <li className="product-highlight-info-item caption py-[4px] px-2 rounded-[16px] bg-primary-color-70 text-primary-color-100">
                <ProductFulfillmentBadge
                  fulfillmentType={fulfillmentType}
                  sellAreas={sellAreas}
                  className="bg-transparent! px-0! py-0! text-inherit!"
                />
              </li>
              {fulfillmentType === 'uk_shipping' && (
                <li className="product-highlight-info-item product-delivery-type caption py-[4px] px-2 rounded-[16px] bg-primary-color-70 text-primary-color-100">
                  Est. 5–7 business days
                </li>
              )}
            </ul>

            <h1 className="product-title font-primary mb-3 text-[2.4rem] leading-none text-[#0B0112]">
              {product.name}
            </h1>
            <p className="font-primary text-[2rem] leading-none text-[#611192]">
              {money(priceNum)}
            </p>

            <div className="my-6 rounded-3xl bg-[#FCF2FF] p-4 text-sm">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#611192]">
                Where your money goes
              </p>
              {charityName && (
                <p className="mt-2 text-sm text-[#0B0112]">{charityName}</p>
              )}
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-[#5C5560]">
                  <span>Platform ({split.platformFeePercent}%)</span>
                  <span>{money(split.platformFee)}</span>
                </div>
                {split.sellerProfit > 0 && (
                  <div className="flex justify-between text-[#5C5560]">
                    <span>Seller ({split.sellerSharePercent}%)</span>
                    <span>{money(split.sellerProfit)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-[#E6E3E7] pt-2 font-medium text-[#611192]">
                  <span>Charity ({split.charitySharePercent}%)</span>
                  <span>{money(split.charityProfit)}</span>
                </div>
              </div>
            </div>

            <div className="product-cta-box mb-6 flex flex-col gap-3">
              {isOwnListing ? (
                <div className="rounded-lg border border-primary-color-100 bg-[#FCF2FF] px-4 py-3 text-center">
                  <p className="body-small text-primary-color-100 font-medium">
                    This is your listing
                  </p>
                  <p className="text-mono-70 text-xs mt-1">
                    You cannot purchase your own product.
                  </p>
                </div>
              ) : isAffiliateCheckout ? (
                <Button
                  className="add-to-basket-btn w-full"
                  variant="primary"
                  onClick={handleAddToCart}
                >
                  {isAddedToCart
                    ? 'In affiliate cart'
                    : isEbayCheckout
                      ? 'Add to cart — buy on eBay'
                      : 'Add to affiliate cart'}
                </Button>
              ) : (
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

              {product.charity?.storefrontId && (
                <Link
                  href={`/charity/store/${product.charity.storefrontId}`}
                  className="block w-full"
                >
                  <Button
                    className="link-to-charity-storefront-btn w-full rounded-full! border-[#611192]! text-[#611192]!"
                    variant="secondary"
                  >
                    View charity storefront
                  </Button>
                </Link>
              )}
            </div>

            {specs.length > 0 && (
              <div className="product-specification-box border-t border-[#E6E3E7] pt-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#611192]">
                  Details
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
                  {specs.map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-[11px] uppercase tracking-wide text-[#8B888C]">{label}</dt>
                      <dd className="text-sm capitalize text-[#0B0112]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {product.additionalInfo && (
              <p className="mt-5 text-sm leading-6 text-[#5C5560]">{product.additionalInfo}</p>
            )}
          </div>
        </div>
      </div>

      <RelatedCategoryProducts
        secClassName="bg-white pt-12 pb-8"
        category={product.category}
        currentProductId={resolvedProductId}
      />

      <div className="custom-container">
        <div className="rounded-3xl border border-[#E6E3E7] bg-white px-6 py-6 sm:px-4">
          <ProductReviewsSection
            productId={String(resolvedProductId || '')}
            initialSummary={product.reviewSummary}
          />
        </div>
      </div>
    </section>
  );
};

export default ProductSinglepage;
