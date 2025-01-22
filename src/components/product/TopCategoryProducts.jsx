'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '../elements';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard from '../common/cards/product/productCard';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import ProductSkeletonCard from '../common/cards/product/productskeletonCard';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
countries.registerLocale(enLocale);

const TopCategoryProducts = ({ secClassName }) => {
  const { data: session } = useSession() || {};
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const headers = {};
        if (session?.token) {
          headers.Authorization = `Bearer ${session.token}`;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/listing/latest-products`,
          {
            params: { isArchived: false, status: 'LIVE' },
            headers,
          }
        );
        setProductData(response.data.products);
      } catch (err) {
        setError('');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [session]);

  // if (loading) return <ProductSkeletonCard />;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <section
      className={`product-section ${secClassName || 'bg-[#f1f1f7] pt-[31px]'}`}
    >
      <div className="custom-container">
        <div className="product-sec-title-box mb-10 flex sm:flex-col items-start justify-between gap-4">
          <div className="product-title-box-left-cont">
            <h4 className="title h4">Shop now to support a great cause</h4>
            <p className="body-small mt-2">
              Want to support a charity or a cause important to you? Take a look
              at the items available.
            </p>
          </div>
          <div className="product-title-box-right-cont sm:hidden pt-2">
            <Link href="/product">
              <Button
                variant="primary"
                onClick={() => console.log('View all clicked')}
              >
                View all
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="custom-container md:!pr-0">
        <div className="product-slides-area pr-[16px] pl-[10px] sm:pr-8 sm:pl-0 overflow-hidden">
          <Swiper
            spaceBetween={20}
            slidesPerView={2}
            navigation
            modules={[Navigation, Autoplay]}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 10 },
              768: { slidesPerView: 3, spaceBetween: 15 },
              1024: { slidesPerView: 5, spaceBetween: 19 },
            }}
          >
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <SwiperSlide key={`skeleton-${index}`}>
                    <ProductSkeletonCard />
                  </SwiperSlide>
                ))
              : productData.map(item => {
                  // Safely extract location
                  const sellerUserAddress = item.seller?.address;
                  const sellerCharityAddress = item.charity?.address;

                  // Determine which address to use (User or Charity)
                  const sellerAddress =
                    sellerUserAddress || sellerCharityAddress;

                  let countryCode = 'N/A';
                  if (sellerAddress?.country) {
                    countryCode =
                      countries.getAlpha2Code(sellerAddress.country, 'en') ||
                      'N/A';
                  }

                  const location = sellerAddress
                    ? `${sellerAddress.city || 'Unknown City'}, ${countryCode}`
                    : 'Location Not Available';

                  return (
                    <SwiperSlide key={item.id}>
                      <ProductCard
                        {...item}
                        id={item._id}
                        charityImageSrc={item.charity?.profileImage}
                        charityImageAlt={
                          item.charity?.charityName || 'Charity Image'
                        }
                        dimensionHeight={item.dimensions?.height || '0in'}
                        dimensionWidth={item.dimensions?.width || '0in'}
                        location={location}
                        isLoggedIn={!!session?.token}
                        status={item.status}
                      />
                    </SwiperSlide>
                  );
                })}
          </Swiper>
          <div className="product-btn-box hidden sm:flex justify-center pt-8">
            <Link href="/product">
              <Button
                variant="primary"
                onClick={() => console.log('View all clicked')}
              >
                View all
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopCategoryProducts;
