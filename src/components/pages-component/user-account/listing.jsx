'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/common/cards/product/postProductCard';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import ProductSkeletonCard from '@/components/common/cards/product/productskeletonCard';

// Load English language data
countries.registerLocale(enLocale);


const UsersProductListingArea = () => {
  const { data: session } = useSession() || {};
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listingSearch, setListingSearch] = useState('');

  const fetchUserProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products/listings`,
        {
          params: { role: 'USER' },
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );

      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching user products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrArchive = async (productId, status) => {
    try {
      if (status === 'DRAFT' || status === 'PENDING_REVIEW' || status === 'REMOVED') {
        // Permanently delete a non-live product
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          }
        );
      } else if (status === 'LIVE') {
        // Archive a live product (set isArchived to true)
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
          { status: 'REMOVED' },
          {
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          }
        );
      }
      fetchUserProducts(); // Refresh the product list after the action
    } catch (error) {
      console.error(
        `Error ${status === 'DRAFT' ? 'deleting' : 'changing status'} product:`,
        error
      );
    }
  };

  const handleRelist = async productId => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/relist`,
        { quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );
      fetchUserProducts();
    } catch (error) {
      console.error('Error re-listing product:', error);
    }
  };

  useEffect(() => {
    if (session?.token) {
      fetchUserProducts();
    }
  }, [session?.token]);

  if (!session) {
    return <p>Please log in to view your products.</p>;
  }

  const filteredProducts = products.filter(p => {
    const q = listingSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.status || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );
  });

  const draftProducts = filteredProducts.filter(product => product.status === 'DRAFT');
  const pendingProducts = filteredProducts.filter(
    product => product.status === 'PENDING_REVIEW'
  );
  const activeProducts = filteredProducts.filter(product => product.status === 'LIVE');
  const removedProducts = filteredProducts.filter(
    product => product.status === 'REMOVED'
  );
  // const HolidayModeProducts = products.filter(product => product.isArchived);

  console.log('Removed Products:', removedProducts);

  const renderProductCard = (product, cardStatus, extraProps = {}) => {
    const sellerUserAddress = product.seller?.address;
    const sellerCharityAddress = product.charity?.address;
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
        key={product.id}
        productId={product.id}
        charityImageSrc={
          product?.charity?.profileImage ||
          '/images/icons/elisp-profile-default-img.svg'
        }
        charityImageAlt={product?.charity?.charityName}
        productBrand={product.brand}
        productTitle={product.name}
        productSize={product.size}
        productImageSrc={
          product.images[0]?.url ||
          '/images/products/card-placeholder-image.webp'
        }
        productImageAlt={product.images[0]?.altText || ''}
        productPrice={`${product.price}`}
        status={cardStatus}
        location={location}
        socialPosting={product.socialPosting}
        listingVideoUrl={product.videos?.[0]?.url || ''}
        authToken={session?.token}
        {...extraProps}
      />
    );
  };

  
  return (
    <div className="product-handle-listing-area sm:bg-[#F1F1F7]">
      {loading ? (
        <>
          <div className="skeleton-sec-area custom-container">
            <div className="grid grid-cols-12 gap-6 product-handle-listing-wrapper bg-[#F1F1F7] py-8 px-6 sm:px-[5px]">
              <div className="col-span-3 sm:col-span-full">
                <ProductSkeletonCard />
              </div>
              <div className="col-span-3 sm:hidden">
                <ProductSkeletonCard />
              </div>
              <div className="col-span-3 md:hidden">
                <ProductSkeletonCard />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="product-handle-listing-wrapper bg-[#F1F1F7] py-8 px-6 sm:px-[5px]">
          <div className="mb-6">
            <input
              type="search"
              value={listingSearch}
              onChange={e => setListingSearch(e.target.value)}
              placeholder="Search listings by name, category, or status…"
              className="w-full max-w-md h-10 px-4 rounded-xl border border-[#E6E3E7] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#611192]/30"
            />
          </div>
          {/* Draft Products */}
          <div className="product-listing-type-item pb-[99px] draft-product">
            <h5 className="product-listing-title eyebrow-medium uppercase mb-8">
              Drafts
            </h5>
            <div className="product-listing-list-area grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-4">
              {draftProducts.length > 0 ? (
                draftProducts.map(product =>
                  renderProductCard(product, 'DRAFT', {
                    isArchived: false,
                    onEdit: () =>
                      router.push(`/product/post-product?edit=${product.id}`),
                    onDelete: () => handleDeleteOrArchive(product.id, 'DRAFT'),
                  })
                )
              ) : (
                <p>No Draft Products</p>
              )}
            </div>
          </div>

          {pendingProducts.length > 0 && (
            <div className="product-listing-type-item pb-[99px] pending-product">
              <h5 className="product-listing-title eyebrow-medium uppercase mb-8">
                Pending review
              </h5>
              <div className="product-listing-list-area grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-4">
                {pendingProducts.map(product =>
                  renderProductCard(product, 'PENDING_REVIEW', {
                    isArchived: false,
                    onEdit: () =>
                      router.push(`/product/post-product?edit=${product.id}`),
                    onDelete: () =>
                      handleDeleteOrArchive(product.id, 'PENDING_REVIEW'),
                  })
                )}
              </div>
            </div>
          )}

          {/* Active Products */}
          <div className="product-listing-type-item pb-[99px] active-product">
            <h5 className="product-listing-title eyebrow-medium uppercase mb-8">
              Active
            </h5>
            <div className="product-listing-list-area grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {activeProducts.length > 0 ? (
                activeProducts.map(product =>
                  renderProductCard(product, 'LIVE', {
                    isArchived: false,
                    onEdit: () =>
                      router.push(`/product/post-product?edit=${product.id}`),
                    onArchive: () =>
                      handleDeleteOrArchive(product.id, 'LIVE'),
                  })
                )
              ) : (
                <p>No Active Products</p>
              )}
            </div>
          </div>

          {/* Removed Products */}
          <div className="product-listing-type-item pb-[99px] removed-product">
            <h5 className="product-listing-title eyebrow-medium uppercase mb-8">
              Removed
            </h5>
            <div className="product-listing-list-area grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {removedProducts.length > 0 ? (
                removedProducts.map(product =>
                  renderProductCard(product, 'REMOVED', {
                    isArchived: true,
                    onRelist: () => handleRelist(product.id),
                    onDelete: () => handleDeleteOrArchive(product.id, 'REMOVED'),
                  })
                )
              ) : (
                <p>No Removed Products</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersProductListingArea;
