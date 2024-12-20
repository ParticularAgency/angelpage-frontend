import React from 'react';
import ProductCard from '@/components/common/cards/product/productCard'; 
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
countries.registerLocale(enLocale);



const ProductList  = ({ products, isLoggedIn }) => {
  return (
    <div className="product-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products && products.length > 0 ? (
        products.map((product, index) => {
           if (!product) {
             return null; 
           }
          // Safely extract location
          const sellerUserAddress = product.seller?.address;
          const sellerCharityAddress = product.charity?.address;

          // Determine which address to use (User or Charity)
          const sellerAddress = sellerUserAddress || sellerCharityAddress;

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
              id={product._id} // Use `product.id` instead of `item.id`
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
              location={location}
              dimensionHeight={product.dimensionHeight || '0in'}
              dimensionWidth={product.dimensionWidth || '0in'}
              isLoggedIn={isLoggedIn}
              status={product.status}
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
