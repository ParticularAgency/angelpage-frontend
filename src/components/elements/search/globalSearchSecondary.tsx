'use client';

import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { searchProductsByImage, type ListingAiResult } from '@/lib/aiApi';
import ImageSearchModal, {
  ScanFrameIcon,
  type ImageSearchProduct,
  type Phase,
} from '@/components/search/ImageSearchModal';

interface Suggestion {
  id: string;
  name: string;
  type: 'Product' | 'Category' | 'Subcategory' | 'Charity';
  storefrontId?: string;
  brand?: string;
  charityId?: string;
}

type ImageModalState = {
  open: boolean;
  phase: Phase;
  previewUrl: string;
  analysis?: ListingAiResult | null;
  products?: ImageSearchProduct[];
  error?: string;
};

const GlobalSearchSecondary: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageModal, setImageModal] = useState<ImageModalState | null>(null);
  const lastFileRef = useRef<File | null>(null);
  const router = useRouter();

  const fetchSuggestions = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const api = process.env.NEXT_PUBLIC_API_URL;
      const [legacyRes, productRes] = await Promise.allSettled([
        axios.get(`${api}/search/suggestions`, {
          params: { query: searchTerm },
        }),
        axios.get(`${api}/products/search-suggest`, {
          params: { q: searchTerm, limit: 6 },
        }),
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
            }))
          );
        }
      }

      if (productRes.status === 'fulfilled') {
        const products = productRes.value.data?.suggestions || [];
        mapped.push(
          ...products.map((item: { _id: string; slug?: string; name: string; brand?: string }) => ({
            id: item.slug || item._id,
            name: item.name,
            type: 'Product' as const,
            brand: item.brand,
          }))
        );
      }

      const unique = Array.from(
        new Map(mapped.map(s => [`${s.type}-${s.id}`, s])).values()
      );

      setSuggestions(
        unique.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 8)
      );
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
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
        `/products/listing?${suggestion.type.toLowerCase()}=${suggestion.name}`
      );
    } else if (suggestion.type === 'Charity') {
      router.push(`/charity/store/${suggestion.storefrontId}`);
    }
    setSuggestions([]);
  };

  const closeImageModal = () => {
    if (imageModal?.previewUrl) URL.revokeObjectURL(imageModal.previewUrl);
    setImageModal(null);
    lastFileRef.current = null;
  };

  const runImageSearch = async (file: File) => {
    if (imageModal?.previewUrl) URL.revokeObjectURL(imageModal.previewUrl);
    const previewUrl = URL.createObjectURL(file);
    lastFileRef.current = file;
    setImageModal({ open: true, phase: 'scanning', previewUrl });
    try {
      const result = await searchProductsByImage(file);
      setImageModal(prev =>
        prev
          ? {
              ...prev,
              phase: 'results',
              analysis: result.analysis,
              products: (result.products || []) as ImageSearchProduct[],
            }
          : null,
      );
    } catch {
      setImageModal(prev =>
        prev
          ? {
              ...prev,
              phase: 'error',
              error: 'We could not read that photo. Try a clearer picture of one item.',
            }
          : null,
      );
    }
  };

  return (
    <>
    <div className="global-search-bar global-search-bar-secondary relative mt-6 mb-4 px-4 w-full  max-w-full">
      <form action="get" className="global-search-form w-full" onSubmit={event => event.preventDefault()}>
        <div className="global-search-group-field relative w-full">
          <input
            id="searchid-mobile"
            type="search"
            value={query}
            onChange={handleInputChange}
            className="search-input-filed h-12 w-full placeholder:text-[#7B7C79] placeholder:font-normal placeholder:font-secondary rounded-none! outline-hidden text-body-caption font-normal bg-transparent border-b-2 border-b-mono-40 pr-16 pl-[6px] py-[15px] text-mono-100 leading-[150%] font-secondary"
            placeholder="Search"
          />
          <button
            type="button"
            title="Search by photo"
            aria-label="Search by photo"
            className="absolute top-[12px] right-[36px] flex h-7 w-7 items-center justify-center text-[#611192]"
            onClick={() => setImageModal({ open: true, phase: 'idle', previewUrl: '' })}
          >
            <ScanFrameIcon className="h-4 w-4" />
          </button>
          <label
            htmlFor="searchid-mobile"
            className="searchbtn absolute top-[17px] right-[17px]"
          >
            <Image
              src="/images/Search-default-icon.svg"
              alt="search icon"
              width={13}
              height={13}
            />
          </label>
        </div>
      </form>

      {query.length > 1 && (
        <div className="suggestions-dropdown absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-2 z-10 max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col gap-3 p-3">
              <span className="block h-3 w-3/4 animate-pulse rounded-full bg-[#E6E3E7]" />
              <span className="block h-3 w-1/2 animate-pulse rounded-full bg-[#E6E3E7]" />
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item p-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 flex flex-col"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className="body-bold">{suggestion.name}</span>
                <span className="caption-bold text-gray-400">
                  {suggestion.type}{' '}
                  {suggestion.brand ? `| Brand: ${suggestion.brand}` : ''}{' '}
                  {suggestion.charityId
                    ? `| Charity ID: ${suggestion.charityId}`
                    : ''}
                </span>
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500 text-sm">No results found</div>
          )}
        </div>
      )}
    </div>
    <ImageSearchModal
      open={!!imageModal?.open}
      previewUrl={imageModal?.previewUrl || ''}
      phase={imageModal?.phase || 'idle'}
      analysis={imageModal?.analysis}
      products={imageModal?.products}
      error={imageModal?.error}
      onClose={closeImageModal}
      onSelectFile={runImageSearch}
      onRetry={() => {
        const file = lastFileRef.current;
        if (file) runImageSearch(file);
        else setImageModal({ open: true, phase: 'idle', previewUrl: '' });
      }}
    />
    </>
  );
};

export default GlobalSearchSecondary;
