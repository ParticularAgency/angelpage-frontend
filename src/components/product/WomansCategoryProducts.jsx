'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '../common/cards/product/productCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import ProductSkeletonCard from '../common/cards/product/productskeletonCard';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
countries.registerLocale(enLocale);

const WomansCategoryProducts = ({ secClassName }) => {
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
          `${process.env.NEXT_PUBLIC_API_URL}/products/category/women`,
          {
            params: { isArchived: false, status: 'LIVE' },
            headers,
          }
        );
        console.log(response.data.products);
        setProductData(response.data.products);
      } catch (err) {
        setError('');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [session]);

  // if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <section
      className={`product-section ${secClassName || 'bg-[#f1f1f7] pt-[75px] pb-[83px] sm:pt-16'}`}
    >
      <div className="custom-container">
        <div className="product-sec-title-box mb-10 flex items-start justify-between gap-4">
          <div className="product-title-box-left-cont">
            <h4 className="title h4">Shop Woman’s</h4>
          </div>
        </div>
      </div>
      <div className="custom-container md:!pr-0">
        <div className="product-slides-area pr-[20px] pl-[10px] sm:pr-8 sm:pl-0 overflow-hidden">
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
                    : 'Not available';

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
        </div>
      </div>
    </section>
  );
};

export default WomansCategoryProducts;
