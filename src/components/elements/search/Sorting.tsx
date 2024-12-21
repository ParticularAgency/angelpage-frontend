import React from 'react';

interface SortingProps {
  onSortChange: (sortType: string) => void;
}

const Sorting: React.FC<SortingProps> = ({ onSortChange }) => {
  return (
    <div className="sorting flex items-center gap-[14px] sm:gap-[4px] bg-transparent border-0">
      <label htmlFor="sort-select" className="body-small whitespace-nowrap">
        Sort by:
      </label>
      <select
        id="sort-select"
        className="caption bg-transparent focus:outline-0 w-full max-w-[160px] pr-8 !pl-2"
        onChange={e => onSortChange(e.target.value)}
        defaultValue="" // Set default to empty to show placeholder
      >
        <option
          value="price-asc"
          className="py-[11px] px-2 bg-[#FCF2FF] caption"
        >
          Price: low - high
        </option>
        <option
          value="price-desc"
          className="py-[11px] px-2 bg-[#FCF2FF] caption"
        >
          Price: high - low
        </option>
        {/* <option value="name-asc" className="py-[11px] px-2 bg-[#FCF2FF] caption">Alphabetically (A-Z)</option> */}
        {/* <option value="name-desc" className="py-[11px] px-2 bg-[#FCF2FF] caption">Alphabetically (Z-A)</option> */}
        <option
          value="date-desc"
          className="py-[11px] px-2 bg-[#FCF2FF] caption"
        >
          Most recent
        </option>{' '}
        {/* Optional */}
      </select>
    </div>
  );
};

export default Sorting;
