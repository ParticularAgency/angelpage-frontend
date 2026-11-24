'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { ListingAiResult } from '@/lib/aiApi';
import { resolveCategoryId } from '@/lib/aiApi';
import { formatMarketMoney } from '@/lib/marketPreference';
import { useLocale } from '@/i18n/LocaleProvider';

export type ImageSearchProduct = {
  _id: string;
  slug?: string;
  name: string;
  brand?: string;
  category?: string;
  subcategory?: string;
  price?: number;
  images?: Array<string | { url?: string }>;
  condition?: string;
  matchScore?: number;
};

export type Phase = 'idle' | 'scanning' | 'results' | 'error';

interface ImageSearchModalProps {
  open: boolean;
  previewUrl: string;
  phase: Phase;
  analysis?: ListingAiResult | null;
  products?: ImageSearchProduct[];
  error?: string;
  onClose: () => void;
  onRetry?: () => void;
  onSelectFile: (file: File) => void;
}

export function ScanFrameIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function productImage(product: ImageSearchProduct) {
  const first = product.images?.[0];
  if (!first) return '';
  if (typeof first === 'string') return first;
  return first.url || '';
}

function attributeChips(analysis?: ListingAiResult | null) {
  if (!analysis) return [];
  return [
    analysis.category,
    analysis.subcategory,
    analysis.brand,
    analysis.color,
    analysis.material,
    ...(analysis.searchKeywords || []).slice(0, 4),
  ].filter((value): value is string => Boolean(value && value.trim()));
}

const ImageSearchModal: React.FC<ImageSearchModalProps> = ({
  open,
  previewUrl,
  phase,
  analysis,
  products = [],
  error,
  onClose,
  onRetry,
  onSelectFile,
}) => {
  const router = useRouter();
  const { locale } = useLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const chips = useMemo(() => {
    const seen = new Set<string>();
    return attributeChips(analysis).filter(chip => {
      const key = chip.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [analysis]);

  const filteredProducts = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter(product =>
      [product.name, product.brand, product.category, product.subcategory, product.condition]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [products, filterQuery]);

  const categoryId = resolveCategoryId(analysis?.category);

  useEffect(() => {
    if (!open) {
      setFilterQuery('');
      setDragOver(false);
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const openProduct = (product: ImageSearchProduct) => {
    onClose();
    router.push(`/product/${product.slug || product._id}`);
  };

  const browseCategory = () => {
    onClose();
    if (categoryId) {
      router.push(`/product?category=${encodeURIComponent(categoryId)}`);
      return;
    }
    router.push('/product');
  };

  const takeFile = (file?: File | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    onSelectFile(file);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[10060] flex items-center justify-center p-4 sm:items-end sm:p-0"
        role="dialog"
        aria-modal="true"
        aria-labelledby="photo-search-title"
      >
        <motion.button
          type="button"
          aria-label="Close photo search"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#0B0112]/45"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="relative z-10 flex max-h-[min(88vh,760px)] w-full max-w-[860px] flex-col overflow-hidden rounded-3xl border border-[#E6E3E7] bg-white shadow-[0_24px_80px_rgba(97,17,146,0.18)] sm:max-h-[94vh] sm:rounded-b-none"
          onClick={event => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 border-b border-[#E6E3E7] bg-[#FCF2FF] px-6 py-5 sm:px-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#611192] text-white">
                <ScanFrameIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#611192]">
                  Angelpage
                </p>
                <h2 id="photo-search-title" className="font-primary text-[1.65rem] leading-none text-[#0B0112]">
                  Search by photo
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E6E3E7] bg-white text-[#0B0112]"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-y-auto px-6 py-6 sm:px-5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={event => {
                takeFile(event.target.files?.[0]);
                event.target.value = '';
              }}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              className="hidden"
              onChange={event => {
                takeFile(event.target.files?.[0]);
                event.target.value = '';
              }}
            />

            {phase === 'idle' && (
              <div>
                <p className="mb-4 max-w-xl text-sm leading-6 text-[#5C5560]">
                  Add a photo of an item. We read it and suggest live listings that look like a match.
                </p>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') fileInputRef.current?.click();
                  }}
                  onDragOver={event => {
                    event.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={event => {
                    event.preventDefault();
                    setDragOver(false);
                    takeFile(event.dataTransfer.files?.[0]);
                  }}
                  className={`flex cursor-pointer flex-col items-center rounded-3xl border border-dashed px-6 py-12 text-center transition ${
                    dragOver
                      ? 'border-[#611192] bg-[#FCF2FF]'
                      : 'border-[#D8C3E4] bg-[#FCF2FF]/50 hover:border-[#611192]'
                  }`}
                >
                  <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E6E3E7] bg-white text-[#611192]">
                    <ScanFrameIcon className="h-7 w-7" />
                  </span>
                  <p className="font-primary text-2xl text-[#0B0112]">Drop a product photo</p>
                  <p className="mt-2 text-sm text-[#5C5560]">JPG, PNG, or WebP. A clear photo of one item works best.</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={event => {
                        event.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="rounded-full bg-[#611192] px-5 py-2.5 text-sm font-medium text-white"
                    >
                      Choose photo
                    </button>
                    <button
                      type="button"
                      onClick={event => {
                        event.stopPropagation();
                        cameraInputRef.current?.click();
                      }}
                      className="rounded-full border border-[#611192] bg-white px-5 py-2.5 text-sm font-medium text-[#611192]"
                    >
                      Use camera
                    </button>
                  </div>
                </div>
              </div>
            )}

            {phase === 'scanning' && previewUrl && (
              <div className="mx-auto max-w-md">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#E6E3E7] bg-[#FCF2FF]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Photo being read" className="h-full w-full object-cover" />
                  <div className="pointer-events-none absolute inset-3 rounded-2xl border-2 border-white/80" />
                  <motion.div
                    animate={{ top: ['8%', '78%', '8%'] }}
                    transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
                    className="absolute left-4 right-4 h-0.5 bg-[#611192] shadow-[0_0_16px_#611192]"
                  />
                </div>
                <p className="mt-4 text-center font-primary text-2xl text-[#0B0112]">Reading your photo</p>
                <p className="mt-1 text-center text-sm text-[#5C5560]">
                  Looking through live listings for a close match.
                </p>
              </div>
            )}

            {phase === 'results' && (
              <div className="grid grid-cols-12 gap-6 md:grid-cols-1">
                <div className="col-span-5 md:col-span-full">
                  {previewUrl && (
                    <div className="overflow-hidden rounded-3xl border border-[#E6E3E7] bg-[#FCF2FF]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewUrl} alt="Your photo" className="aspect-[4/3] w-full object-cover" />
                    </div>
                  )}
                  <p className="mt-4 font-primary text-2xl leading-tight text-[#0B0112]">
                    {analysis?.title || 'Photo read'}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#5C5560]">
                    {analysis?.additionalInfo || 'These listings are the closest matches in the shop.'}
                  </p>
                  {chips.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {chips.map(chip => {
                        const active = filterQuery.toLowerCase() === chip.toLowerCase();
                        return (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => setFilterQuery(active ? '' : chip)}
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              active
                                ? 'bg-[#611192] text-white'
                                : 'bg-[#FCF2FF] text-[#611192]'
                            }`}
                          >
                            {chip}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="col-span-7 md:col-span-full">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-[#0B0112]">Suggested listings</p>
                    <span className="text-xs text-[#5C5560]">{filteredProducts.length} found</span>
                  </div>
                  <div className="max-h-[380px] space-y-2 overflow-y-auto pr-1">
                    {filteredProducts.length === 0 ? (
                      <div className="rounded-3xl border border-dashed border-[#E6E3E7] bg-[#FCF2FF]/60 px-5 py-8 text-center">
                        <p className="font-primary text-xl text-[#0B0112]">No close listing yet</p>
                        <p className="mt-2 text-sm text-[#5C5560]">
                          The photo was read
                          {analysis?.category ? ` as ${analysis.category}` : ''}. Browse that aisle or try another photo.
                        </p>
                      </div>
                    ) : (
                      filteredProducts.map(product => {
                        const image = productImage(product);
                        return (
                          <button
                            key={product._id}
                            type="button"
                            onClick={() => openProduct(product)}
                            className="flex w-full items-center gap-3 rounded-2xl border border-[#E6E3E7] bg-white p-3 text-left transition hover:border-[#611192] hover:bg-[#FCF2FF]"
                          >
                            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#FCF2FF]">
                              {image ? (
                                <Image src={image} alt="" fill className="object-cover" sizes="64px" />
                              ) : null}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-[11px] font-medium uppercase tracking-wide text-[#611192]">
                                {product.category || 'Listing'}
                              </span>
                              <span className="mt-0.5 block truncate font-medium text-[#0B0112]">{product.name}</span>
                              <span className="mt-0.5 block truncate text-xs text-[#5C5560]">
                                {[product.brand, product.condition].filter(Boolean).join(' · ')}
                                {product.price != null
                                  ? `${product.brand || product.condition ? ' · ' : ''}${formatMarketMoney(Number(product.price), locale)}`
                                  : ''}
                              </span>
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full border border-[#E6E3E7] px-5 py-2.5 text-sm font-medium text-[#0B0112]"
                    >
                      Try another photo
                    </button>
                    <button
                      type="button"
                      onClick={browseCategory}
                      className="rounded-full bg-[#611192] px-5 py-2.5 text-sm font-medium text-white"
                    >
                      {categoryId ? `Browse ${analysis?.category}` : 'Browse the shop'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {phase === 'error' && (
              <div className="px-2 py-8 text-center">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FCF2FF] text-[#611192]">
                  <ScanFrameIcon className="h-6 w-6" />
                </span>
                <p className="font-primary text-2xl text-[#0B0112]">Photo could not be read</p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5C5560]">{error}</p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full border border-[#E6E3E7] px-5 py-2.5 text-sm text-[#0B0112]"
                  >
                    Close
                  </button>
                  {onRetry && (
                    <button
                      type="button"
                      onClick={onRetry}
                      className="rounded-full bg-[#611192] px-5 py-2.5 text-sm font-medium text-white"
                    >
                      Try again
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ImageSearchModal;
