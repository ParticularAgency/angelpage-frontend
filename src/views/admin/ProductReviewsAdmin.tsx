'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Image from 'next/image';
import { Button } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';

interface PendingReview {
  _id: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
  user?: { firstName?: string; lastName?: string; email?: string };
  product?: {
    _id: string;
    name: string;
    price: number;
    images?: { url: string }[];
  };
}

const ProductReviewsAdmin = () => {
  const { data: session } = useSession() || {};
  const [reviews, setReviews] = useState<PendingReview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = useCallback(async () => {
    if (!session?.token) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products/admin/reviews/pending`,
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
      setReviews(res.data.reviews || []);
    } catch {
      ToastService.error('Failed to load pending reviews');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const moderate = async (reviewId: string, action: 'approve' | 'reject') => {
    if (!session?.token) return;
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/admin/reviews/${reviewId}`,
        { action },
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
      ToastService.success(
        action === 'approve' ? 'Review published' : 'Review rejected'
      );
      fetchPending();
    } catch {
      ToastService.error('Failed to moderate review');
    }
  };

  if (loading) {
    return <p className="body-small text-mono-70">Loading buyer reviews…</p>;
  }

  if (!reviews.length) {
    return (
      <p className="body-small text-mono-70">
        No buyer reviews awaiting moderation.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="body-small text-mono-70 mb-2">
        Approve honest buyer reviews to build product trust on the storefront.
        Verified purchase reviews are marked for buyers.
      </p>
      {reviews.map(review => {
        const imageUrl =
          review.product?.images?.[0]?.url ||
          '/images/products/card-placeholder-image.webp';
        const buyerName = review.user
          ? `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim()
          : 'Buyer';

        return (
          <div
            key={review._id}
            className="flex flex-col gap-3 p-4 border border-mono-20 rounded-xl"
          >
            <div className="flex gap-4">
              <Image
                src={imageUrl}
                alt={review.product?.name || 'Product'}
                width={72}
                height={72}
                className="rounded-lg object-cover w-[72px] h-[72px]"
              />
              <div className="flex-1">
                <h5 className="body-bold-small">{review.product?.name}</h5>
                <p className="body-small text-mono-70">
                  £{review.product?.price} · {buyerName}
                  {review.verifiedPurchase && (
                    <span className="ml-2 text-primary-color-100">
                      Verified purchase
                    </span>
                  )}
                </p>
                <p className="body-small mt-1">
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </p>
                <p className="body-small text-mono-90 mt-2">{review.comment}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => moderate(review._id, 'approve')}
              >
                Approve
              </Button>
              <Button
                variant="secondary"
                onClick={() => moderate(review._id, 'reject')}
              >
                Reject
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductReviewsAdmin;
