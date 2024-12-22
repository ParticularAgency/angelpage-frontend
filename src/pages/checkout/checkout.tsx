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
  addresses: { city: string; country: string }[];
}
interface Charity {
  charityName: string;
  charityID: string;
  profileImage: string;
  addresses: { city: string; country: string }[];
}
interface Product {
  _id: string;
  name: string;
  price: number;
  brand: string;
  size?: string;
  condition?: string;
  images: Array<{ url: string; altText?: string }>;
  location?: string;
  charity: Charity;
  dimensions?: {
    height?: string;
    width?: string;
  };
  seller: Seller;
}

interface CartItem {
  productId: Product;
  quantity: number;
}

interface CartResponse {
  cart: {
    items: CartItem[];
  };
}

const BasketPage = () => {
  const { data: session } = useSession() || {};
  const userId = session?.user?.id;
  const token = session?.token;
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isCartLoading, setIsCartLoading] = useState(true);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch cart items for the user
  const fetchCartItems = async () => {
    if (!userId || !token) return;

    try {
      setIsCartLoading(true);
      const response = await axios.get<CartResponse>(
        `${API_BASE_URL}/cart/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(response.data.cart.items || []);
    } catch (error) {
      console.error('Failed to load cart. Please try again.', error);
    } finally {
      setIsCartLoading(false);
    }
  };

  // Fetch cart items on component mount or session change
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
                  isLoading={isCartLoading}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                />
                <div className="shipping-and-payment-information">
                  <ShippingAddress  />
                  <div className="payment-info-wrapper pt-10">
                    <PaymentMethodsArea  />
                  </div>
                </div>
              </div>

              <BasketArea
                cartItems={cartItems}
                onPay={handlePayment}
                isLoading={isCartLoading}
              />
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default BasketPage;
