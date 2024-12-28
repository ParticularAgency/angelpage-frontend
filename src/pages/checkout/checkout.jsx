'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import BannerSection from './Banner';
import BasketArea from './BasketArea';
import CheckoutProductItem from './CheckoutProductItem';
import ShippingAddress from './ShippingAddress';
import PaymentMethodsArea from './PaymentMethods';
import CheckoutLoaderScreen from './loader/Loader';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { ToastService } from '@/components/elements/notifications/ToastService';
import { fetchCart } from '../../store/cartSlice';

const BasketPage = () => {
  const { data: session } = useSession() || {};
  const userId = session?.user?.id;
  const token = session?.token;

  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const cartStatus = useSelector(state => state.cart.status);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [loading] = useState(false);

//   const [carriers, setCarriers] = useState([]);
//   const [selectedCarrier, setSelectedCarrier] = useState('');
// const [services, setServices] = useState([]);
// const [packages, setPackages] = useState([]);
// const [selectedService, setSelectedService] = useState('');
// const [selectedPackage, setSelectedPackage] = useState('');


  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch cart on component mount
  useEffect(() => {
    if (userId && token) {
      dispatch(fetchCart({ userId, token }));
    }
  }, [userId, token, dispatch]);


  const handlePayment = async () => {
    try {
      if (!selectedAddress || !selectedPaymentMethod) {
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
  const isCartLoading = cartStatus === 'loading';

//   // Fetch available carriers from ShipStation
//    const fetchCarriers = async () => {
//      try {
//        const response = await axios.get(`${API_BASE_URL}/order/carrier`, {
//          headers: {
//            Authorization: `Bearer ${token}`,
//          },
//        });
//        setCarriers(response.data.carriers || []);
//      } catch (error) {
//        console.error('Failed to fetch carriers:', error);
//      }
//    };
// const fetchServices = async carrierCode => {
//   try {
//     const response = await axios.get(
//       `${API_BASE_URL}/order/carriers/${carrierCode}/services`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     setServices(response.data.services || []);
//   } catch (error) {
//     console.error(
//       'Failed to fetch services:',
//       error.response?.data || error.message
//     );
//     ToastService.error('Failed to fetch services.');
//   }
// };


// const fetchPackages = async carrierCode => {
//   try {
//     const response = await axios.get(
//       `${API_BASE_URL}/order/carriers/${carrierCode}/packages`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     setPackages(response.data.packages || []);
//   } catch (error) {
//     console.error(
//       'Failed to fetch packages:',
//       error.response?.data || error.message
//     );
//     ToastService.error('Failed to fetch packages.');
//   }
// };

//    useEffect(() => {
//      fetchCarriers();
//      fetchServices();
//    }, [session]);
//   const handleCarrierChange = e => {
//     const carrierCode = e.target.value;
//     setSelectedCarrier(carrierCode);
//   setSelectedCarrier(carrierCode);

//   if (carrierCode) {
//     fetchServices(carrierCode);
//     fetchPackages(carrierCode);
//   } else {
//     setServices([]);
//     setPackages([]);
//   }
// };
  return (
    <div className="basket-page-main-wrapper">
      <div className="custom-container max-w-[1008px]">
        {isCartLoading ? (
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
                />
                <div className="shipping-and-payment-information">
                  <ShippingAddress setSelectedAddress={setSelectedAddress} />
                  <PaymentMethodsArea
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                  />
                </div>
              </div>

              <BasketArea cartItems={cartItems} onPay={handlePayment} />

              {/* <div className="carrier-selection col-span-4">
                <label htmlFor="carrier">Select Carrier</label>
                <select
                  id="carrier"
                  onChange={handleCarrierChange}
                  value={selectedCarrier}
                >
                  <option value="">Select Carrier</option>
                  {carriers.map(carrier => (
                    <option key={carrier.code} value={carrier.code}>
                      {carrier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="service-selection col-span-4">
                <label htmlFor="service">Select Service</label>
                <select
                  id="service"
                  onChange={e => setSelectedService(e.target.value)}
                  value={selectedService}
                  disabled={!services.length}
                >
                  <option value="">Select Service</option>
                  {services.map(service => (
                    <option key={service.code} value={service.code}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="package-selection col-span-4">
                <label htmlFor="package">Select Package</label>
                <select
                  id="package"
                  onChange={e => setSelectedPackage(e.target.value)}
                  value={selectedPackage}
                  disabled={!packages.length}
                >
                  <option value="">Select Package</option>
                  {packages.map(pkg => (
                    <option key={pkg.code} value={pkg.code}>
                      {pkg.name}
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

