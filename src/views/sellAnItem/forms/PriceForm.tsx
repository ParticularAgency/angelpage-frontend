'use client';
import { Button, Input } from '@/components/elements';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ToastService } from '@/components/elements/notifications/ToastService';
import SocialPostingToggles, {
  type SocialPostingPrefs,
} from '@/components/product/SocialPostingToggles';
import {
  calculateProfitSplit,
  PLATFORM_FEE_PERCENT,
} from '@/lib/profitSplit';
import { formatMarketMoney } from '@/lib/marketPreference';
import { useLocale } from '@/i18n/LocaleProvider';

interface FormProps {
  setActiveTab: (tabName: 'details' | 'photos' | 'price') => void;
  onSubmit: (detailsData: PriceData) => void;
  onFinish: () => void;
  onBack: () => void;
  onSaveAsDraft: () => void;
  formData?: {
    price: string;
    charityProfit: string;
    sellerSharePercent?: number;
  };
  isSubmitting: boolean;
  socialPosting?: SocialPostingPrefs;
  onSocialPostingChange?: (prefs: SocialPostingPrefs) => void;
  listingVideoUrl?: string;
  isEditMode?: boolean;
}

interface PriceData {
  price: string;
  charityProfit: string;
  sellerSharePercent: number;
  sellerProfit: string;
}

const SHARE_PRESETS = [
  { label: '100% to charity', value: 0 },
  { label: '70% charity / 30% you', value: 30 },
  { label: '50 / 50', value: 50 },
  { label: 'You keep all (after platform fee)', value: 100 },
];

const PriceForm: React.FC<FormProps> = ({
  onSubmit,
  onFinish,
  onBack,
  onSaveAsDraft,
  formData = { price: '', charityProfit: '', sellerSharePercent: 0 },
  isSubmitting,
  socialPosting,
  onSocialPostingChange,
  listingVideoUrl = '',
  isEditMode = false,
}) => {
  const { locale } = useLocale();
  const money = (amount: number) => formatMarketMoney(amount, locale);
  const [price, setPrice] = useState<string>(formData.price || '');
  const [sellerSharePercent, setSellerSharePercent] = useState<number>(
    formData.sellerSharePercent ?? 0,
  );
  const [error, setError] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const priceRef = useRef(price);
  const shareRef = useRef(sellerSharePercent);

  const numericPrice = useMemo(() => {
    const n = parseFloat(price.replace(/[^\d.]/g, ''));
    return !isNaN(n) && n > 0 ? n : 0;
  }, [price]);

  const split = useMemo(
    () => calculateProfitSplit(numericPrice, sellerSharePercent),
    [numericPrice, sellerSharePercent],
  );

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputPrice = e.target.value;
    if (!inputPrice.startsWith('$')) {
      inputPrice = '$' + inputPrice.replace(/[$£]/g, '');
    }
    const numericValue = inputPrice.slice(1);
    if (/^\d*\.?\d*$/.test(numericValue) || numericValue === '') {
      const newPrice = '$' + numericValue;
      setPrice(newPrice);
      priceRef.current = newPrice;
      setError('');
    } else {
      setError('Invalid price format.');
    }
  };

  const handleShareChange = (pct: number) => {
    setSellerSharePercent(pct);
    shareRef.current = pct;
  };

  const handleSubmit = () => {
    if (!termsAccepted) {
      ToastService.error(
        'You must agree to the seller terms and no-clearance goods policy.',
      );
      return;
    }

    const finalPrice = priceRef.current;
    const numeric = parseFloat(finalPrice.replace(/[^\d.]/g, ''));

    if (finalPrice.trim() === '' || finalPrice === '$') {
      ToastService.error('Price is required.');
      return;
    }
    if (numeric < 1) {
      ToastService.error('Price must be at least $1.');
      return;
    }

    const finalSplit = calculateProfitSplit(numeric, shareRef.current);
    onSubmit({
      price: finalPrice,
      charityProfit: `$${finalSplit.charityProfit.toFixed(2)}`,
      sellerSharePercent: shareRef.current,
      sellerProfit: `$${finalSplit.sellerProfit.toFixed(2)}`,
    });
    ToastService.success(
      isEditMode ? 'Price & split saved.' : 'Your product listed successfully!',
    );
    onFinish();
  };

  useEffect(() => {
    setPrice(formData.price || '');
    setSellerSharePercent(formData.sellerSharePercent ?? 0);
  }, [formData]);

  return (
    <>
      <div className="flex w-full flex-col">
        <p className="font-primary text-3xl text-[#0B0112]">Price and giving</p>
        <p className="mb-4 mt-2 text-sm leading-6 text-[#5C5560]">
          Angelpage keeps {PLATFORM_FEE_PERCENT}% as a platform fee. You choose
          how the rest is split between you and your charity.
        </p>

        <div className="mb-6">
          <Input
            label="Sale price"
            name="price"
            placeholder="$"
            id="price"
            className={`flex-col !body-bold-small text-mono-100 ${error ? 'border-red-500' : ''}`}
            value={price}
            onChange={handlePriceChange}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>

        <div className="mb-6">
          <p className="forms mb-2">Your share (after platform fee)</p>
          <div className="flex flex-wrap gap-2">
            {SHARE_PRESETS.map(preset => (
              <button
                key={preset.value}
                type="button"
                onClick={() => handleShareChange(preset.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  sellerSharePercent === preset.value
                    ? 'border-[#611192] bg-[#FCF2FF] text-[#611192]'
                    : 'border-mono-40 bg-white text-mono-80 hover:border-[#E8D4F4]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <label className="forms mb-1 block" htmlFor="seller-share-range">
              Custom: you keep {sellerSharePercent}% of remainder
            </label>
            <input
              id="seller-share-range"
              type="range"
              min={0}
              max={100}
              step={5}
              value={sellerSharePercent}
              onChange={e => handleShareChange(Number(e.target.value))}
              className="w-full accent-[#611192]"
            />
          </div>
        </div>

        {numericPrice > 0 && (
          <div className="mb-6 rounded-3xl bg-[#FCF2FF] p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#611192]">
              Breakdown on a {money(numericPrice)} sale
            </p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between text-[#5C5560]">
                <span>Platform ({split.platformFeePercent}%)</span>
                <span>{money(split.platformFee)}</span>
              </div>
              <div className="flex justify-between text-[#5C5560]">
                <span>Your share ({split.sellerSharePercent}%)</span>
                <span>{money(split.sellerProfit)}</span>
              </div>
              <div className="flex justify-between border-t border-[#E6E3E7] pt-2 font-medium text-[#611192]">
                <span>Charity receives ({split.charitySharePercent}%)</span>
                <span>{money(split.charityProfit)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4 rounded-2xl bg-[#FCF2FF] px-4 py-4">
          <p className="text-body-small text-[#474648]">
            <span className="text-body-caption mb-2 flex gap-[10px] font-medium text-primary-color-100">
              <Image
                src="/images/icons/price.svg"
                alt=""
                width={12}
                height={12}
              />
              Pricing tip
            </span>
            You can give 100% to charity (0% seller share) or keep part of the
            sale — buyers always see exactly where their money goes.
          </p>
        </div>

        <div className="rounded-2xl bg-[#FCF2FF] px-4 py-4">
          <p className="text-body-small text-[#474648]">
            <span className="text-body-caption mb-2 flex gap-[10px] font-medium text-primary-color-100">
              <Image
                src="/images/icons/price.svg"
                alt=""
                width={12}
                height={12}
              />
              Shipping
            </span>
            Shipping costs are paid by the buyer unless you chose collection
            only in item details.
          </p>
        </div>

        <div className="mt-6">
          <SocialPostingToggles
            value={socialPosting}
            onChange={onSocialPostingChange}
            listingVideoUrl={listingVideoUrl}
          />
        </div>

        <div className="mb-4 mt-[27px] flex items-center justify-between">
          <Button
            variant="accend-link"
            className="flex items-center text-primary-color-100!"
            onClick={onBack}
          >
            <Image
              width={16}
              height={16}
              src="/images/icons/arr-left.svg"
              alt=""
            />
            Back
          </Button>
          <div className="flex space-x-4 sm:flex-col">
            <Button
              variant="accend-link"
              className="flex items-center pr-0! underline text-primary-color-100!"
              onClick={onSaveAsDraft}
            >
              Save as draft
            </Button>
            <Button
              type="button"
              variant="primary"
              className={`flex items-center ${error ? 'cursor-not-allowed opacity-50' : ''}`}
              onClick={handleSubmit}
              disabled={!!error}
            >
              {isSubmitting ? 'Loading...' : isEditMode ? 'Save changes' : 'Finish'}
            </Button>
          </div>
        </div>
        <label className="mt-4 flex cursor-pointer items-start gap-2">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={e => setTermsAccepted(e.target.checked)}
            className="mt-1"
          />
          <span className="text-[11px] text-mono-90">
            I agree to the Angelpage seller{' '}
            <Link
              href="/privacy-policy"
              className="text-primary-color-100 underline"
            >
              privacy policy
            </Link>{' '}
            and{' '}
            <Link
              href="/terms-of-service"
              className="text-primary-color-100 underline"
            >
              terms &amp; conditions
            </Link>
            , including the prohibition on clearance goods.
          </span>
        </label>
      </div>
    </>
  );
};

export default PriceForm;
