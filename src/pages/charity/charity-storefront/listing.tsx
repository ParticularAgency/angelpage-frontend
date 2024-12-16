'use client';
import React, { useState, useEffect } from 'react';
import FilterSidebar from '@/components/elements/search/FilterSidebar';
import Sorting from '@/components/elements/search/Sorting';
import ProductList from '@/components/product/ProductList';
import Pagination from '@/components/elements/Pagination';
import SearchBar from '@/components/elements/search/SearchBar';
import { productData } from '@/libs/productData';
import { Product } from '@/types/productTypes'; // Ensure this path is correct
import { CloseIcon, FilterIcon } from '@/icons';
import { useSession } from 'next-auth/react';

// Define the type for filters
interface Filters {
  category: string[];
  subCategory: string[];
  brand: string[];
  condition: string[];
}

const CharityStoreListing: React.FC = () => {
  const { data: session, status } = useSession() || {};
  const [products] = useState<Product[]>(productData); // Initial product data
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(productData);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    category: [],
    subCategory: [],
    brand: [],
    condition: [],
  });
  const [sort, setSort] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const productsPerPage = 12;

  // Effect to filter and sort products whenever filters or search change
  useEffect(() => {
    filterAndSortProducts(filters, sort, searchQuery);
    setCurrentPage(1); // Reset to first page on filter or search change
  }, [filters, sort, searchQuery, products]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const removeFilter = (filterType: keyof Filters, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: prevFilters[filterType].filter(item => item !== value),
    }));
  };

  const filterAndSortProducts = (
    filters: Filters,
    sort: string,
    query: string
  ) => {
    let updatedProducts = [...products];

    // Filter logic
    if (filters.category.length > 0) {
      updatedProducts = updatedProducts.filter(
        product =>
          product.category !== undefined &&
          filters.category.includes(product.category)
      );
    }
    if (filters.subCategory.length > 0) {
      updatedProducts = updatedProducts.filter(
        product =>
          product.subcategory !== undefined &&
          filters.subCategory.includes(product.subcategory)
      );
    }
    if (filters.brand.length > 0) {
      updatedProducts = updatedProducts.filter(
        product =>
          product.brand !== undefined &&
          filters.brand.includes(product.brand)
      );
    }
    if (filters.condition.length > 0) {
      updatedProducts = updatedProducts.filter(
        product =>
          product.condition !== undefined &&
          filters.condition.includes(product.condition)
      );
    }

    // Search logic
    if (query) {
      updatedProducts = updatedProducts.filter(
        product =>
          (product.name &&
            product.name.toLowerCase().includes(query.toLowerCase())) ||
          (product.category &&
            product.category.toLowerCase().includes(query.toLowerCase())) ||
          (product.subcategory &&
            product.subcategory.toLowerCase().includes(query.toLowerCase())) ||
          (product.brand &&
            product.brand.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Sorting logic
    if (sort === 'price-asc') {
      updatedProducts.sort(
        (a, b) =>
          parseFloat(a.price || '0') - parseFloat(b.price || '0')
      );
    } else if (sort === 'price-desc') {
      updatedProducts.sort(
        (a, b) =>
          parseFloat(b.price || '0') - parseFloat(a.price || '0')
      );
    } else if (sort === 'name-asc') {
      updatedProducts.sort((a, b) =>
        (a.name || '').localeCompare(b.name || '')
      );
    } else if (sort === 'name-desc') {
      updatedProducts.sort((a, b) =>
        (b.name || '').localeCompare(a.name || '')
      );
    }

    setFilteredProducts(updatedProducts);
    setTotalPages(Math.ceil(updatedProducts.length / productsPerPage));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

    if (status === 'loading') {
      return <p>Loading...</p>;
    }

    if (status === 'unauthenticated') {
      return <p>You must be logged in to view this page.</p>;
    }
    
  return (
    <section className="products-lists-section pt-[31px] pb-[54px] md:pb-9 sm:pt-5 sm:pb-8 bg-[#F1F1F7]">
      <div className="custom-container">
        <div className="products-lists-wrapper">
          <div className="products-lists-main-cont flex items-start md:flex-col gap-6">
            <div className="products-list-main-left-cont h-[100vh] sticky md:relative md:h-auto top-9 max-w-[220px] md:max-w-[160px] w-full md:hidden">
              <FilterSidebar
                availableProducts={products.map(product => ({
                  ...product,
                  category: product.category || '', // Ensuring category is defined
                  subcategory: product.subcategory || '', // Similarly for other properties
                  brand: product.brand || '',
                  condition: product.condition || '',
                }))}
                selectedFilters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
            <div className="products-list-main-right-cont">
              <div className="product-list-header mb-4 flex items-center justify-between gap-5 md:w-full">
                <div className="filter-area-box md:w-full flex items-center gap-8">
                  <div className="filter-search-with-searchbar flex items-center md:justify-between gap-4">
                    <div className="filter-sidebar-search hidden md:block">
                      <input
                        id="my-drawer-filter"
                        type="checkbox"
                        className="drawer-toggle"
                      />
                      <div className="drawer-content">
                        <label
                          htmlFor="my-drawer-filter"
                          className="drawer-button btn !outline-none !shadow-none !bg-transparent !p-0 !border-none"
                        >
                          Filter <FilterIcon />
                        </label>
                      </div>
                      <div className="drawer-side">
                        <label
                          htmlFor="my-drawer-filter"
                          aria-label="close sidebar"
                          className="drawer-overlay"
                        ></label>
                        <div className="menu offcanvas-main-wrapper bg-mono-0 text-base-content min-h-full max-w-[430px] w-full p-0">
                          <div className="offcanvas-head mini-cart-header-and-main-wrea min-h-full">
                            <div className="minicart-header px-6">
                              <div className="cart-head-top border-b pt-5 pb-5 flex justify-between items-center border-b-mono-60">
                                <p className="eyebrow-large">Filter Search</p>
                                <label
                                  htmlFor="my-drawer-filter"
                                  aria-label="close sidebar"
                                  className="close-btn !border-0 !outline-none !shadow-none w-8 h-8 flex items-center justify-center cursor-pointer"
                                >
                                  <CloseIcon />
                                </label>
                              </div>
                            </div>
                            <div className="filter-body-product-info px-6">
                              <div className="empty-product-listing-message my-auto py-12 hidden">
                                <p className="font-secondary font-medium text-body-caption text-center text-mono-100">
                                  Listing is empty
                                </p>
                              </div>
                              <div className="cart-add-product-item-wrapper pt-4">
                                <div className="product-selected-category-lists flex flex-wrap items-center gap-2">
                                  {Object.keys(filters).map(filterType => {
                                    const key = filterType as keyof Filters;
                                    return filters[key].map(
                                      (filterValue, index) => (
                                        <span
                                          key={index}
                                          className="selected-filter whitespace-nowrap flex items-center gap-0 h-8 bg-[#F4E8F9] caption text-primary-color-100 px-[8px] py-[4px] rounded-[16px]"
                                        >
                                          {filterValue}
                                          <button
                                            className="remove-filter p-[5px]"
                                            onClick={() =>
                                              removeFilter(key, filterValue)
                                            }
                                          >
                                            x
                                          </button>
                                        </span>
                                      )
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="offcanvas-main px-6 min-h-full mt-4 pb-8">
                            <div className="cart-canvas-area min-h-full">
                              <FilterSidebar
                                availableProducts={products.map(product => ({
                                  ...product,
                                  category: product.category || '', // Ensuring category is defined
                                  subcategory: product.subcategory || '', // Similarly for other properties
                                  brand: product.brand || '',
                                  condition: product.condition || '',
                                }))}
                                selectedFilters={filters}
                                onFilterChange={handleFilterChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <SearchBar
                      filteredProducts={filteredProducts.length}
                      onSearch={handleSearch}
                    />
                  </div>
                  <div className="product-selected-category-lists flex flex-wrap items-center gap-2">
                    {Object.keys(filters).map(filterType => {
                      const key = filterType as keyof Filters;
                      return filters[key].map((filterValue, index) => (
                        <span
                          key={index}
                          className="selected-filter whitespace-nowrap flex items-center gap-0 h-8 bg-[#F4E8F9] caption text-primary-color-100 px-[8px] py-[4px] rounded-[16px]"
                        >
                          {filterValue}
                          <button
                            className="remove-filter p-[5px]"
                            onClick={() => removeFilter(key, filterValue)}
                          >
                            x
                          </button>
                        </span>
                      ));
                    })}
                  </div>
                </div>
                <Sorting onSortChange={handleSortChange} />
              </div>

              <ProductList products={currentProducts} isLoggedIn={!!session} />
              <div className="product-lists-footer mt-[38px] md:mt-6 flex md:flex-row-reverse md:justify-between sm:flex-col sm:mt-4 items-center">
                <div className="pagination-wrapper ml-auto mr-auto md:mx-0">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
                <div className="showing-current-product">
                  <span className="caption pr-3 md:pr-1">Showing</span>{' '}
                  <span className="caption">
                    {startIndex + 1} to{' '}
                    {Math.min(
                      startIndex + productsPerPage,
                      filteredProducts.length
                    )}{' '}
                    of
                  </span>{' '}
                  <span className="caption-bold">
                    {filteredProducts.length} products
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CharityStoreListing;
