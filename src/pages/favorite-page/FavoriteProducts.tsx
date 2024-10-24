"use client";
import React, { useState, useEffect } from "react";
import Sorting from "@/components/elements/search/Sorting";
import ProductList from "@/components/product/ProductList";
import Pagination from "@/components/elements/Pagination";
import SearchBar from "@/components/elements/search/SearchBar";
import { productData } from "@/libs/productData";


const FavoriteProductListing = () => {
  const [products] = useState(productData); // Original product data
  const [filteredProducts, setFilteredProducts] = useState(productData);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: [],
    subCategory: [],
    productBrand: [],
    productCondition: [],
  });
  const [sort, setSort] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const productsPerPage = 10; 

  useEffect(() => {
    filterAndSortProducts(filters, sort, searchQuery);
    setTotalPages(Math.ceil(filteredProducts.length / productsPerPage));
    setCurrentPage(1); // Reset to first page on filter or search change
  }, [filters, sort, products, searchQuery]);


  const handleSortChange = (newSort) => {
    setSort(newSort);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };



  const filterAndSortProducts = (filters, sort, query) => {
    let updatedProducts = [...products];

    // Filter logic
    if (filters.category.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        filters.category.includes(product.category)
      );
    }
    if (filters.subCategory.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        filters.subCategory.includes(product.subcategory)
      );
    }
    if (filters.productBrand.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        filters.productBrand.includes(product.productBrand)
      );
    }
    if (filters.productCondition.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        filters.productCondition.includes(product.productCondition)
      );
    }

    // Search logic
    if (query) {
      updatedProducts = updatedProducts.filter(
        (product) =>
          product.productTitle.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.subcategory.toLowerCase().includes(query.toLowerCase()) ||
          product.productBrand.toLowerCase().includes(query.toLowerCase()) ||
          product.productCondition.toLowerCase().includes(query.toLowerCase()) ||
          product.location.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Sort logic
    if (sort === "price-asc") {
      updatedProducts.sort((a, b) => parseFloat(a.productPrice) - parseFloat(b.productPrice));
    } else if (sort === "price-desc") {
      updatedProducts.sort((a, b) => parseFloat(b.productPrice) - parseFloat(a.productPrice));
    } else if (sort === "name-asc") {
      updatedProducts.sort((a, b) => a.productTitle.localeCompare(b.productTitle));
    } else if (sort === "name-desc") {
      updatedProducts.sort((a, b) => b.productTitle.localeCompare(a.productTitle));
    }

    setFilteredProducts(updatedProducts);
    setTotalPages(Math.ceil(updatedProducts.length / productsPerPage));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  return (
    <section className="products-lists-section pt-[31px] pb-[54px] md:pb-9 sm:pt-5 sm:pb-8 bg-[#F1F1F7]">
      <div className="custom-container">
        <div className="products-lists-wrapper">
          <div className="products-lists-main-cont flex items-start md:flex-col gap-6">
            <div className="products-list-main-right-cont">
              <div className="product-list-header mb-4 flex items-center justify-between gap-5 md:w-full">
            <div className="filter-area-box md:w-full flex items-center gap-8">
              <div className="filter-search-with-searchbar w-full flex items-center md:justify-between gap-4">
                <SearchBar filteredProducts={filteredProducts.length} onSearch={handleSearch} />
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
                  <span className="caption pr-3 md:pr-1">Showing</span>{" "}
                  <span className="caption">{startIndex + 1} to {Math.min(startIndex + productsPerPage, filteredProducts.length)} of</span>{" "}
                  <span className="caption-bold">{filteredProducts.length} products</span>
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
