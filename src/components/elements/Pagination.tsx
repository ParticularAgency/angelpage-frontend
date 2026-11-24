'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Math.max(totalPages, 1);
  const page = Math.min(Math.max(currentPage, 1), pages);

  const getPageNumbers = () => {
    const pageNumbers: Array<number | '...'> = [];
    if (pages <= 5) {
      for (let i = 1; i <= pages; i += 1) pageNumbers.push(i);
      return pageNumbers;
    }
    if (page <= 3) return [1, 2, 3, '...', pages] as Array<number | '...'>;
    if (page >= pages - 2) {
      return [1, '...', pages - 2, pages - 1, pages] as Array<number | '...'>;
    }
    return [1, '...', page, '...', pages] as Array<number | '...'>;
  };

  const stepButton =
    'inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E6E3E7] bg-white text-[#611192] shadow-[0_8px_20px_rgba(97,17,146,0.08)] transition hover:border-[#611192] hover:bg-[#FCF2FF] disabled:cursor-not-allowed disabled:border-[#E6E3E7] disabled:bg-[#F7F4F8] disabled:text-[#C4B8CC] disabled:shadow-none disabled:hover:bg-[#F7F4F8]';

  return (
    <nav className="inline-flex items-center gap-3" aria-label="Pagination">
      <button
        type="button"
        className={stepButton}
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      </button>

      <div className="flex items-center gap-1 rounded-full bg-[#FCF2FF] px-2 py-1.5">
        {getPageNumbers().map((item, index) =>
          item === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1.5 text-sm text-[#8A7E90]"
              aria-hidden
            >
              ···
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-label={`Page ${item}`}
              aria-current={item === page ? 'page' : undefined}
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-medium transition ${
                item === page
                  ? 'bg-[#611192] text-white shadow-[0_6px_16px_rgba(97,17,146,0.28)]'
                  : 'text-[#3B055C] hover:bg-white'
              }`}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        className={stepButton}
        disabled={page === pages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      </button>
    </nav>
  );
};

export default Pagination;
