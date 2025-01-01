'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import BannerSection from './Banner';
import BasketArea from './BasketArea';
import CheckoutProductItem from './CheckoutProductItem';
import ShippingAddress from './ShippingAddress';
import PaymentMethodsArea from './PaymentMethods';
// import CheckoutLoaderScreen from './loader/Loader';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { ToastService } from '@/components/elements/notifications/ToastService';
import { fetchCart } from '../../store/cartSlice';
import { Button, Checkbox } from '../elements';

const BasketPage = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession() || {};
  const userId = session?.user?.id;
  const token = session?.token;

  const cartItems = useSelector(state => state.cart.items);
  const cartStatus = useSelector(state => state.cart.status);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  // const [loading] = useState(false);

  const [carriers, setCarriers] = useState([]);
  const [tempSelectedCarrier, setTempSelectedCarrier] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [services, setServices] = useState([]);
  const [tempSelectedService, setTempSelectedService] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [shipmentCost, setshipmentCost] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch cart on component mount
  useEffect(() => {
    if (userId && token) {
      dispatch(fetchCart({ userId, token }))
        .unwrap()
        .catch(error => console.error('Error fetching cart:', error));
    }
  }, [userId, token, dispatch]);

  const handlePayment = async () => {
    try {
      if (
        !selectedAddress ||
        !selectedPaymentMethod ||
        !selectedCarrier ||
        !selectedService
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

          const totalCost = item.quantity * item.productId.price;

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
        totalAmount: grandTotal - shipmentCost, 
        shipmentCost, 
        grandTotal, 
        shippingAddress: selectedAddress,
        paymentMethod: selectedPaymentMethod,
        carrierCode: selectedCarrier,
        serviceCode: selectedService,
      };

      const response = await axios.post(
        `${API_BASE_URL}/order/create`,
        orderPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        const { order } = response.data;
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

  const fetchCarriers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/order/carrier`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCarriers(response.data.carriers || []);
    } catch (error) {
      console.error('Failed to fetch carriers:', error);
    }
  };

  const fetchServices = async carrierCode => {
    if (!carrierCode) return;
    try {
      const response = await axios.get(
        `${API_BASE_URL}/order/carriers/${carrierCode}/services`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setServices(response.data.services || []);
    } catch (error) {
      console.error(
        'Failed to fetch services:',
        error.response?.data || error.message
      );
      ToastService.error('Failed to fetch services.');
      setServices([]);
    }
  };

  const fetchShippingRate = async () => {
    if (!selectedCarrier || !selectedService) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/order/orders/get-shipping-rate`,
        {
          carrierCode: selectedCarrier,
          serviceCode: selectedService,
          fromPostalCode: 'DA16 2PE',
          toPostalCode: selectedAddress?.postcode,
          toCountry: selectedAddress?.country,
          weight: { value: 5, units: 'pounds' },
          dimensions: { units: 'inches', length: 10, width: 6, height: 4 },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success && response.data.rates.length > 0) {
        const rate = response.data.rates[0];
        setshipmentCost(rate.shipmentCost || 0);
      }
    } catch (error) {
      console.error(
        'Error fetching shipping rate:',
        error.response?.data || error.message
      );
      ToastService.error('No shipping rates found for the given details.');
    }
  };

  useEffect(() => {
    const productTotal = cartItems.reduce(
      (total, item) => total + item.quantity * item.productId.price,
      0
    );
    setGrandTotal(productTotal + shipmentCost);
  }, [cartItems, shipmentCost]);

  useEffect(() => {
    fetchCarriers();
  }, [session]);

  useEffect(() => {
    if (tempSelectedCarrier) {
      fetchServices(tempSelectedCarrier);
    }
  }, [tempSelectedCarrier]);

  useEffect(() => {
    fetchShippingRate();
  }, [selectedCarrier, selectedService, selectedAddress]);

  const handleModalSave = () => {
    setSelectedCarrier(tempSelectedCarrier);
    setSelectedService(tempSelectedService);
    setIsModalOpen(false);
  };
  return (
    <div className="basket-page-main-wrapper">
      <div className="custom-container max-w-[1008px]">
        {(
          <>
            <BannerSection />
            <section className="basket-page-main-content-grid grid grid-cols-12 gap-5 sm:gap-y-10">
              <div className="basket-page-left-cont col-span-7 sm:order-2 md:col-span-6 sm:col-span-full">
                <CheckoutProductItem
                  isLoading={isCartLoading}
                  cartItems={cartItems}
                />
                {selectedAddress && selectedPaymentMethod ? (
                  <>
                    <div className="shipping-info-area flex justify-end mb-2">
                      <Button
                        variant="accend-link"
                        className="ml-auto underline !text-primary-color-100"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Add shipping carriers
                      </Button>
                    </div>
                  </>
                ) : (
                  ''
                )}
                <div className="shipping-and-payment-information">
                  <ShippingAddress setSelectedAddress={setSelectedAddress} />
                  <PaymentMethodsArea
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                  />
                </div>
              </div>
             
              <BasketArea
                cartItems={cartItems}
                shipmentCost={shipmentCost}
                grandTotal={grandTotal}
                onPay={handlePayment}
              />
            </section>

            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
                <div className="bg-white w-full max-w-md p-6 relative rounded">
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={handleModalSave}
                  >
                    &times;
                  </button>
                  <h3 className="text-xl font-semibold mb-4">
                    Carriers and Services
                  </h3>
                  <div className="carrier-selection mb-4">
                    <h5 className="mb-2">Select Carrier:</h5>
                    {carriers.map(carrier => (
                      <label
                        key={carrier.code}
                        className="flex items-center gap-2 mb-2"
                      >
                        <Checkbox
                          checked={tempSelectedCarrier === carrier.code}
                          onChange={() => setTempSelectedCarrier(carrier.code)}
                        />
                        {carrier.name}
                      </label>
                    ))}
                  </div>
                  {services.length > 0 && (
                    <div className="service-selection">
                      <h5 className="mb-2">Select Service:</h5>
                      {services.map(service => (
                        <label
                          key={service.code}
                          className="flex items-center gap-2 mb-2"
                        >
                          <Checkbox
                            checked={tempSelectedService === service.code}
                            onChange={() =>
                              setTempSelectedService(service.code)
                            }
                          />
                          {service.name}
                        </label>
                      ))}
                    </div>
                  )}
                  <Button className="mt-4" onClick={handleModalSave}>
                    Save
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BasketPage;
