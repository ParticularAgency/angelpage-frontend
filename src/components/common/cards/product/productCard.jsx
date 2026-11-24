'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Checkmark } from '@/icons';
import { Button } from '@/components/elements';
import FavoriteButton from '@/components/elements/button/FavoriteButton';
import { ToastService } from '@/components/elements/notifications/ToastService';
import { useSelector, useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { addOrUpdateProduct, addGuestProduct } from '@/store/cartSlice';
import { openMiniCart } from '@/components/cart/openMiniCart';
import { useLazyGetProductDetailsQuery } from '@/store/api/angelpageApi';
import { calculateProfitSplit } from '@/lib/profitSplit';
import { useLocale } from '@/i18n/LocaleProvider';

const formatMoney = (amount, locale) =>
  new Intl.NumberFormat(locale === 'fr' ? 'fr-CA' : 'en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);

const fulfillmentKey = type => {
  if (type === 'personal_delivery') return 'card.personal';
  if (type === 'self_collect') return 'card.collect';
  if (type === 'local_only') return 'card.limited';
  return 'card.ships';
};

const ProductCard = ({
  id,
  slug,
  charityImageSrc = '/images/icons/elisp-profile-default-img.svg',
  charityImageAlt = 'Charity',
  images = [],
  brand = '',
  name = '',
  size = '',
  price = '',
  location = '',
  charityProfit,
  sellerSharePercent = 0,
  fulfillmentType = 'uk_shipping',
  sellAreas = [],
}) => {
  const dispatch = useDispatch();
  const { t, locale } = useLocale();
  const detailSlug = slug || id;
  const { data: session } = useSession() || {};
  const userId = session?.user?.id;
  const token = session?.token;
  const cartItems = useSelector(state => state.cart.items);
  const [fetchProductDetails] = useLazyGetProductDetailsQuery();
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const displayLocation = (location || '').trim();
  const showLocation =
    displayLocation.length > 0 &&
    !/^n\/a$/i.test(displayLocation) &&
    !/not available/i.test(displayLocation);

  useEffect(() => {
    const productInCart = cartItems.some(item => {
      const pid = item.productId?._id || item.productId;
      return String(pid) === String(id);
    });
    setIsAddedToCart(productInCart);
  }, [cartItems, id]);

  const handleAddToCart = async () => {
    if (!token) {
      try {
        const product = await fetchProductDetails(detailSlug).unwrap();
        dispatch(addGuestProduct({ product, quantity: 1 }));
        ToastService.success(t('card.addedToast'));
        setIsAddedToCart(true);
        openMiniCart();
      } catch {
        ToastService.error(t('card.failedToast'));
      }
      return;
    }

    try {
      await dispatch(
        addOrUpdateProduct({
          userId,
          productId: id,
          token,
        }),
      );
      ToastService.success(t('card.addedToast'));
      setIsAddedToCart(true);
      openMiniCart();
    } catch (error) {
      ToastService.error(t('card.failedToast'));
      console.error('Error adding product to cart:', error);
    }
  };

  const validatedImageSrc =
    images[0]?.url &&
    (images[0].url.startsWith('/') || images[0].url.startsWith('http'))
      ? images[0].url
      : '/images/products/card-placeholder-image.webp';

  const charitySrc =
    charityImageSrc &&
    (charityImageSrc.startsWith('/') || charityImageSrc.startsWith('http'))
      ? charityImageSrc
      : '/images/icons/elisp-profile-default-img.svg';

  const priceNum = parseFloat(String(price).replace(/[^\d.]/g, '')) || 0;
  const split =
    charityProfit != null
      ? {
          charityProfit: Number(charityProfit),
          sellerSharePercent,
        }
      : calculateProfitSplit(priceNum, sellerSharePercent);
  const charityAmount =
    charityProfit != null ? Number(charityProfit) : split.charityProfit;

  const areaLabel =
    fulfillmentType === 'local_only' && sellAreas?.length
      ? t('card.local', { areas: sellAreas.slice(0, 2).join(', ') })
      : t(fulfillmentKey(fulfillmentType));

  return (
    <article className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#E6E3E7] bg-white">
      <div className="relative aspect-[1/1] bg-[#FCF2FF]">
        <Link href={`/product/${detailSlug}`} className="absolute inset-0">
          <Image
            src={validatedImageSrc}
            alt={images[0]?.altText || name || 'Product'}
            fill
            sizes="(max-width: 768px) 50vw, 280px"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        </Link>
        <div className="absolute left-3 top-3 flex max-w-[75%] items-center gap-2 rounded-full bg-white/95 py-1 pr-3 pl-1">
          <Image
            src={charitySrc}
            alt={charityImageAlt}
            width={28}
            height={28}
            className="h-7 w-7 rounded-full object-cover"
          />
          <span className="truncate text-[11px] font-medium text-[#611192]">
            {charityImageAlt}
          </span>
        </div>
        <div className="absolute top-2 right-2 rounded-full bg-white/95">
          <FavoriteButton itemId={id} type="Product" />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pt-4 pb-4">
        <div className="flex items-start justify-between gap-3">
          <p className="line-clamp-1 text-[11px] font-medium tracking-[0.14em] text-[#6B686E] uppercase">
            {brand}
          </p>
          <p className="shrink-0 text-[18px] leading-none font-medium text-[#611192]">
            {priceNum > 0 ? formatMoney(priceNum, locale) : '—'}
          </p>
        </div>
        <Link href={`/product/${detailSlug}`} className="mt-2">
          <h3 className="line-clamp-2 min-h-11 font-primary text-[18px] leading-[1.25] text-[#0B0112]">
            {name}
          </h3>
        </Link>
        {size ? (
          <p className="mt-1 line-clamp-1 text-[12px] text-[#8A888C]">{size}</p>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#F2E8F8] px-2.5 py-1 text-[11px] font-medium text-[#611192]">
            {areaLabel}
          </span>
          {showLocation ? (
            <span className="line-clamp-1 text-[12px] text-[#6B686E]">
              {displayLocation}
            </span>
          ) : null}
        </div>

        {priceNum > 0 && (
          <p className="mt-3 text-[12px] leading-snug text-[#3B055C]">
            {t('card.toCharity', {
              amount: formatMoney(charityAmount, locale),
            })}
            {split.sellerSharePercent > 0
              ? ` · ${t('card.sellerKeeps', {
                  percent: split.sellerSharePercent,
                })}`
              : ''}
          </p>
        )}

        <div className="mt-auto pt-4">
          {isAddedToCart ? (
            <Button
              variant="primary"
              className="flex w-full items-center justify-center gap-2"
              disabled
            >
              <Checkmark /> {t('card.added')}
            </Button>
          ) : (
            <Button variant="primary" className="w-full" onClick={handleAddToCart}>
              {t('card.add')}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
