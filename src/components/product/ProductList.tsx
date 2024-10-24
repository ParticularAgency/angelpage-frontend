// ProductList.tsx
import React from 'react';
import ProductCard from '@/components/common/cards/product/productCard'; // Assuming you have a ProductCard component

// Define the product type
interface Product {
  charityImageSrc: string;
  charityImageAlt: string;
  productImageSrc: string;
  productImageAlt: string;
  productBrand: string;
  productTitle: string;
  productSize: string;
  productPrice: string;
  location: string;
}

// Define props for the ProductList component
interface ProductListProps {
  products: Product[];  // Array of Product type
  isLoggedIn: boolean;  // Boolean for logged-in status
}

const ProductList: React.FC<ProductListProps> = ({ products, isLoggedIn }) => {
    const handleFavoriteClick = (index: number) => {
  console.log(`Favorite clicked on product ${index}`);
};
  return (
    <div className="product-list">
      {products.length > 0 ? (
        products.map((product, index) => (
          <ProductCard
            key={index}
            charityImageSrc={product.charityImageSrc}
            charityImageAlt={product.charityImageAlt}
            productImageSrc={product.productImageSrc}
            productImageAlt={product.productImageAlt}
            productBrand={product.productBrand}
            productTitle={product.productTitle}
            productSize={product.productSize}
            productPrice={product.productPrice}
            handleFavoriteClick={handleFavoriteClick}
            location={product.location}
            isLoggedIn={isLoggedIn}
          />
        ))
      ) : (
        <div>No products found</div>
      )}
    </div>
  );
};

export default ProductList;

