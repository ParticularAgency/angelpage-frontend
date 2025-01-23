// 'use client';
// import React from 'react';
// import ProductCard from '@/components/common/cards/product/productCard';
// import countries from 'i18n-iso-countries';
// import enLocale from 'i18n-iso-countries/langs/en.json';
// import Link from 'next/link';
// import { Button } from '../elements';

// // Register country locale
// countries.registerLocale(enLocale);

// const ProductList = ({ products = [], isLoggedIn }) => {
//   return (
//     <>
//       {products && products.length > 0 ? (
//         <div className="product-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {products.map((product, index) => {
//             if (!product) {
//               return null;
//             }

//             // Safely extract location
//             const sellerUserAddress = product.seller?.address;
//             const sellerCharityAddress = product.charity?.address;

//             // Determine which address to use (User or Charity)
//             const sellerAddress = sellerUserAddress || sellerCharityAddress;

//             let countryCode = 'N/A';
//             if (sellerAddress?.country) {
//               countryCode =
//                 countries.getAlpha2Code(sellerAddress.country, 'en') || 'N/A';
//             }

//             const location = sellerAddress
//               ? `${sellerAddress.city || 'Unknown City'}, ${countryCode}`
//               : 'Not available';

//             return (
//               <ProductCard
//                 key={product.id || `product-${index}`} // Use index as fallback key
//                 id={product._id} // Use `product.id` instead of `item.id`
//                 charityImageSrc={
//                   product.charity?.profileImage ||
//                   '/images/icons/elisp-profile-default-img.svg'
//                 }
//                 charityImageAlt={
//                   product.charity?.charityName || 'Charity Image'
//                 }
//                 images={
//                   product.images || [
//                     '/images/products/card-placeholder-image.webp',
//                   ]
//                 }
//                 brand={product.brand || 'Unknown Brand'}
//                 name={product.name || 'Untitled Product'}
//                 size={product.size || ''}
//                 price={`${product.price || '0.00'}`}
//                 location={location}
//                 dimensionHeight={product.dimensions?.height || '0in'}
//                 dimensionWidth={product.dimensions?.width || '0in'}
//                 status={product.status}
//                 isLoggedIn={isLoggedIn}
//               />
//             );
//           })}
//         </div>
//       ) : (
//         <div className="not-found-screen-design flex flex-col items-center pt-12 pb-12 custom-container">
//           <h5 className="body-bold-medium text-mono-100 font-medium font-secondary mb-2 text-center">
//             No products listed!
//           </h5>
//           <p className="body-regular font-secondary font-regular text-mono-90 text-center max-w-[620px] w-full mx-auto">
//             Currently, there are no products available in this store. Please
//             return to the homepage for more store.
//           </p>
//           <Link href="/">
//             <Button variant="primary" className="mx-auto mt-6">
//               Return Home
//             </Button>
//           </Link>
//         </div>
//       )}
//     </>
//   );
// };

// export default ProductList;
'use client';
import React from 'react';
import ProductCard from '@/components/common/cards/product/productCard';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { Button } from '../elements';
import Link from 'next/link';
countries.registerLocale(enLocale);

const ProductList = ({ products, isLoggedIn }) => {
  return (
    <>
      {products && products.length > 0 ? (

    <div className="product-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
       { products.map((product, index) => {
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
            : 'Not Available';

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
              dimensionHeight={product.dimensions?.height || '0in'}
              dimensionWidth={product.dimensions?.width || '0in'}
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
