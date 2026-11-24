'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Image from 'next/image';
import { Button } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';
import AdminSocialPostingPanel from '@/components/product/AdminSocialPostingPanel';
import type { SocialPostingPrefs } from '@/components/product/SocialPostingToggles';

interface LiveProduct {
  _id: string;
  name: string;
  price: number;
  isPromoted?: boolean;
  images?: { url: string }[];
  videos?: { url: string }[];
  socialPosting?: SocialPostingPrefs;
  charity?: { charityName?: string };
}

const PromotedListingsAdmin = () => {
  const { data: session } = useSession() || {};
  const [products, setProducts] = useState<LiveProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSocial, setExpandedSocial] = useState<string | null>(null);

  const fetchLive = useCallback(async () => {
    if (!session?.token) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products/all`,
        {
          params: { status: 'LIVE' },
          headers: { Authorization: `Bearer ${session.token}` },
        }
      );
      setProducts(res.data.products || []);
    } catch {
      ToastService.error('Failed to load live listings');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => {
    fetchLive();
  }, [fetchLive]);

  const togglePromoted = async (productId: string, isPromoted: boolean) => {
    if (!session?.token) return;
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/promoted`,
        { isPromoted },
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
      ToastService.success(
        isPromoted ? 'Listing promoted' : 'Promotion removed'
      );
      fetchLive();
    } catch {
      ToastService.error('Failed to update promoted status');
    }
  };

  if (loading) {
    return <p className="body-small text-mono-70">Loading listings…</p>;
  }

  if (!products.length) {
    return (
      <p className="body-small text-mono-70">No live listings to manage.</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="body-small text-mono-70">
        Promoted listings appear in the homepage carousel and marketplace
        highlights.
      </p>
      {products.map(product => (
        <div
          key={product._id}
          className="flex flex-col gap-3 border border-mono-40 rounded-lg p-4"
        >
          <div className="flex flex-wrap items-center gap-4">
          <Image
            src={product.images?.[0]?.url || '/placeholder.png'}
            alt={product.name}
            width={72}
            height={72}
            className="object-cover rounded-sm"
          />
          <div className="flex-1 min-w-[200px]">
            <p className="body-bold-small">{product.name}</p>
            <p className="caption text-mono-70">
              £{product.price?.toFixed(2)} ·{' '}
              {product.charity?.charityName || 'Charity'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() =>
              setExpandedSocial(
                expandedSocial === product._id ? null : product._id
              )
            }
          >
            Social channels
          </Button>
          <Button
            variant={product.isPromoted ? 'secondary' : 'primary'}
            onClick={() =>
              togglePromoted(product._id, !product.isPromoted)
            }
          >
            {product.isPromoted ? 'Remove promotion' : 'Promote'}
          </Button>
          </div>
          </div>
          {expandedSocial === product._id && session?.token && (
            <AdminSocialPostingPanel
              productId={product._id}
              token={session.token}
              initialPrefs={product.socialPosting}
              listingVideoUrl={product.videos?.[0]?.url || ''}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default PromotedListingsAdmin;
