'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button, Input } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';

interface ReviewSummary {
  averageRating: number;
  reviewCount: number;
  verifiedCount: number;
  trustLabel: string | null;
}

interface ProductReview {
  id: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
  user: { firstName: string; lastName: string };
}

interface ProductReviewsSectionProps {
  productId: string;
  initialSummary?: ReviewSummary;
}

const ProductReviewsSection = ({
  productId,
  initialSummary,
}: ProductReviewsSectionProps) => {
  const { data: session } = useSession() || {};
  const [summary, setSummary] = useState<ReviewSummary>(
    initialSummary || {
      averageRating: 0,
      reviewCount: 0,
      verifiedCount: 0,
      trustLabel: null,
    }
  );
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [verifiedPurchase, setVerifiedPurchase] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/reviews`
      );
      setSummary(res.data.summary || summary);
      setReviews(res.data.reviews || []);
    } catch {
      /* keep defaults */
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const fetchEligibility = useCallback(async () => {
    if (!session?.token) {
      setCanReview(false);
      return;
    }
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/reviews/eligibility`,
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
      setCanReview(!!res.data.canReview);
      setVerifiedPurchase(!!res.data.verifiedPurchase);
    } catch {
      setCanReview(false);
    }
  }, [productId, session?.token]);

  useEffect(() => {
    fetchReviews();
    fetchEligibility();
  }, [fetchReviews, fetchEligibility]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.token) {
      ToastService.error('Please log in to leave a review');
      return;
    }
    try {
      setSubmitting(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
      ToastService.success(
        'Review submitted — it will appear after admin approval'
      );
      setComment('');
      setCanReview(false);
      fetchReviews();
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : 'Failed to submit review';
      ToastService.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="product-reviews-section mt-10 pt-8 border-t border-mono-40">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h4 className="h5 font-primary">Buyer reviews</h4>
        {summary.trustLabel && (
          <span className="caption px-3 py-1 rounded-full bg-[#FCF2FF] text-primary-color-100">
            {summary.trustLabel}
          </span>
        )}
      </div>

      {summary.reviewCount > 0 ? (
        <p className="body-small text-mono-70 mb-4">
          {summary.averageRating.toFixed(1)} / 5 · {summary.reviewCount} review
          {summary.reviewCount !== 1 ? 's' : ''}
          {summary.verifiedCount > 0 &&
            ` · ${summary.verifiedCount} verified purchase`}
        </p>
      ) : (
        <p className="body-small text-mono-70 mb-4">
          No published reviews yet. Be the first to share your experience.
        </p>
      )}

      {canReview && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 rounded-xl border border-mono-40 bg-[#FAFAFC]"
        >
          <p className="body-small font-medium mb-2">Write a review</p>
          {verifiedPurchase && (
            <p className="text-[11px] text-primary-color-100 mb-2">
              Verified purchase — your review helps other buyers trust this
              listing.
            </p>
          )}
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                className={`text-xl ${star <= rating ? 'text-primary-color-100' : 'text-mono-40'}`}
                onClick={() => setRating(star)}
                aria-label={`${star} stars`}
              >
                ★
              </button>
            ))}
          </div>
          <Input
            label="Your experience"
            placeholder="Describe item condition, shipping, and seller communication…"
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="flex-col mb-3"
          />
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit review'}
          </Button>
        </form>
      )}

      {!session?.token && (
        <p className="body-small text-mono-70 mb-4">
          <a href="/auth/login" className="text-primary-color-100 underline">
            Log in
          </a>{' '}
          to leave a review after purchase.
        </p>
      )}

      {loading ? (
        <p className="body-small text-mono-70">Loading reviews…</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {reviews.map(review => (
            <li
              key={review.id}
              className="p-4 rounded-xl border border-mono-20 bg-white"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="body-bold-small">
                  {review.user.firstName} {review.user.lastName}
                </span>
                {review.verifiedPurchase && (
                  <span className="text-[10px] uppercase text-primary-color-100">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-primary-color-100 mb-2">
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </p>
              <p className="body-small text-mono-90">{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ProductReviewsSection;
