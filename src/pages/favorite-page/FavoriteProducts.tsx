'use client';
import React, { useState, useMemo } from 'react';
import Sorting from '@/components/elements/search/Sorting';
import ProductList from '@/components/product/ProductList';
import Pagination from '@/components/elements/Pagination';
import SearchBar from '@/components/elements/search/SearchBar';
import { Product } from '@/types/productTypes'; // Importing the correct Product type

type SortOptions = '' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

type Filters = {
  category: string[];
  subCategory: string[];
  productBrand: string[];
  productCondition: string[];
};

interface FavoriteProductListingProps {
  products: Product[];
}

const FavoriteProductListing: React.FC<FavoriteProductListingProps> = ({
  products,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<SortOptions>('');
  const [searchQuery, setSearchQuery] = useState('');

  const productsPerPage = 10;

  const [filters] = useState<Filters>({
    category: [],
    subCategory: [],
    productBrand: [],
    productCondition: [],
  });

  const filterAndSortProducts = (
    products: Product[],
    filters: Filters,
    sort: SortOptions,
    query: string
  ) => {
    let updatedProducts = [...products];

    // Filtering logic
    if (filters.category.length > 0) {
      updatedProducts = updatedProducts.filter(
        product =>
          product.category && filters.category.includes(product.category)
      );
    }
    if (filters.subCategory.length > 0) {
      updatedProducts = updatedProducts.filter(
        product =>
          product.subcategory &&
          filters.subCategory.includes(product.subcategory)
      );
    }
    if (filters.productBrand.length > 0) {
      updatedProducts = updatedProducts.filter(
        product =>
          product.productBrand &&
          filters.productBrand.includes(product.productBrand)
      );
    }
    if (filters.productCondition.length > 0) {
      updatedProducts = updatedProducts.filter(
        product =>
          product.productCondition &&
          filters.productCondition.includes(product.productCondition)
      );
    }

    // Search logic
    if (query) {
      updatedProducts = updatedProducts.filter(
        product =>
          product.productTitle?.toLowerCase().includes(query.toLowerCase()) ||
          product.category?.toLowerCase().includes(query.toLowerCase()) ||
          product.subcategory?.toLowerCase().includes(query.toLowerCase()) ||
          product.productBrand?.toLowerCase().includes(query.toLowerCase()) ||
          product.productCondition
            ?.toLowerCase()
            .includes(query.toLowerCase()) ||
          product.location?.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Sorting logic
    if (sort === 'price-asc') {
      updatedProducts.sort(
        (a, b) =>
          parseFloat(a.productPrice || '0') - parseFloat(b.productPrice || '0')
      );
    } else if (sort === 'price-desc') {
      updatedProducts.sort(
        (a, b) =>
          parseFloat(b.productPrice || '0') - parseFloat(a.productPrice || '0')
      );
    } else if (sort === 'name-asc') {
      updatedProducts.sort((a, b) =>
        (a.productTitle || '').localeCompare(b.productTitle || '')
      );
    } else if (sort === 'name-desc') {
      updatedProducts.sort((a, b) =>
        (b.productTitle || '').localeCompare(a.productTitle || '')
      );
    }

    return updatedProducts;
  };

  // Apply filtering, sorting, and searching using useMemo for performance
  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(products, filters, sort, searchQuery);
  }, [filters, sort, searchQuery, products]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handleSortChange = (newSort: string) => {
    const validSort: SortOptions = newSort as SortOptions; // Cast to SortOptions
    setSort(validSort);
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!products.length) return <p>No favorite products yet!</p>;

  return (
    <section className="products-lists-section pt-[31px] pb-[54px] md:pb-9 sm:pt-5 sm:pb-8 bg-[#F1F1F7]">
      <div className="custom-container">
        <div className="products-lists-wrapper">
          <div className="products-lists-main-cont flex items-start md:flex-col gap-6">
            <div className="products-list-main-right-cont">
              <div className="product-list-header mb-4 flex items-center justify-between gap-5 md:w-full">
                <div className="filter-area-box md:w-full flex items-center gap-8">
                  <div className="filter-search-with-searchbar flex items-center md:justify-between gap-4">
                    <SearchBar
                      filteredProducts={filteredProducts.length}
                      onSearch={handleSearch}
                    />
                  </div>
                </div>
                <div className="sorting-search md:hidden">
                  <Sorting onSortChange={handleSortChange} />
                </div>
              </div>
              <ProductList isLoggedIn={true} products={currentProducts} />
              <div className="product-lists-footer mt-[38px] md:mt-6 flex md:flex-row-reverse md:justify-between sm:flex-col sm:mt-4 items-center">
                <div className="pagination-wrapper ml-auto mr-auto md:mx-0">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
                <div className="showing-current-product">
                  <span className="caption pr-3 md:pr-1">Showing</span>
                  <span className="caption">
                    {startIndex + 1} to{' '}
                    {Math.min(
                      startIndex + productsPerPage,
                      filteredProducts.length
                    )}{' '}
                    of
                  </span>
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

export default FavoriteProductListing;
