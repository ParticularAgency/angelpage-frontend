import React from 'react';
import ProductCard from '@/components/common/cards/product/productCard'; // Ensure the path is correct
import { Product } from '@/types/productTypes';
import countries from 'i18n-iso-countries';
// Load English language data
import enLocale from 'i18n-iso-countries/langs/en.json';
countries.registerLocale(enLocale);

interface ProductListProps {
  products: Product[];
  isLoggedIn: boolean; // Corrected type to `boolean` for better clarity
}

const ProductList: React.FC<ProductListProps> = ({ products, isLoggedIn }) => {
  return (
    <div className="product-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products && products.length > 0 ? (
        products.map((product, index) => {
          // Safely extract location
          const sellerAddress = product.seller?.address;
          let countryCode = 'N/A';
          if (sellerAddress?.country) {
            countryCode =
              countries.getAlpha2Code(sellerAddress.country, 'en') || 'N/A';
          }

          const location = sellerAddress
            ? `${sellerAddress.city || 'Unknown City'}, ${countryCode}`
            : 'Location Not Available';

          return (
            <ProductCard
              key={product.id || `product-${index}`} // Use index as fallback key
              id={product.id.toString()} // Use `product.id` instead of `item.id`
              charityImageSrc={
                product.charity?.profileImage ||
                '/images/icons/elisp-profile-default-img.svg'
              }
              charityImageAlt={product.charity?.charityName || 'Charity Image'}
              images={product.images || []}
              brand={product.brand || 'Unknown Brand'}
              name={product.name || 'Untitled Product'}
              size={product.size || ''}
              price={`${product.price || '0.00'}`}
              location={location}
              dimensionHeight={product.dimensionHeight || '0in'} // Use `product.dimensionHeight`
              dimensionWidth={product.dimensionWidth || '0in'} // Use `product.dimensionWidth`
              isLoggedIn={isLoggedIn}
            />
          );
        })
      ) : (
        <div className="text-center text-gray-600">No products found</div>
      )}
    </div>
  );
};

export default ProductList;
