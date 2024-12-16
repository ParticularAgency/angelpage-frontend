'use client';
import React, { useState, useMemo } from 'react';
import Sorting from '@/components/elements/search/Sorting';
import ProductList from '@/components/product/ProductList';
import Pagination from '@/components/elements/Pagination';
import SearchBar from '@/components/elements/search/SearchBar';
import { Product } from '@/types/productTypes';

interface FavoriteProductListingProps {
  products: Product[];
}

const FavoriteProductListing: React.FC<FavoriteProductListingProps> = ({
  products = [],
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const productsPerPage = 10;

  const filterAndSortProducts = (
    products: Product[],
    sort: string,
    query: string
  ) => {
    let updatedProducts = [...products];

    // Search logic
    if (query) {
      updatedProducts = updatedProducts.filter(
        product =>
          product.name?.toLowerCase().includes(query.toLowerCase()) ||
          product.category?.toLowerCase().includes(query.toLowerCase())
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

    return updatedProducts;
  };

  // Apply filtering, sorting, and searching using useMemo for performance
  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(products, sort, searchQuery);
  }, [sort, searchQuery, products]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setCurrentPage(1);
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
