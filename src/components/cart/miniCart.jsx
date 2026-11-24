'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCart,
  updateItemQuantity,
  removeItem,
  hydrateGuestCart,
  updateGuestItemQuantity,
  removeGuestItem,
} from '@/store/cartSlice';
import {
  hydrateAffiliateCart,
  removeAffiliateItem,
} from '@/store/affiliateCartSlice';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { CartIcon, MinusIcon, PlusIcon, CloseIcon } from '@/icons';
import Link from 'next/link';
import { Button } from '@/components/elements';
import { useLocale } from '@/i18n/LocaleProvider';
import { formatMarketMoney } from '@/lib/marketPreference';

const MiniCart = () => {
  const { data: session } = useSession() || {};
  const { t, locale } = useLocale();
  const userId = session?.user?.id;
  const token = session?.token;
  const isGuest = !userId;

  const dispatch = useDispatch();
  const {
    items: cartItems,
    totalItems,
    status,
  } = useSelector(state => state.cart);
  const affiliateItems = useSelector(state => state.affiliateCart.items);
  const affiliateCount = affiliateItems.length;
  const badgeCount = totalItems + affiliateCount;

  useEffect(() => {
    dispatch(hydrateAffiliateCart());
    if (userId && token) {
      dispatch(fetchCart({ userId, token }));
    } else {
      dispatch(hydrateGuestCart());
    }
  }, [userId, token, dispatch]);

  const handleUpdateQuantity = (productId, quantityChange) => {
    if (isGuest) {
      dispatch(updateGuestItemQuantity({ productId, quantityChange }));
      return;
    }
    dispatch(updateItemQuantity({ userId, productId, quantityChange, token }));
  };

  const handleRemoveItem = productId => {
    if (isGuest) {
      dispatch(removeGuestItem(productId));
      return;
    }
    dispatch(removeItem({ userId, productId, token }));
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    const price = item?.productId?.price || 0;
    const quantity = item?.quantity || 0;
    return acc + price * quantity;
  }, 0);
  const money = amount => formatMarketMoney(amount, locale);

  return (
    <div className="cart-box flex items-center">
      <div className="mini-cart-offcanvas">
        <div className="drawer drawer-end">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="my-drawer-4"
              className="drawer-button top-[-2px] relative btn bg-transparent! p-0! border-none!"
            >
              {status === 'loading' && !isGuest ? (
                <span className="absolute top-px right-[-10px] flex h-5 w-5 items-center justify-center rounded-full bg-[#611192] p-1 text-[11px] text-white sm:right-[-8px]">
                  ...
                </span>
              ) : badgeCount > 0 ? (
                <span className="absolute top-px right-[-9px] flex h-5 w-5 items-center justify-center rounded-full bg-[#611192] p-1 text-[11px] text-white sm:right-[-8px]">
                  {badgeCount}
                </span>
              ) : null}
              <CartIcon />
            </label>
          </div>
          <div className="drawer-side z-[10040]">
            <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
            <div className="flex h-full min-h-full w-full max-w-[420px] flex-col bg-white p-0 text-[#0B0112]">
              <div className="flex items-center justify-between border-b border-[#E6E3E7] px-6 py-5">
                <div>
                  <p className="font-primary text-[26px] leading-none">
                    {t('cart.title')}
                  </p>
                  {badgeCount > 0 ? (
                    <p className="mt-1 text-[12px] text-[#6B686E]">
                      {badgeCount}
                    </p>
                  ) : null}
                </div>
                <label
                  htmlFor="my-drawer-4"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#F2E8F8]"
                >
                  <CloseIcon />
                </label>
              </div>

              <div className="flex-1 overflow-y-auto px-6">
                {cartItems.length === 0 && affiliateItems.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="text-[15px] text-[#6B686E]">{t('cart.empty')}</p>
                    <Link
                      href="/product"
                      className="mt-4 inline-block text-[14px] font-semibold text-[#611192]"
                    >
                      {t('cart.browse')}
                    </Link>
                  </div>
                ) : (
                  <>
                    {cartItems.map(item => {
                      const productId = item?.productId?._id || item?.productId;
                      const charityName =
                        item?.productId?.selectedCharityName ||
                        item?.productId?.charity?.charityName;
                      return (
                        <div
                          key={productId}
                          className="flex items-start gap-4 border-b border-[#F2E8F8] py-5"
                        >
                          <Image
                            src={
                              item?.productId?.images?.[0]?.url ||
                              '/images/products/card-placeholder-image.webp'
                            }
                            width={88}
                            height={88}
                            alt={item?.productId?.name || 'Product'}
                            className="h-[88px] w-[88px] rounded-2xl bg-[#FCF2FF] object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-medium tracking-[0.12em] text-[#6B686E] uppercase">
                              {item?.productId?.brand}
                            </p>
                            <p className="mt-1 line-clamp-2 text-[15px] leading-snug">
                              {item?.productId?.name}
                            </p>
                            {charityName ? (
                              <p className="mt-1 text-[12px] text-[#611192]">
                                {t('cart.charity')}: {charityName}
                              </p>
                            ) : null}
                            <div className="mt-3 flex items-center justify-between gap-2">
                              <div className="flex h-8 items-center gap-2 rounded-full border border-[#E6E3E7] px-2">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(productId, -1)}
                                  disabled={item.quantity <= 1}
                                  className="flex h-6 w-6 items-center justify-center"
                                >
                                  <MinusIcon />
                                </button>
                                <span className="min-w-4 text-center text-[13px]">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(productId, 1)}
                                  className="flex h-6 w-6 items-center justify-center"
                                >
                                  <PlusIcon />
                                </button>
                              </div>
                              <p className="text-[14px] font-semibold text-[#611192]">
                                {money((item.quantity || 0) * (item.productId?.price || 0))}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(productId)}
                              className="mt-2 text-[12px] text-[#6B686E] underline"
                            >
                              {t('cart.remove')}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {affiliateItems.length > 0 && (
                      <div className="mt-2 border-t border-[#E6E3E7] pt-5">
                        <p className="text-[14px] font-semibold">{t('cart.affiliate')}</p>
                        <p className="mt-1 text-[12px] text-[#6B686E]">
                          {t('cart.affiliateNote')}
                        </p>
                        {affiliateItems.map(item => (
                          <div
                            key={item.productId}
                            className="flex items-start gap-4 py-4"
                          >
                            {item.image && (
                              <img
                                src={item.image}
                                alt=""
                                className="h-[72px] w-[72px] rounded-2xl object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <p className="text-[14px]">{item.name}</p>
                              <p className="mt-1 text-[13px] font-semibold text-[#611192]">
                                {money(item.price || 0)}
                              </p>
                              <button
                                type="button"
                                className="mt-2 text-[12px] underline"
                                onClick={() =>
                                  dispatch(removeAffiliateItem(item.productId))
                                }
                              >
                                {t('cart.remove')}
                              </button>
                            </div>
                          </div>
                        ))}
                        <Link href="/checkout/affiliate" className="mt-2 block">
                          <Button variant="secondary" className="h-11! w-full rounded-full">
                            {t('cart.affiliateCheckout')}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="mt-auto border-t border-[#E6E3E7] bg-[#FCF2FF] px-6 py-5">
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-semibold">{t('cart.total')}</p>
                  <p className="font-primary text-[22px] text-[#611192]">
                    {status === 'loading' && !isGuest ? '…' : money(totalPrice)}
                  </p>
                </div>
                <p className="mt-1 text-[12px] text-[#6B686E]">{t('cart.taxNote')}</p>
                <Link href="/checkout" className="mt-4 block">
                  <Button
                    variant="primary"
                    className="h-12! w-full rounded-full"
                    disabled={cartItems.length === 0}
                  >
                    {t('cart.checkout')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniCart;
