'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BannerSection from './Banner';
import BasketArea from './BasketArea';
import CheckoutProductItem from './CheckoutProductItem';
import ShippingAddress from './ShippingAddress';
import PaymentMethodsArea from './PaymentMethods';
import CheckoutLoaderScreen from './loader/Loader';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface Seller {
  firstName: string;
  lastName: string;
  profileImage: string;
  addresses: { city: string; country: string }[]; // Fixed to be an array of objects
}

interface Product {
  _id: string; // Backend uses _id
  name: string;
  price: number;
  brand: string;
  size?: string;
  condition?: string;
  images: Array<{ url: string; altText?: string }>;
  location?: string;
  charity: {
    charityName: string;
    profileImage: string;
  };
  seller: Seller;
}

interface CartItem {
  productId: Product; // Refers to the actual Product object
  quantity: number;
}

interface CartResponse {
  cart: {
    items: CartItem[];
  };
}

const BasketPage = () => {
  const { data: session } = useSession() || {};
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchCartItems = async () => {
    if (!session?.token) return;

    try {
      const response = await axios.get<CartResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/${session.user.id}`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      const itemsWithDefaults = response.data.cart.items.map(item => ({
        ...item,
        productId: {
          ...item?.productId,
          brand: item?.productId?.brand || 'Unknown Brand',
          seller: {
            ...item.productId?.seller,
            profileImage:
              item?.productId?.seller?.profileImage ||
              '/images/default-profile.png',
            addresses: Array.isArray(item.productId?.seller?.addresses)
              ? item?.productId?.seller?.addresses.map(address => ({
                  city: address?.city || 'Unknown City',
                  country: address?.country || 'Unknown Country',
                }))
              : [], // Default to an empty array if not provided
          },
        },
      }));

      setCartItems(itemsWithDefaults);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [session]);

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/checkout/confirmation');
    }, 2000);
  };

  return (
    <div className="basket-page-main-wrapper">
      <div className="custom-container max-w-[1008px]">
        {loading ? (
          <div className="loader-page-screen h-[80vh]">
            <BannerSection />
            <CheckoutLoaderScreen loading={loading} />
          </div>
        ) : (
          <>
            <BannerSection />
            <section className="basket-page-main-content-grid grid grid-cols-12 gap-5">
              <div className="basket-page-left-cont col-span-7 md:col-span-6 sm:col-span-full">
                <CheckoutProductItem
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                />
                <div className="shipping-and-payment-information">
                  <ShippingAddress />
                  <div className="payment-info-wrapper pt-10">
                    <PaymentMethodsArea />
                  </div>
                </div>
              </div>

              <BasketArea cartItems={cartItems} onPay={handlePayment} />
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default BasketPage;
