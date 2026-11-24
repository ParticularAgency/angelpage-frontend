'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/elements';
import {
  hydrateAffiliateCart,
  removeAffiliateItem,
  clearAffiliateCart,
} from '@/store/affiliateCartSlice';

const AffiliateCheckoutPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: { affiliateCart: { items: Array<{
    productId: string;
    name: string;
    price: number;
    image?: string;
    affiliateUrl: string;
  }> } }) => state.affiliateCart);

  useEffect(() => {
    dispatch(hydrateAffiliateCart());
  }, [dispatch]);

  const openAllPartners = () => {
    items.forEach((item, index) => {
      setTimeout(() => {
        window.open(item.affiliateUrl, '_blank', 'noopener,noreferrer');
      }, index * 400);
    });
  };

  return (
    <div className="custom-container py-12 max-w-2xl">
      <Link href="/product" className="body-small text-primary-color-100 underline">
        ← Continue shopping
      </Link>
      <h1 className="h4 mt-4 mb-2">Affiliate checkout</h1>
      <p className="body-small text-mono-70 mb-8">
        These items are sold on partner sites. Angelpage will open each store so you can
        complete purchase there. Tracking parameters are included where configured.
      </p>

      {items.length === 0 ? (
        <p className="body-small text-mono-70">Your affiliate cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4 mb-8">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex gap-4 items-start border border-mono-40 rounded-xl p-4"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt=""
                    className="w-16 h-16 object-cover rounded-sm"
                  />
                )}
                <div className="flex-1">
                  <p className="body-small font-medium">{item.name}</p>
                  <p className="caption text-mono-70">£{item.price?.toFixed(2)}</p>
                  <a
                    href={item.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="caption text-primary-color-100 underline"
                  >
                    Buy on partner site
                  </a>
                </div>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => dispatch(removeAffiliateItem(item.productId))}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" type="button" onClick={openAllPartners}>
              Open all partner checkouts
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => dispatch(clearAffiliateCart())}
            >
              Clear cart
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AffiliateCheckoutPage;
