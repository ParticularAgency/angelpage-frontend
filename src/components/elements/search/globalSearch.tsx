'use client';

import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { smartProductSearch, searchProductsByImage } from '@/lib/aiApi';
import ImageSearchModal, {
  ScanFrameIcon,
  type ImageSearchProduct,
  type Phase,
} from '@/components/search/ImageSearchModal';
import type { ListingAiResult } from '@/lib/aiApi';

interface Suggestion {
  id: string;
  name: string;
  type: 'Product' | 'Category' | 'Subcategory' | 'Charity';
  storefrontId?: string;
  brand?: string;
  charityId?: string;
}

interface GlobalSearchProps {
  className: string;
}

type ImageModalState = {
  open: boolean;
  phase: Phase;
  previewUrl: string;
  file: File | null;
  analysis?: ListingAiResult | null;
  products?: ImageSearchProduct[];
  error?: string;
};

const GlobalSearch: React.FC<GlobalSearchProps> = ({ className }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiIntent, setAiIntent] = useState('');
  const [imageModal, setImageModal] = useState<ImageModalState | null>(null);
  const router = useRouter();
  const lastFileRef = useRef<File | null>(null);

  const mapAiProducts = (
    products: Array<{ _id: string; slug?: string; name: string; brand?: string }>,
  ) =>
    products.map(item => ({
      id: item.slug || item._id,
      name: item.name,
      type: 'Product' as const,
      brand: item.brand,
    }));

  const fetchSuggestions = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      setAiIntent('');
      return;
    }

    setLoading(true);
    try {
      const api = process.env.NEXT_PUBLIC_API_URL;
      const [legacyRes, productRes, aiRes] = await Promise.allSettled([
        axios.get(`${api}/search/suggestions`, {
          params: { query: searchTerm },
        }),
        axios.get(`${api}/products/search-suggest`, {
          params: { q: searchTerm, limit: 6 },
        }),
        smartProductSearch(searchTerm),
      ]);

      const mapped: Suggestion[] = [];

      if (legacyRes.status === 'fulfilled') {
        const suggestionsData = legacyRes.value.data || [];
        if (Array.isArray(suggestionsData)) {
          mapped.push(
            ...suggestionsData.map(item => ({
              id: item.id || item._id,
              name: item.name || item.title,
              type: item.type || 'Unknown',
              storefrontId: item.storefrontId,
              brand: item.brand,
              charityId: item.charityId,
            })),
          );
        }
      }

      if (productRes.status === 'fulfilled') {
        const products = productRes.value.data?.suggestions || [];
        mapped.push(
          ...products.map(
            (item: { _id: string; slug?: string; name: string; brand?: string }) => ({
              id: item.slug || item._id,
              name: item.name,
              type: 'Product' as const,
              brand: item.brand,
            }),
          ),
        );
      }

      if (aiRes.status === 'fulfilled' && aiRes.value.products?.length) {
        setAiIntent(aiRes.value.intent || '');
        mapped.push(...mapAiProducts(aiRes.value.products));
      } else {
        setAiIntent('');
      }

      const unique = Array.from(
        new Map(mapped.map(s => [`${s.type}-${s.id}`, s])).values(),
      );

      setSuggestions(
        unique.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 10),
      );
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const closeImageModal = () => {
    if (imageModal?.previewUrl) {
      URL.revokeObjectURL(imageModal.previewUrl);
    }
    setImageModal(null);
    lastFileRef.current = null;
  };

  const runImageSearch = async (file: File) => {
    if (imageModal?.previewUrl) {
      URL.revokeObjectURL(imageModal.previewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    lastFileRef.current = file;

    setImageModal({
      open: true,
      phase: 'scanning',
      previewUrl,
      file,
    });

    try {
      const result = await searchProductsByImage(file);
      const products = (result.products || []) as ImageSearchProduct[];
      const mapped = mapAiProducts(result.products || []);

      if (result.analysis?.title) {
        setQuery(result.analysis.title);
      }
      setAiIntent(
        result.analysis
          ? `Visual match: ${result.analysis.category || 'product'}`
          : '',
      );
      setSuggestions(mapped);

      setImageModal(prev =>
        prev
          ? {
              ...prev,
              phase: 'results',
              analysis: result.analysis,
              products,
            }
          : null,
      );
    } catch (err) {
      const raw =
        axios.isAxiosError(err) && err.response?.data?.error
          ? String(err.response.data.error)
          : '';
      const message = /quota|429/i.test(raw)
        ? 'The photo reader is busy. Wait a moment, then try the same photo again.'
        : /not configured|API key/i.test(raw)
          ? 'Photo search is not available right now.'
          : 'We could not read that photo. Try a clearer picture of one item.';

      setImageModal(prev =>
        prev
          ? {
              ...prev,
              phase: 'error',
              error: message,
            }
          : null,
      );
    }
  };

  const openImageScanner = () => {
    setImageModal({
      open: true,
      phase: 'idle',
      previewUrl: '',
      file: null,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.type === 'Product') {
      router.push(`/product/${suggestion.id}`);
    } else if (
      suggestion.type === 'Category' ||
      suggestion.type === 'Subcategory'
    ) {
      router.push(
        `/products/listing?${suggestion.type.toLowerCase()}=${suggestion.name}`,
      );
    } else if (suggestion.type === 'Charity') {
      router.push(`/charity/store/${suggestion.storefrontId}`);
    }
    setSuggestions([]);
  };

  const isImageSearching = imageModal?.phase === 'scanning';
  const isModalOpen = !!imageModal?.open;

  return (
    <>
      <div
        className={`global-search-bar relative w-full max-w-[300px] ${className}`}
      >
        <form className="global-search-form w-full" onSubmit={e => e.preventDefault()}>
          <div className="global-search-group-field relative w-full">
            <input
              id="searchid1"
              type="search"
              value={query}
              onChange={handleInputChange}
              className="search-input-filed h-10 w-full rounded-[24px] bg-primary-color-70 py-[11.5px] pl-8 pr-10 font-secondary text-body-form font-normal leading-[150%] text-primary-color-100 outline-hidden placeholder:text-primary-color-100"
              placeholder="Search"
            />
            <label
              htmlFor="searchid1"
              className="searchbtn absolute left-3 top-[13px]"
            >
              <Image
                src="/images/Search-primary.svg"
                alt="search icon"
                width={13}
                height={13}
              />
            </label>
            <button
              type="button"
              title="Search by photo"
              aria-label="Search by photo"
              className={`absolute right-2 top-[9px] flex h-7 w-7 items-center justify-center rounded-full transition ${
                isImageSearching
                  ? 'bg-primary-color-100/20 text-primary-color-100'
                  : 'text-primary-color-100 hover:bg-primary-color-100/10'
              }`}
              disabled={isImageSearching}
              onClick={openImageScanner}
            >
              {isImageSearching ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-color-100/30 border-t-primary-color-100" />
              ) : (
                <ScanFrameIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </form>

        {(query.length > 1 || suggestions.length > 0) && !isModalOpen && (
          <div className="suggestions-dropdown absolute left-0 top-full z-10 mt-2 max-h-[300px] w-full overflow-y-auto rounded-xl border border-mono-20 bg-white shadow-lg">
            {aiIntent && (
              <p className="rounded-t-xl border-b bg-[#FCF2FF] px-3 py-2 text-xs text-primary-color-100">
                ✨ AI: {aiIntent}
              </p>
            )}
            {loading ? (
              <div className="flex flex-col gap-3 p-3">
                <span className="block h-3 w-3/4 animate-pulse rounded-full bg-[#E6E3E7]" />
                <span className="block h-3 w-1/2 animate-pulse rounded-full bg-[#E6E3E7]" />
                <span className="block h-3 w-2/3 animate-pulse rounded-full bg-[#E6E3E7]" />
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item flex cursor-pointer flex-col border-b border-mono-20/50 px-3 py-2.5 text-sm text-gray-700 last:border-0 hover:bg-[#FCF2FF]/60"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="body-bold text-mono-100">{suggestion.name}</span>
                  <span className="caption-bold text-mono-70">
                    {suggestion.type}
                    {suggestion.brand ? ` · ${suggestion.brand}` : ''}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-3 text-sm text-mono-70">No results found</div>
            )}
          </div>
        )}
      </div>

      <ImageSearchModal
        open={isModalOpen}
        previewUrl={imageModal?.previewUrl || ''}
        phase={imageModal?.phase || 'idle'}
        analysis={imageModal?.analysis}
        products={imageModal?.products}
        error={imageModal?.error}
        onClose={closeImageModal}
        onSelectFile={runImageSearch}
        onRetry={() => {
          const file = lastFileRef.current;
          if (file) {
            if (imageModal?.previewUrl) URL.revokeObjectURL(imageModal.previewUrl);
            runImageSearch(file);
          } else {
            openImageScanner();
          }
        }}
      />
    </>
  );
};

export default GlobalSearch;
