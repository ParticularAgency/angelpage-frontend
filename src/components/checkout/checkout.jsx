'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import BannerSection from './Banner';
// import BasketArea from './BasketArea';
import CheckoutProductItem from './CheckoutProductItem';
import ShippingAddress from './ShippingAddress';
import PaymentMethodsArea from './PaymentMethods';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { ToastService } from '@/components/elements/notifications/ToastService';
import { fetchCart } from '../../store/cartSlice';
import { Button, Checkbox } from '../elements';
import { ArrowDownIcon } from '@/icons';

const BasketPage = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession() || {};
  const userId = session?.user?.id;
  const token = session?.token;
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const cartItems = useSelector(state => state.cart.items);
  const cartStatus = useSelector(state => state.cart.status);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  // const [loading] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [carriers, setCarriers] = useState([]);
  const [tempSelectedCarrier, setTempSelectedCarrier] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [services, setServices] = useState([]);
  const [tempSelectedService, setTempSelectedService] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [shipmentCost, setshipmentCost] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch cart on component mount
  useEffect(() => {
    if (userId && token) {
      dispatch(fetchCart({ userId, token }))
        .unwrap()
        .catch(error => console.error('Error fetching cart:', error));
    }
  }, [userId, token, dispatch]);

 const handlePayment = async () => {
   if (!stripe || !elements || !selectedAddress || !selectedPaymentMethod) {
     ToastService.error('Please complete all required fields.');
     return;
   }

   const { address, city, postcode, country } = selectedAddress;

   // Validate postal code and other address fields
   if (!postcode || !address || !city || !country) {
     ToastService.error(
       'Postal code or address is missing. Please complete your address.'
     );
     return;
   }
console.log(selectedAddress);
   setLoading(true);

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

     // Prepare the order payload
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
       const { clientSecret, order } = response.data;

       // Confirm the payment using Stripe's client-side library
       const result = await stripe.confirmCardPayment(clientSecret, {
         payment_method: {
           card: elements.getElement(CardElement),
           billing_details: {
             name: selectedAddress?.name || 'Customer', // Billing name
             address: {
               line1: selectedAddress?.address || 'Unknown Street', // Billing address line1
               city: selectedAddress?.city || 'Unknown City',
               postal_code: selectedAddress?.postcode || 'E16 4SR', // Ensure this value is a valid string
               country: selectedAddress?.country || 'GB',
             },
           },
         },
       });
          
       if (result.error) {
         await axios.post(`${API_BASE_URL}/order/update-order-status`, {
           orderId: order._id,
           status: 'OrderPlaced',
           orderStatus: 'OrderConfirmed',
           paymentStatus: 'Failed',
           paymentConfirmed: false,
         });
         ToastService.error(result.error.message || 'Payment failed.');
       } else if (result.paymentIntent.status === 'succeeded') {
         // Capture the payment confirmation time
         const paymentConfirmedAt = result.paymentIntent.created * 1000; // Convert seconds to milliseconds

         // Update order status to "OrderConfirmed" and payment status to "Paid"
         await axios.post(`${API_BASE_URL}/order/update-order-status`, {
           orderId: order._id,
           status: 'OrderConfirmed',
           orderStatus: 'OrderConfirmed',
           paymentStatus: 'Paid',
           paymentConfirmedAt,
           paymentConfirmed: true,
         });
         ToastService.success('Payment successful!');
         router.push(`/checkout/confirmation/${order._id}`);
       }
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
    setLoading(true);
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
    }finally{
       setLoading(false);
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

  // Calculate product total, charity profit, and admin fee
  const totalProductPrice = cartItems.reduce((acc, item) => {
    const price = item?.productId?.price || 0; // Use 0 if price is missing
    const quantity = item?.quantity || 0; // Use 0 if quantity is missing
    return acc + price * quantity;
  }, 0);

    const charityProfit = totalProductPrice * 0.9; // 90% for charity
    const adminFee = totalProductPrice * 0.1; // 10% for admin fee

  return (
    <div className="basket-page-main-wrapper">
      <div className="custom-container max-w-[1008px]">
        {
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

              <div className="basket-page-right-cont sm:order-1 col-span-5 md:col-span-6 sm:col-span-full">
                <div className="basket-page-right-cont-wrapper border py-6 bg-[#F1F1F7]">
                  <div className="flex justify-between items-end px-6">
                    <h3 className="body-bold-medium mb-4">Order summary</h3>
                    <p className="font-semibold product-total-price">
                      £{totalProductPrice.toFixed(2)}
                    </p>
                  </div>

                  {/* Collapsible Order Details */}
                  <div className="order-item-list-box">
                    <p
                      className={`colaps-title body-regular px-6 mb-4 cursor-pointer flex items-center gap-[4px] ${
                        isCollapsed ? 'collapsed' : 'collapsed-open'
                      }`}
                      onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                      Order details{' '}
                      <span className="number-of-product-for-price">
                        ({cartItems.length} items)
                      </span>{' '}
                      <span className="arrow-down">
                        <ArrowDownIcon />
                      </span>
                    </p>
                    {!isCollapsed && (
                      <div className="product-list px-6">
                        {cartItems.map((item, index) => {
                          const productCharityProfit =
                            item.quantity * item.productId.price * 0.9; // 90% for charity
                          return (
                            <div className="mb-6" key={index}>
                              <p className="eyebrow-medium">
                                {item.productId.brand}
                              </p>
                              <p className="caption-bold sm:text-[14px] mt-1 text-mono-80">
                                {item.productId.name}
                              </p>
                              <div className="flex justify-between mt-2 caption-bold">
                                <p className="caption text-mono-80">Price</p>
                                <p className="caption text-mono-100 mt-1">
                                  £
                                  {(
                                    item.quantity * item.productId.price
                                  ).toFixed(2)}
                                </p>
                              </div>
                              <div className="flex justify-between caption-bold">
                                <p className="caption text-mono-80">
                                  Charity profit (90%)
                                </p>
                                <p className="caption text-mono-100 mt-1">
                                  £{productCharityProfit.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Summary Footer */}
                  <div className="summary-foot border-t pt-6 px-6">
                    <div className="flex justify-between mb-2">
                      <p className="caption text-mono-80">
                        Angelpage admin fee
                      </p>
                      <p className="caption text-mono-100">
                        £{adminFee.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between mb-2">
                      <p className="caption text-mono-80">
                        Charity profit (90%)
                      </p>
                      <p className="caption text-mono-100">
                        £{charityProfit.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between mb-2">
                      <p className="caption text-mono-80">Shipping cost</p>
                      <p className="caption text-mono-100">
                        £{shipmentCost.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="flex justify-between font-bold px-6 border-t pt-4 mt-4">
                    <p className="body-bold-medium product-total-price">
                      Total
                    </p>
                    <p className="body-bold-medium sm:text-[16px] text-mono-100">
                      £{grandTotal.toFixed(2)}
                    </p>
                  </div>

                  <div className="strip-card-are px-6 border-t py-4">
                    <CardElement />
                  </div>
                  {/* Pay Now Button */}
                  <div className="pay px-6 mt-3">
                    <Button
                      className="w-full"
                      variant="primary"
                      onClick={handlePayment}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Pay Now '}
                    </Button>
                  </div>
                </div>
              </div>
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
                  <h3 className="h4 text-center font-normal mb-4">
                    Carriers and Services
                  </h3>
                     {loading ? (
                    <>
                      <div className="service-selection">
                        <h5 className="mb-3">
                          <p className="skeleton max-w-[140px] w-full h-4 bg-mono-50"></p>
                        </h5>

                        <label className="flex items-center gap-2 mb-2">
                          <span className="skeleton max-w-[350px] w-full  h-2 bg-mono-50"></span>
                        </label>
                        <label className="flex items-center gap-2 mb-2">
                          <span className="skeleton max-w-[350px] w-full  h-2 bg-mono-50"></span>
                        </label>
                        <label className="flex items-center gap-2 mb-2">
                          <span className="skeleton max-w-[350px] w-full  h-2 bg-mono-50"></span>
                        </label>
                      </div>
                    </>
                  ) : (
                    <>
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
                  </>
                  )}
                  {loading ? (
                    <>
                      <div className="service-selection">
                        <h5 className="mb-3">
                          <p className="skeleton max-w-[140px] w-full h-4 bg-mono-50"></p>
                        </h5>

                        <label className="flex items-center gap-2 mb-2">
                          <span className="skeleton max-w-[350px] w-full  h-2 bg-mono-50"></span>
                        </label>
                        <label className="flex items-center gap-2 mb-2">
                          <span className="skeleton max-w-[350px] w-full  h-2 bg-mono-50"></span>
                        </label>
                        <label className="flex items-center gap-2 mb-2">
                          <span className="skeleton max-w-[350px] w-full  h-2 bg-mono-50"></span>
                        </label>
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}

                  <Button
                    variant="primary"
                    className="mt-4 ml-auto max-w-24 w-full !block "
                    onClick={handleModalSave}
                  >
                    Proceed
                  </Button>
                </div>
              </div>
            )}
          </>
        }
      </div>
    </div>
  );
};

export default BasketPage;
