import React from 'react';

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
  // Calculate the page numbers to display, including ellipsis logic
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Maximum number of visible pages in the pagination

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(
          1,
          '...',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pageNumbers.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination flex items-center gap-2">
      <button
        disabled={currentPage === 1}
        className="p-2"
        onClick={() => onPageChange(currentPage - 1)}
      >
        &lt;
      </button>

      <div className="pagiantion-item flex items-center gap-2">
        {pageNumbers.map((page, index) => (
          <button
            key={index}
            className={`${page === currentPage ? 'active' : ''} body-small`}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        disabled={currentPage === totalPages}
        className="p-2"
        onClick={() => onPageChange(currentPage + 1)}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
