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
import { ToastService } from '@/components/elements/notifications/ToastService';

// interface Seller {
//   firstName: string;
//   lastName: string;
//   profileImage: string;
//   addresses: { city: string; country: string }[];
// }
// interface Charity {
//   charityName: string;
//   charityID: string;
//   profileImage: string;
//   addresses: { city: string; country: string }[];
// }
// interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   brand: string;
//   size?: string;
//   condition?: string;
//   images: Array<{ url: string; altText?: string }>;
//   location?: string;
//   charity: Charity;
//   dimensions?: {
//     height?: string;
//     width?: string;
//   };
//   seller: Seller;
// }

// interface CartItem {
//   productId: Product; // Refers to the actual Product object
//   quantity: number;
// }

// interface CartResponse {
//   cart: {
//     items: CartItem[];
//   };
// }

const BasketPage = () => {
  const { data: session } = useSession() || {};
  const userId = session?.user?.id;
  const token = session?.token;

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(true);

  //  const [carriers, setCarriers] = useState([]);
  //  const [services, setServices] = useState([]);
  //  const [selectedCarrier, setSelectedCarrier] = useState('');
  //  const [selectedService, setSelectedService] = useState('');

  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCartItems = async () => {
    if (!userId || !token) return;

    try {
      setIsCartLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/cart/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(response.data.cart.items || []);
    } catch (error) {
      console.error('Failed to load cart.', error);
    } finally {
      setIsCartLoading(false);
    }
  };


  const handlePayment = async () => {
    try {
      if (
        !selectedAddress ||
        !selectedPaymentMethod

      ) {
        alert('Please complete all selections.');
        return;
      }

      const orderPayload = {
        buyerId: userId,
        products: cartItems.map(item => {
          const product = item.productId;
          const sellerId = product.seller?._id || product.charity?._id;
          const charityId = product.charity?._id;

          if (!product || !product._id || !charityId || !item.quantity) {
            throw new Error('Incomplete product information.');
          }

          const totalCost = product.price * item.quantity;

          return {
            productId: product._id,
            name: product.name,
            price: product.price,
            seller: sellerId,
            charity: charityId,
            quantity: item.quantity,
            totalProductCost: totalCost,
            charityProfit: totalCost * 0.9,
            adminFee: totalCost * 0.1,
          };
        }),
        totalAmount: cartItems.reduce(
          (total, item) => total + item.quantity * item.productId.price,
          0
        ),
        shippingAddress: selectedAddress,
        paymentMethod: selectedPaymentMethod,
        // carrierCode: selectedCarrier,
        // serviceCode: selectedService, 
      };

      const response = await axios.post(
        `${API_BASE_URL}/order/create`,
        orderPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
          const { order } = response.data; // Extract the order object from the response
          ToastService.success('Order placed successfully!');
          router.push(`/checkout/confirmation/${order._id}`);

      }
    } catch (error) {
      console.error(
        'Error creating order:',
        error.response?.data || error.message
      );
      alert('Failed to create order.');
    }
  };
  // Use Effects
  useEffect(() => {
    if (session) {
      fetchCartItems();
      // fetchCarriers();
    }
  }, [session]);

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
                  <ShippingAddress setSelectedAddress={setSelectedAddress} />
                  <PaymentMethodsArea
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                  />
                </div>
              </div>

              <BasketArea
                cartItems={cartItems}
                onPay={handlePayment}
                isLoading={isCartLoading}
              />

              {/* <div className="carrier-selection col-span-6">
                <h3>Select Carrier</h3>
                <select onChange={handleCarrierChange} value={selectedCarrier}>
                  <option value="" disabled>
                    Select a carrier
                  </option>
                  {carriers.map(carrier => (
                    <option key={carrier.code} value={carrier.code}>
                      {carrier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="service-selection col-span-6">
                <h3>Select Service</h3>
                <select
                  onChange={handleServiceChange}
                  value={selectedService}
                  disabled={!services.length}
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  {services.map(service => (
                    <option key={service.code} value={service.code}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div> */}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default BasketPage;
