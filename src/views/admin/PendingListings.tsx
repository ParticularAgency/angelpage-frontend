'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Image from 'next/image';
import { Button } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';
import AdminSocialPostingPanel from '@/components/product/AdminSocialPostingPanel';
import {
  defaultSocialPostingPrefs,
  type SocialPostingPrefs,
} from '@/components/product/SocialPostingToggles';

interface PendingProduct {
  _id: string;
  name: string;
  price: number;
  category: string;
  images?: { url: string }[];
  videos?: { url: string }[];
  socialPosting?: SocialPostingPrefs;
  seller?: { firstName?: string; lastName?: string; email?: string };
  charity?: { charityName?: string; email?: string };
  createdAt: string;
}

const PendingListings = () => {
  const { data: session } = useSession() || {};
  const [products, setProducts] = useState<PendingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [socialByProduct, setSocialByProduct] = useState<
    Record<string, SocialPostingPrefs>
  >({});

  const fetchPending = useCallback(async () => {
    if (!session?.token) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products/admin/pending-review`,
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
      const list: PendingProduct[] = res.data.products || [];
      setProducts(list);
      const socialMap: Record<string, SocialPostingPrefs> = {};
      list.forEach(p => {
        socialMap[p._id] = p.socialPosting || defaultSocialPostingPrefs();
      });
      setSocialByProduct(socialMap);
    } catch {
      ToastService.error('Failed to load pending listings');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const review = async (productId: string, action: 'approve' | 'reject') => {
    if (!session?.token) return;
    let reason = '';
    if (action === 'reject') {
      reason = window.prompt('Rejection reason (optional):') || '';
    }
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/review`,
        {
          action,
          reason,
          ...(action === 'approve' && {
            socialPosting: socialByProduct[productId] || defaultSocialPostingPrefs(),
          }),
        },
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
      ToastService.success(
        action === 'approve'
          ? 'Listing approved — social channels will post if configured'
          : 'Listing rejected'
      );
      fetchPending();
    } catch {
      ToastService.error('Review action failed');
    }
  };

  if (loading) {
    return <p className="body-small text-mono-70">Loading pending listings…</p>;
  }

  if (!products.length) {
    return (
      <p className="body-small text-mono-70">
        No listings awaiting review.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="body-small text-mono-70 mb-2">
        Review listings, choose social auto-post channels, then approve. Buyer
        reviews are moderated separately under Product Reviews.
      </p>
      {products.map(product => {
        const sellerLabel = product.seller
          ? `${product.seller.firstName || ''} ${product.seller.lastName || ''}`.trim()
          : product.charity?.charityName || 'Unknown seller';
        const imageUrl = product.images?.[0]?.url || '/placeholder.jpg';
        const videoUrl = product.videos?.[0]?.url || '';

        return (
          <div
            key={product._id}
            className="flex flex-col gap-4 p-4 border border-mono-20 rounded-xl"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <Image
                src={imageUrl}
                alt={product.name}
                width={96}
                height={96}
                className="rounded-lg object-cover w-24 h-24"
              />
              <div className="flex-1">
                <h5 className="body-bold-small">{product.name}</h5>
                <p className="body-small text-mono-70">
                  £{product.price} · {product.category}
                </p>
                <p className="body-small text-mono-70">Seller: {sellerLabel}</p>
              </div>
              <div className="flex gap-2 items-start">
                <Button
                  variant="primary"
                  onClick={() => review(product._id, 'approve')}
                >
                  Approve
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => review(product._id, 'reject')}
                >
                  Reject
                </Button>
              </div>
            </div>

            {session?.token && (
              <AdminSocialPostingPanel
                productId={product._id}
                token={session.token}
                initialPrefs={socialByProduct[product._id]}
                listingVideoUrl={videoUrl}
                deferSave
                onChange={prefs =>
                  setSocialByProduct(prev => ({ ...prev, [product._id]: prefs }))
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PendingListings;
