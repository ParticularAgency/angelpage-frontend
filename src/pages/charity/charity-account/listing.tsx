import React, { useState } from 'react';
import ProductCard from '@/components/common/cards/product/postProductCard'; // Adjust the path as needed

const UsersProductListingArea = ({ products }) => {
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState(''); // State to track selected delivery time

  // Function to filter products based on the selected delivery time range
  const filterByDeliveryTime = (products) => {
    if (!selectedDeliveryTime) return products; // No filtering if no delivery time is selected

    const [minTime, maxTime] = selectedDeliveryTime.split('-').map(time => parseInt(time.trim(), 10));

    return products.filter(product => {
      const deliveryTime = product.averageDeliveryTime; // Assuming products have an `averageDeliveryTime` property in days
      return deliveryTime >= minTime && deliveryTime <= maxTime;
    });
  };
  const draftProducts = filterByDeliveryTime(products.filter(product => product.status === 'Draft'));
  const activeProducts = filterByDeliveryTime(products.filter(product => product.status === 'Active'));
  const removedProducts = filterByDeliveryTime(products.filter(product => product.status === 'Removed'));

  const handleDeleteConfirm = (productId: string) => {
    console.log(`Product with ID ${productId} deleted`);
    // Perform API call or state update to remove the product
  };

  return (
    <div className="product-handle-listing-area sm:bg-[#F1F1F7]"> 
        <div className="delivery-time-filter ml-auto flex mb-6 items-center justify-end sm:justify-start sm:items-start sm:flex-col sm:mb-0 sm:ml-0 sm:max-w-[250px] pt-6 sm:px-[5px]">
          <label htmlFor="deliveryTime" className="mr-2 sm:mb-3 body-bold-small whitespace-nowrap">Average delivery time:</label>
          <select
            id="deliveryTime"
            value={selectedDeliveryTime}
            className="!bg-transparent body-small"
            onChange={(e) => setSelectedDeliveryTime(e.target.value)} // Update state on selection
          >
            <option className='body-small' value="">All</option>
            <option className='body-small' value="2-5">2-5 business days</option>
            <option className='body-small' value="5-7">5-7 business days</option>
            <option className='body-small' value="7-12">7-12 business days</option>
          </select>
        </div>
      <div className="product-handle-listing-wrapper bg-[#F1F1F7] py-8 px-6 sm:px-[5px]"> 
        <div className="product-listing-type-item pb-[99px] md:pb-14 draft-product">
          <h5 className="product-listing-title eyebrow-medium uppercase mb-8">Drafts</h5>
          <div className="product-listing-list-area grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-4">
            {draftProducts.length > 0 ? (
              draftProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  productId={product.id}
                  charityImageSrc={product.charityImageSrc}
                  charityImageAlt={product.charityImageAlt}
                  productImageSrc={product.productImageSrc}
                  productImageAlt={product.productImageAlt}
                  productBrand={product.productBrand}
                  productTitle={product.productTitle}
                  productSize={product.productSize}
                  productPrice={product.productPrice}
                  location={product.location}
                  status={product.status}
                  averageDeliveryTime={product.averageDeliveryTime} // Include delivery time data
                  onFavoriteClick={() => console.log('Favorited')}
                  onDeleteConfirm={handleDeleteConfirm}
                  isLoggedIn={true}
                />
              ))
            ) : (
              <p>No Draft Products</p>
            )}
          </div>
        </div>

        {/* Active Products */}
        <div className="product-listing-type-item pb-[99px] active-product">
          <h5 className="product-listing-title eyebrow-medium uppercase mb-8">Active</h5>
          <div className="product-listing-list-area grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {activeProducts.length > 0 ? (
              activeProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  productId={product.id}
                  charityImageSrc={product.charityImageSrc}
                  charityImageAlt={product.charityImageAlt}
                  productImageSrc={product.productImageSrc}
                  productImageAlt={product.productImageAlt}
                  productBrand={product.productBrand}
                  productTitle={product.productTitle}
                  productSize={product.productSize}
                  productPrice={product.productPrice}
                  location={product.location}
                  status={product.status}
                  averageDeliveryTime={product.averageDeliveryTime} // Include delivery time data
                  onFavoriteClick={() => console.log('Favorited')}
                  onDeleteConfirm={handleDeleteConfirm}
                  isLoggedIn={true}
                />
              ))
            ) : (
              <p>No Active Products</p>
            )}
          </div>
        </div>

        {/* Removed Products */}
        <div className="product-listing-type-item pb-[99px] removed-product">
          <h5 className="product-listing-title eyebrow-medium uppercase mb-8">Removed</h5>
          <div className="product-listing-list-area grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {removedProducts.length > 0 ? (
              removedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  productId={product.id}
                  charityImageSrc={product.charityImageSrc}
                  charityImageAlt={product.charityImageAlt}
                  productImageSrc={product.productImageSrc}
                  productImageAlt={product.productImageAlt}
                  productBrand={product.productBrand}
                  productTitle={product.productTitle}
                  productSize={product.productSize}
                  productPrice={product.productPrice}
                  location={product.location}
                  status={product.status}
                  averageDeliveryTime={product.averageDeliveryTime} // Include delivery time data
                  onFavoriteClick={() => console.log('Favorited')}
                  onDeleteConfirm={handleDeleteConfirm}
                  isLoggedIn={true}
                />
              ))
            ) : (
              <p>No Removed Products</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UsersProductListingArea;
