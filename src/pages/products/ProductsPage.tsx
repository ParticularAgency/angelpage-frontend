import ProductBannerSec from '@/components/banner/ProductBannerSec'
import ProductsListsSec from '@/components/product/ProductsListsSec'
import React from 'react'

const ProductsPage = () => {
  return (
    <div className="products-page-main-wrapper">
      <ProductBannerSec />
       <ProductsListsSec />
    </div>
  )
}

export default ProductsPage
