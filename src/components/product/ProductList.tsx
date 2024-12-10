import React from 'react';
import ProductCard from '@/components/common/cards/product/productCard'; // Ensure the path is correct
import { Product } from '@/types/productTypes';

interface ProductListProps {
  products: Product[]; // Now uses the same `Product` type
  isLoggedIn: boolean; // Ensure this prop is required
}

const ProductList: React.FC<ProductListProps> = ({ products, isLoggedIn }) => {
  // Function to handle when a product is favorited
  // const handleFavoriteClick = (productTitle: string) => {
  //   console.log(`${productTitle} added to favorites`);
  //   // Additional logic for handling favorites can go here (e.g., API calls)
  // };

  return (
    <div className="product-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.length > 0 ? (
        products.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            charityImageSrc={product.charityImageSrc ?? ''}
            charityImageAlt={product.charityImageAlt ?? ''}
            productImageSrc={product.productImageSrc ?? ''}
            productImageAlt={product.productImageAlt ?? ''}
            productBrand={product.productBrand ?? ''}
            productTitle={product.productTitle ?? ''}
            productSize={product.productSize ?? ''}
            productPrice={product.productPrice ?? ''}
            // onFavoriteClick={() =>
            //   handleFavoriteClick(product.productTitle ?? '')
            // }
            location={product.location ?? ''}
            isLoggedIn={isLoggedIn ?? ''} // Pass down the isLoggedIn status
          />
        ))
      ) : (
        <div>No products found</div> // User-friendly message for no products
      )}
    </div>
  );
};

export default ProductList;
