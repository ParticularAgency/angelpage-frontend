'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import ProductBannerSec from '@/components/banner/ProductBannerSec';
import ProductsListsSec from '@/components/product/ProductsListsSec';

const ProductsPage = () => {
  const searchParams = useSearchParams();


  const category = searchParams?.get('category') || 'All Products';
  const subcategory = searchParams?.get('subcategory') || undefined;

  return (
    <div className="products-page-main-wrapper">
      <ProductBannerSec category={category} subcategory={subcategory} />
      <ProductsListsSec category={category} subcategory={subcategory} />
    </div>
  );
};

export default ProductsPage;
