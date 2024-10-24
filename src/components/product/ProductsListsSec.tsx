"use client";
import React, { useState, useEffect } from "react";
import FilterSidebar from "@/components/elements/search/FilterSidebar";
import Sorting from "@/components/elements/search/Sorting";
import ProductList from "@/components/product/ProductList";
import Pagination from "@/components/elements/Pagination";
// import SearchBar from "@/components/elements/search/SearchBar";
import { productData } from "@/libs/productData";
import { ArrowDownIcon, CloseIcon, FilterIcon } from "@/icons";


const ProductsListsSec = () => {
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

  const productsPerPage = 12; 

  useEffect(() => { 
    filterAndSortProducts(filters, sort, searchQuery);
    setTotalPages(Math.ceil(filteredProducts.length / productsPerPage));
    setCurrentPage(1); // Reset to first page on filter change
  }, [filters, sort,  products]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
  };

  // const handleSearch = (query) => {
  //   setSearchQuery(query);
  // };

const removeFilter = (filterType, value) => {
  setFilters((prevFilters) => ({
    ...prevFilters,
    [filterType]: prevFilters[filterType].filter((item) => item !== value),
  }));
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

    // // Search logic
    // if (query) {
    //   updatedProducts = updatedProducts.filter(
    //     (product) =>
    //       product.productTitle.toLowerCase().includes(query.toLowerCase()) ||
    //       product.category.toLowerCase().includes(query.toLowerCase()) ||
    //       product.subcategory.toLowerCase().includes(query.toLowerCase()) ||
    //       product.productBrand.toLowerCase().includes(query.toLowerCase()) ||
    //       product.productCondition.toLowerCase().includes(query.toLowerCase()) ||
    //       product.location.toLowerCase().includes(query.toLowerCase())
    //   );
    // }

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
          <div className="product-list-header mb-[23px] md:mb-4 flex items-center justify-between gap-5 w-full">
            <div className="filter-area-box flex items-center gap-8">
                    <div className="filter-sidebar-search hidden md:block">
                        <input id="my-drawer-filter" type="checkbox" className="drawer-toggle" /> 
                        <div className="drawer-content">
                          <label htmlFor="my-drawer-filter" className="drawer-button btn !outline-none !shadow-none !bg-transparent !p-0 !border-none">
                            Filter <FilterIcon />
                          </label>
                        </div>
                         <div className="drawer-side">
            <label htmlFor="my-drawer-filter" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="menu offcanvas-main-wrapper bg-mono-0 text-base-content min-h-full max-w-[430px] w-full p-0">
              <div className="offcanvas-head mini-cart-header-and-main-wrea min-h-full">
                <div className="minicart-header px-6">
                  <div className="cart-head-top border-b pt-5 pb-5 flex justify-between items-center border-b-mono-60">
                    <p className="eyebrow-large">Filter Search</p>
                    <label htmlFor="my-drawer-filter" aria-label="close sidebar" className="close-btn !border-0 !outline-none !shadow-none w-8 h-8 flex items-center justify-center cursor-pointer">
                      <CloseIcon />
                    </label>
                  </div>
                </div>

                <div className="filter-body-product-info px-6">
                   <div className="empty-product-listing-message my-auto py-12 hidden">
                    <p className='font-secondary font-medium text-body-caption text-center text-mono-100'>listing is empty</p>
                  </div>

                  <div className="cart-add-product-item-wrapper pt-4">
                     <div className="product-selected-category-lists  flex flex-wrap items-center gap-2">
                    {Object.keys(filters).map((filterType) => 
                      filters[filterType].map((filterValue, index) => (
                        <span key={index} className="selected-filter whitespace-nowrap flex items-center gap-0 h-8 bg-[#F4E8F9] caption text-primary-color-100 px-[8px] py-[4px] rounded-[16px]">
                          {filterValue}
                          <button
                            className="remove-filter p-[5px]"
                            onClick={() => removeFilter(filterType, filterValue)}
                          >
                            x
                          </button>
                        </span>
                      ))
                    )}
                 </div>

                  </div>
                </div>
              </div>

              <div className="offcanvas-main px-6 min-h-full mt-4 pb-8"> 
                <div className="cart-canvas-area min-h-full">
                    <FilterSidebar
               availableProducts={products}
               selectedFilters={filters} // Pass the current selected filters
               onFilterChange={handleFilterChange}
             />
                </div>
              </div>
            </div>
          </div>
                    </div>
                   <div className="product-selected-category-lists md:hidden flex flex-wrap items-center gap-2">
                    {Object.keys(filters).map((filterType) => 
                      filters[filterType].map((filterValue, index) => (
                        <span key={index} className="selected-filter whitespace-nowrap flex items-center gap-0 h-8 bg-[#F4E8F9] caption text-primary-color-100 px-[8px] py-[4px] rounded-[16px]">
                          {filterValue}
                          <button
                            className="remove-filter p-[5px]"
                            onClick={() => removeFilter(filterType, filterValue)}
                          >
                            x
                          </button>
                        </span>
                      ))
                    )}
                 </div>
            </div>
            <Sorting onSortChange={handleSortChange} />
          </div>
         
          <div className="products-lists-main-cont flex items-start md:flex-col gap-6">
            <div className="products-list-main-left-cont h-[100vh] sticky md:relative md:h-auto top-9 max-w-[220px] md:max-w-[160px] w-full md:hidden">  
              <FilterSidebar
               availableProducts={products}
               selectedFilters={filters} // Pass the current selected filters
               onFilterChange={handleFilterChange}
             />
            </div>
            <div className="products-list-main-right-cont">
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
              <span className="caption pr-3 md:pr-1">Showing</span> <span className="caption">{startIndex + 1} to {Math.min(startIndex + productsPerPage, filteredProducts.length)} of</span> <span className="caption-bold">{filteredProducts.length} products</span>
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
