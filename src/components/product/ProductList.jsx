'use client';
import React from 'react';
import ProductCard from '@/components/common/cards/product/productCard';
import { Button } from '../elements';
import Link from 'next/link';
import { formatProductLocation } from '@/lib/productLocation';

const ProductList = ({ products, isLoggedIn }) => {
  return (
    <>
      {products && products.length > 0 ? (

    <div className="product-list grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
       { products.map((product, index) => {
          if (!product) {
            return null;
          }

          const location = formatProductLocation(product.seller, product.charity);

          return (
            <ProductCard
              key={product.id || `product-${index}`}
              id={product._id}
              slug={product.slug}
              charityImageSrc={
                product.charity?.profileImage ||
                '/images/icons/elisp-profile-default-img.svg'
              }
              charityImageAlt={product.charity?.charityName || 'Charity Image'}
              images={
                product.images || '/images/products/card-placeholder-image.webp'
              }
              brand={product.brand || 'Unknown Brand'}
              name={product.name || 'Untitled Product'}
              size={product.size || ''}
              price={`${product.price || '0.00'}`}
              charityProfit={product.charityProfit}
              sellerSharePercent={product.sellerSharePercent ?? 0}
              fulfillmentType={product.fulfillmentType || 'uk_shipping'}
              sellAreas={product.sellAreas || []}
              location={location}
              dimensionHeight={product.dimensions?.height || ''}
              dimensionWidth={product.dimensions?.width || ''}
              status={product.status}
              isLoggedIn={isLoggedIn}
            />
          );
        })}
    </div>
    ) : (
        <div className="not-found-screen-design flex flex-col items-center pt-12 pb-12 custom-container">
          <h5 className="body-bold-medium text-mono-100 font-medium font-secondary mb-2 text-center">
            No products listed!
          </h5>
          <p className="body-regular font-secondary font-regular text-mono-90 text-center max-w-[620px] w-full mx-auto">
            Currently, there are no products available in this store. Please
            return to the homepage for more store.
          </p>
          <Link href="/">
            <Button variant="primary" className="mx-auto mt-6">
              Return Home
            </Button>
          </Link>
        </div>
      )}
      </>
  );
};

export default ProductList;
