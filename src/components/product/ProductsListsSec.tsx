'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FilterSidebar from '@/components/elements/search/FilterSidebar';
import Sorting from '@/components/elements/search/Sorting';
import ProductList from '@/components/product/ProductList';
import Pagination from '@/components/elements/Pagination';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { CloseIcon, FilterIcon } from '@/icons';
import ProductSkeletonCard from '../common/cards/product/productskeletonCard';
import { Product } from '@/types/productTypes';
import { Button } from '@/components/elements';
import Link from 'next/link';

interface ProductsResponse {
  products: Product[];
  isLoggedIn: boolean;
}
interface Filters {
  category: string[];
  subCategory: string[];
  brand: string[];
  condition: string[];
}
interface ProductsListsSecProps {
  category: string;
  subcategory?: string;
}

const ProductsListsSec: React.FC<ProductsListsSecProps> = () => {
  const { data: session } = useSession() || {};
  const searchParams = useSearchParams();
  const category = searchParams?.get('category') || '';
  const subcategory = searchParams?.get('subcategory') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filters, setFilters] = useState<Filters>({
    category: [],
    subCategory: [],
    brand: [],
    condition: [],
  });
  const [sort, setSort] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const productsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const headers: Record<string, string> = {};
        if (session?.token) {
          headers.Authorization = `Bearer ${session.token}`;
        }
        const endpoint =
          category || subcategory
            ? `${process.env.NEXT_PUBLIC_API_URL}/products/category`
            : `${process.env.NEXT_PUBLIC_API_URL}/products/all`;

        const response = await axios.get<ProductsResponse>(endpoint, {
          params: { category, subcategory, status: 'LIVE' },
          headers,
        });

        const productsData = response.data.products || [];
        setProducts(productsData);
        setFilteredProducts(productsData);
        setTotalPages(Math.ceil(productsData.length / productsPerPage));
        setCurrentPage(1); // Reset to first page
      } catch (err: unknown) {
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, subcategory]);

  useEffect(() => {
    filterAndSortProducts(filters, sort);
    setTotalPages(Math.ceil(filteredProducts.length / productsPerPage));
    setCurrentPage(1); // Reset to first page on filter change
  }, [filters, sort, products]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
  };

  const removeFilter = (filterType: keyof Filters, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: prevFilters[filterType].filter(item => item !== value),
    }));
  };

  const filterAndSortProducts = (filters: Filters, sort: string) => {
    let updatedProducts = [...products];

    // Filter logic
    if (filters.category.length > 0) {
      updatedProducts = updatedProducts.filter(product =>
        filters.category.includes(product.category || '' || '')
      );
    }
    if (filters.subCategory.length > 0) {
      updatedProducts = updatedProducts.filter(product =>
        filters.subCategory.includes(product.subcategory || '')
      );
    }
    if (filters.brand.length > 0) {
      updatedProducts = updatedProducts.filter(product =>
        filters.brand.includes(product.brand || '')
      );
    }
    if (filters.condition.length > 0) {
      updatedProducts = updatedProducts.filter(product =>
        filters.condition.includes(product.condition || '')
      );
    }

    // Sort logic
    if (sort === 'price-asc') {
      updatedProducts.sort(
        (a, b) => parseFloat(a.price || '0') - parseFloat(b.price || '0')
      );
    } else if (sort === 'price-desc') {
      updatedProducts.sort(
        (a, b) => parseFloat(b.price || '0') - parseFloat(a.price || '0')
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

  if (error) {
    return (
      <>
        <div className="not-found-screen-design flex flex-col items-center pt-12 pb-12 custom-container">
          <h5 className="body-bold-medium text-mono-100 font-medium font-secondary mb-2 text-center">
            No products listed!
          </h5>
          <p className="body-regular font-secondary font-regular text-mono-90 text-center max-w-[620px] w-full mx-auto">
            Currently, there are no products available in this category. Please
            return to the homepage for more options.
          </p>
          <Link href="/">
            <Button variant="primary" className="mx-auto mt-6">
              Return Home
            </Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <section className="products-lists-section pt-[31px] pb-[54px] md:pb-9 sm:pt-5 sm:pb-8 bg-[#F1F1F7]">
      <div className="custom-container">
        <div className="products-lists-wrapper">
          <div className="product-list-header mb-[23px] md:mb-4 flex items-center justify-between gap-5 w-full">
            <div className="filter-area-box flex items-center gap-8">
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
                            listing is empty
                          </p>
                        </div>

                        <div className="cart-add-product-item-wrapper pt-4">
                          <div className="product-selected-category-lists flex flex-wrap items-center gap-2">
                            {Object.keys(filters).map(filterType => {
                              const key = filterType as keyof Filters; // Assert the type here
                              return filters[key].map((filterValue, index) => (
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
                              ));
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
                            brand: product.brand || 'Unknown Brand',
                            name: product.name || 'Untitled Product',
                            condition: product.condition || 'Unknown Condition',
                            subcategory: product.subcategory || 'Uncategorized',
                            category: product.category || 'Uncategorized', // Default category
                          }))}
                          selectedFilters={filters}
                          onFilterChange={handleFilterChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="product-selected-category-lists flex flex-wrap items-center gap-2">
                {Object.keys(filters).map(filterType => {
                  const key = filterType as keyof Filters; // Assert the type here
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

          <div className="products-lists-main-cont flex items-start md:flex-col gap-6">
            <div className="products-list-main-left-cont overflow-hidden overflow-y-scroll h-[100vh] sticky md:relative md:h-auto top-9 max-w-[220px] md:max-w-[160px] w-full md:hidden">
              <FilterSidebar
                availableProducts={products.map(product => ({
                  ...product,
                  brand: product.brand || 'Unknown Brand',
                  name: product.name || 'Untitled Product',
                  condition: product.condition || 'Unknown Condition',
                  subcategory: product.subcategory || 'Uncategorized',
                  category: product.category || 'Uncategorized', // Default category
                }))}
                selectedFilters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
            <div className="products-list-main-right-cont">
              {loading ? (
                <div className="product-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <ProductSkeletonCard key={index} />
                  ))}
                </div>
              ) : (
                <ProductList
                  isLoggedIn={!!session?.token}
                  products={currentProducts}
                />
              )}
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
                  </span>
                  {'  '}
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

export default ProductsListsSec;
