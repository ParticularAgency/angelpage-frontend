// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useSelector, useDispatch } from 'react-redux';
// import BannerSection from './Banner';
// // import BasketArea from './BasketArea';
// import CheckoutProductItem from './CheckoutProductItem';
// import ShippingAddress from './ShippingAddress';
// import PaymentMethodsArea from './PaymentMethods';
// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import axios from 'axios';
// import { useSession } from 'next-auth/react';
// import { ToastService } from '@/components/elements/notifications/ToastService';
// import { fetchCart } from '../../store/cartSlice';
// import { Button, Checkbox } from '../elements';
// import { ArrowDownIcon } from '@/icons';
// // import Image from 'next/image';

// const BasketPage = () => {
//   const dispatch = useDispatch();
//   const { data: session } = useSession() || {};
//   const userId = session?.user?.id;
//   const token = session?.token;
//   const stripe = useStripe();
//   const elements = useElements();
//   const router = useRouter();
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

//   const cartItems = useSelector(state => state.cart.items);
//   const cartStatus = useSelector(state => state.cart.status);

//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
//   // const [loading] = useState(false);

//   const [isCollapsed, setIsCollapsed] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [loadingCarrier, setLoadingCarrier] = useState(false);
//   const [carriers, setCarriers] = useState([]);
//   const [tempSelectedCarrier, setTempSelectedCarrier] = useState('');
//   const [selectedCarrier, setSelectedCarrier] = useState('');
//   const [services, setServices] = useState([]);
//   const [tempSelectedService, setTempSelectedService] = useState('');
//   const [selectedService, setSelectedService] = useState('');
//   const [shipmentCost, setshipmentCost] = useState(0);
//   const [grandTotal, setGrandTotal] = useState(0);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Fetch cart on component mount
//   useEffect(() => {
//     if (userId && token) {
//       dispatch(fetchCart({ userId, token }))
//         .unwrap()
//         .catch(error => console.error('Error fetching cart:', error));
//     }
//   }, [userId, token, dispatch]);

//  const handlePayment = async () => {
//    if (!stripe || !elements || !selectedAddress || !selectedPaymentMethod) {
//      ToastService.error('Please complete all required fields.');
//      return;
//    }

//    const { address, city, postcode, country } = selectedAddress;

//    // Validate postal code and other address fields
//    if (!postcode || !address || !city || !country) {
//      ToastService.error(
//        'Postal code or address is missing. Please complete your address.'
//      );
//      return;
//    }
// console.log(selectedAddress);
//    setLoading(true);

//    try {
//      if (
//        !selectedAddress ||
//        !selectedPaymentMethod ||
//        !selectedCarrier ||
//        !selectedService
//      ) {
//        alert('Please complete all selections.');
//        return;
//      }
//      // Calculate total weight
//      const totalWeight = cartItems.reduce((sum, item) => {
//        const product = item.productId;
//        const productWeight = parseFloat(product.weight) || 0; // Default to 0 if weight is missing
//        return sum + productWeight * item.quantity;
//      }, 0);
//      // Calculate combined dimensions
//   const combinedDimensions = cartItems.reduce(
//     (acc, item) => {
//       const product = item.productId;
//       const productDimensions = product.dimensions || {};
//       const length = parseFloat(productDimensions.depth || 0); 
//       const width = parseFloat(productDimensions.width || 0);
//       const height = parseFloat(productDimensions.height || 0) * item.quantity; // Multiply height by quantity

//       return {
//         length: Math.max(acc.length, length), // Use the largest length
//         width: Math.max(acc.width, width), // Use the largest width
//         height: acc.height + height, // Sum up all heights
//       };
//     },
//     { length: 0, width: 0, height: 0 } // Initial dimensions
//   );

//   // Validate combined dimensions
//   if (
//     combinedDimensions.length === 0 ||
//     combinedDimensions.width === 0 ||
//     combinedDimensions.height === 0
//   ) {
//     throw new Error(
//       'Invalid combined dimensions: Ensure all products have valid dimensions.'
//     );
//   }
//      // Prepare the order payload
//      const orderPayload = {
//        buyerId: userId,
//        products: cartItems.map(item => {
//          const product = item.productId;
//          const sellerId = product.seller?._id || product.charity?._id;
//          const charityId = product.charity?._id;

//          if (!product || !product._id || !charityId || !item.quantity) {
//            throw new Error('Incomplete product information.');
//          }

//          const totalCost = item.quantity * item.productId.price;

//          return {
//            productId: product._id,
//            name: product.name,
//            price: product.price,
//            seller: sellerId,
//            charity: charityId,
//            weight: product.weight,
//            dimensions: product.dimensions,
//            quantity: item.quantity,
//            totalProductCost: totalCost,
//            charityProfit: totalCost * 0.9,
//            adminFee: totalCost * 0.1,
//          };
//        }),
//        totalAmount: grandTotal - shipmentCost,
//        shipmentCost,
//        grandTotal,
//        combinedDimensions,
//        totalWeight,
//        shippingAddress: selectedAddress,
//        paymentMethod: selectedPaymentMethod,
//        carrierCode: selectedCarrier,
//        serviceCode: selectedService,
//      };

//      const response = await axios.post(
//        `${API_BASE_URL}/order/create`,
//        orderPayload,
//        {
//          headers: { Authorization: `Bearer ${token}` },
//        }
//      );

//      if (response.status === 201) {
//        const { clientSecret, order } = response.data;

//        // Confirm the payment using Stripe's client-side library
//        const result = await stripe.confirmCardPayment(clientSecret, {
//          payment_method: {
//            card: elements.getElement(CardElement),
//            billing_details: {
//              name: selectedAddress?.name || 'Customer', // Billing name
//              address: {
//                line1: selectedAddress?.address || 'Unknown Street', // Billing address line1
//                city: selectedAddress?.city || 'Unknown City',
//                postal_code: selectedAddress?.postcode || 'E16 4SR', // Ensure this value is a valid string
//                country: selectedAddress?.country || 'GB',
//              },
//            },
//          },
//        });

//        if (result.error) {
//          await axios.post(`${API_BASE_URL}/order/update-order-status`, {
//            orderId: order._id,
//            status: 'OrderPlaced',
//            orderStatus: 'OrderConfirmed',
//            paymentStatus: 'Failed',
//            paymentConfirmed: false,
//          });
//          ToastService.error(result.error.message || 'Payment failed.');
//        } else if (result.paymentIntent.status === 'succeeded') {
//          // Capture the payment confirmation time
//          const paymentConfirmedAt = result.paymentIntent.created * 1000; // Convert seconds to milliseconds

//          // Update order status to "OrderConfirmed" and payment status to "Paid"
//          await axios.post(`${API_BASE_URL}/order/update-order-status`, {
//            orderId: order._id,
//            status: 'OrderConfirmed',
//            orderStatus: 'OrderConfirmed',
//            paymentStatus: 'Paid',
//            paymentConfirmedAt,
//            paymentConfirmed: true,
//          });
//          ToastService.success('Payment successful!');
//        }
//        router.push(`/checkout/confirmation/${order._id}`);
//      }
//    } catch (error) {
//      console.error(
//        'Error creating order:',
//        error.response?.data || error.message
//      );
//      alert('Failed to create order.');
//    }
//  };


//   const isCartLoading = cartStatus === 'loading';

//   const fetchCarriers = async () => {
//     setLoadingCarrier(true);
//     try {
//       const response = await axios.get(`${API_BASE_URL}/order/carrier`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log('carrier', response.data.carriers.carriers);
//       setCarriers(response.data.carriers.carriers || []);
      
//     } catch (error) {
//       console.error('Failed to fetch carriers:', error);
//     }finally{
//       setLoadingCarrier(false);
//     }
//   };

//   const fetchServices = async carrierCode => {
//     if (!carrierCode) return;
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/order/carriers/${carrierCode}/services`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       //  console.log('services', response.data);
//       setServices(response.data.services || []);
//     } catch (error) {
//       console.error(
//         'Failed to fetch services:',
//         error.response?.data || error.message
//       );
//       ToastService.error('Failed to fetch services.');
//       setServices([]);
//     }finally{
//        setLoading(false);
//     }
//   };

//  const fetchShippingRate = async () => {
//    if (!selectedCarrier || !selectedService) return;

//    try {
//      // Construct the products array from cartItems
//      const products = cartItems.map(item => {
//        const product = item.productId;
//        return {
//          name: product.name,
//          quantity: item.quantity,
//          weight: parseFloat(product.weight) || 0, // Default to 0 if weight is missing
//          dimensions: {
//            depth: parseFloat(product.dimensions?.depth || 0), // Use depth as length
//            width: parseFloat(product.dimensions?.width || 0),
//            height: parseFloat(product.dimensions?.height || 0),
//          },
//        };
//      });

//      // Validate the constructed products array
//      if (!products || products.length === 0) {
//        throw new Error('Products array is empty or invalid.');
//      }

//      const response = await axios.post(
//        `${API_BASE_URL}/order/orders/get-shipping-rate`,
//        {
//          carrierCode: selectedCarrier,
//          serviceCode: selectedService,
//          fromPostalCode: 'DA16 2PE',
//          toPostalCode: selectedAddress?.postcode,
//          toCountry: selectedAddress?.country,
//          products, // Send products array to backend
//        },
//        {
//          headers: { Authorization: `Bearer ${token}` },
//        }
//      );
//       console.log('shipping rate', response.data.rates);
//      if (response.data.success && response.data.rates.length > 0) {
//        const rate = response.data.rates[0];
//        setshipmentCost(rate.shipmentCost + rate.otherCost || 0);
//      }
//    } catch (error) {
//      console.error(
//        'Error fetching shipping rate:',
//        error.response?.data || error.message
//      );
//      ToastService.error('No shipping rates found for the given details.');
//    }
//  };


//   useEffect(() => {
//     const productTotal = cartItems.reduce(
//       (total, item) => total + item.quantity * item.productId.price,
//       0
//     );
//     setGrandTotal(productTotal + shipmentCost);
//   }, [cartItems, shipmentCost]);

//   useEffect(() => {
//     fetchCarriers();
//   }, [session]);

//   useEffect(() => {
//     if (tempSelectedCarrier) {
//       fetchServices(tempSelectedCarrier);
//     }
//   }, [tempSelectedCarrier]);

//   useEffect(() => {
//     fetchShippingRate();
//   }, [selectedCarrier, selectedService, selectedAddress]);

//   const handleModalSave = () => {
//     setSelectedCarrier(tempSelectedCarrier);
//     setSelectedService(tempSelectedService);
//     setIsModalOpen(false);
//   };

//   // Calculate product total, charity profit, and admin fee
//   const totalProductPrice = cartItems.reduce((acc, item) => {
//     const price = item?.productId?.price || 0; // Use 0 if price is missing
//     const quantity = item?.quantity || 0; // Use 0 if quantity is missing
//     return acc + price * quantity;
//   }, 0);

//     const charityProfit = totalProductPrice * 0.9; // 90% for charity
//     const adminFee = totalProductPrice * 0.1; // 10% for admin fee

//   return (
//     <div className="basket-page-main-wrapper">
//       <div className="custom-container max-w-[1008px]">
//         {
//           <>
//             <BannerSection />
//             <section className="basket-page-main-content-grid grid grid-cols-12 gap-5 sm:gap-y-10">
//               <div className="basket-page-left-cont col-span-7 sm:order-2 md:col-span-6 sm:col-span-full">
//                 <CheckoutProductItem
//                   isLoading={isCartLoading}
//                   cartItems={cartItems}
//                 />
//                 {selectedAddress && selectedPaymentMethod ? (
//                   <>
//                     <div className="shipping-info-area flex justify-end mb-2">
//                       <Button
//                         variant="accend-link"
//                         className="ml-auto underline text-primary-color-100!"
//                         onClick={() => setIsModalOpen(true)}
//                       >
//                         Add shipping carriers
//                       </Button>
//                     </div>
//                   </>
//                 ) : (
//                   ''
//                 )}
//                 <div className="shipping-and-payment-information">
//                   <ShippingAddress setSelectedAddress={setSelectedAddress} />
//                   <PaymentMethodsArea
//                     setSelectedPaymentMethod={setSelectedPaymentMethod}
//                   />
//                 </div>
//               </div>

//               <div className="basket-page-right-cont sm:order-1 col-span-5 md:col-span-6 sm:col-span-full">
//                 <div className="basket-page-right-cont-wrapper border py-6 bg-[#F1F1F7]">
//                   <div className="flex justify-between items-end px-6">
//                     <h3 className="body-bold-medium mb-4">Order summary</h3>
//                     <p className="font-semibold product-total-price">
//                       £{totalProductPrice.toFixed(2)}
//                     </p>
//                   </div>

//                   {/* Collapsible Order Details */}
//                   <div className="order-item-list-box">
//                     <p
//                       className={`colaps-title body-regular px-6 mb-4 cursor-pointer flex items-center gap-[4px] ${
//                         isCollapsed ? 'collapsed' : 'collapsed-open'
//                       }`}
//                       onClick={() => setIsCollapsed(!isCollapsed)}
//                     >
//                       Order details{' '}
//                       <span className="number-of-product-for-price">
//                         ({cartItems.length} items)
//                       </span>{' '}
//                       <span className="arrow-down">
//                         <ArrowDownIcon />
//                       </span>
//                     </p>
//                     {!isCollapsed && (
//                       <div className="product-list px-6">
//                         {cartItems.map((item, index) => {
//                           const productCharityProfit =
//                             item.quantity * item.productId.price * 0.9; // 90% for charity
//                           return (
//                             <div className="mb-6" key={index}>
//                               <p className="eyebrow-medium">
//                                 {item.productId.brand}
//                               </p>
//                               <p className="caption-bold sm:text-[14px] mt-1 text-mono-80">
//                                 {item.productId.name}
//                               </p>
//                               <div className="flex justify-between mt-2 caption-bold">
//                                 <p className="caption text-mono-80">Price</p>
//                                 <p className="caption text-mono-100 mt-1">
//                                   £
//                                   {(
//                                     item.quantity * item.productId.price
//                                   ).toFixed(2)}
//                                 </p>
//                               </div>
//                               <div className="flex justify-between caption-bold">
//                                 <p className="caption text-mono-80">
//                                   Charity profit (90%)
//                                 </p>
//                                 <p className="caption text-mono-100 mt-1">
//                                   £{productCharityProfit.toFixed(2)}
//                                 </p>
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     )}
//                   </div>

//                   {/* Summary Footer */}
//                   <div className="summary-foot border-t pt-6 px-6">
//                     <div className="flex justify-between mb-2">
//                       <p className="caption text-mono-80">
//                         Angelpage admin fee
//                       </p>
//                       <p className="caption text-mono-100">
//                         £{adminFee.toFixed(2)}
//                       </p>
//                     </div>
//                     <div className="flex justify-between mb-2">
//                       <p className="caption text-mono-80">
//                         Charity profit (90%)
//                       </p>
//                       <p className="caption text-mono-100">
//                         £{charityProfit.toFixed(2)}
//                       </p>
//                     </div>
//                     <div className="flex justify-between mb-2">
//                       <p className="caption text-mono-80">Shipping cost</p>
//                       <p className="caption flex gap-1 items-center text-mono-100">
//                         <span>£{shipmentCost.toFixed(2)}</span>
//                         {/* <Button variant='accend-link' className="block p-0! h-auto! cursor-pointer">
//                           <Image
//                             src="/images/icons8-info.gif"
//                             alt="info text"
//                             width={50}
//                             height={50}
//                             className="w-4 h-4"
//                           />
//                         </Button> */}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Total Amount */}
//                   <div className="flex justify-between font-bold px-6 border-t pt-4 mt-4">
//                     <p className="body-bold-medium product-total-price">
//                       Total
//                     </p>
//                     <p className="body-bold-medium sm:text-[16px] text-mono-100">
//                       £{grandTotal.toFixed(2)}
//                     </p>
//                   </div>

//                   <div className="strip-card-are px-6 border-t py-4">
//                     <CardElement />
//                   </div>
//                   {/* Pay Now Button */}
//                   <div className="pay px-6 mt-3">
//                     <Button
//                       className="w-full"
//                       variant="primary"
//                       onClick={handlePayment}
//                       disabled={loading}
//                     >
//                       {loading ? 'Processing...' : 'Pay Now '}
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {isModalOpen && (
//               <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
//                 <div className="bg-white w-full max-w-md p-6 relative rounded-sm">
//                   <button
//                     className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//                     onClick={handleModalSave}
//                   >
//                     &times;
//                   </button>
//                   <h3 className="h4 text-center font-normal mb-4">
//                     Carriers and Services
//                   </h3>
//                   {loadingCarrier ? (
//                     <>
//                       <div className="service-selection">
//                         <h5 className="mb-3">
//                           <p className="skeleton max-w-[140px] w-full h-4 bg-mono-50"></p>
//                         </h5>

//                         <label className="flex items-center gap-2 mb-2">
//                           <span className="skeleton max-w-[350px] w-full  h-2 bg-mono-50"></span>
//                         </label>
//                         <label className="flex items-center gap-2 mb-2">
//                           <span className="skeleton max-w-[350px] w-full  h-2 bg-mono-50"></span>
//                         </label>
//                         <label className="flex items-center gap-2 mb-2">
//                           <span className="skeleton max-w-[350px] w-full  h-2 bg-mono-50"></span>
//                         </label>
//                       </div>
//                     </>
//                   ) : (
//                     <>
//                       <div className="carrier-selection mb-4">
//                         <h5 className="mb-2">Select Carrier:</h5>
//                         {carriers.map(carrier => (
//                           <label
//                             key={carrier.carrier_id}
//                             className="flex items-center gap-2 mb-2"
//                           >
//                             <Checkbox
//                               checked={
//                                 tempSelectedCarrier === carrier.carrier_code
//                               }
//                               onChange={() =>
//                                 setTempSelectedCarrier(carrier.carrier_code)
//                               }
//                             />
//                             {carrier.friendly_name}
//                           </label>
//                         ))}
//                       </div>
//                     </>
//                   )}
//                   {loading ? (
//                     <>
//                       <div className="service-selection">
//                         <h5 className="mb-3">
//                           <p className="skeleton max-w-[140px] w-full h-4 bg-mono-50"></p>
//                         </h5>

//                         <label className="flex items-center gap-2 mb-2">
//                           <span className="skeleton max-w-[350px] w-full  h-2 bg-mono-50"></span>
//                         </label>
//                         <label className="flex items-center gap-2 mb-2">
//                           <span className="skeleton max-w-[350px] w-full  h-2 bg-mono-50"></span>
//                         </label>
//                         <label className="flex items-center gap-2 mb-2">
//                           <span className="skeleton max-w-[350px] w-full  h-2 bg-mono-50"></span>
//                         </label>
//                       </div>
//                     </>
//                   ) : (
//                     <>
//                       {services.length > 0 && (
//                         <div className="service-selection">
//                           <h5 className="mb-2">Select Service:</h5>
//                           {services.map(service => (
//                             <label
//                               key={service.code}
//                               className="flex items-center gap-2 mb-2"
//                             >
//                               <Checkbox
//                                 checked={tempSelectedService === service.code}
//                                 onChange={() =>
//                                   setTempSelectedService(service.code)
//                                 }
//                               />
//                               {service.name}
//                             </label>
//                           ))}
//                         </div>
//                       )}
//                     </>
//                   )}

//                   <Button
//                     variant="primary"
//                     className="mt-4 ml-auto max-w-24 w-full block! "
//                     onClick={handleModalSave}
//                   >
//                     Proceed
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </>
//         }
//       </div>
//     </div>
//   );
// };

// export default BasketPage;
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import BannerSection from './Banner';
import CheckoutProductItem from './CheckoutProductItem';
import ShippingAddress from './ShippingAddress';
import PaymentMethodsArea from './PaymentMethods';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { ToastService } from '@/components/elements/notifications/ToastService';
import { fetchCart, hydrateGuestCart, clearGuestCart } from '../../store/cartSlice';
import { Button } from '../elements';
import { ArrowDownIcon } from '@/icons';
import ShippingCarriersModal from './ShippingCarriersModal';
import GuestPaymentMethods from './GuestPaymentMethods';
import { storeGuestOrderToken } from '@/utils/guestOrderToken';
import {
  toStripeCountryCode,
  getAddressPostcode,
} from '@/utils/ukValidation';
import { calculateProfitSplit } from '@/lib/profitSplit';
import { formatMarketMoney, preferredCountryName } from '@/lib/marketPreference';
import { useLocale } from '@/i18n/LocaleProvider';

const cartLineSplit = (item) => {
  const total = (item?.quantity || 0) * (item?.productId?.price || 0);
  const pct = item?.productId?.sellerSharePercent ?? 0;
  return calculateProfitSplit(total, pct);
};

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true,
  style: {
    base: {
      fontSize: '16px',
      color: '#1a1a1a',
      '::placeholder': { color: '#9ca3af' },
    },
  },
};

const resolveCharityId = product => {
  const charity = product?.charity;
  if (!charity) return null;
  if (typeof charity === 'string') return charity;
  return charity._id || charity.id || null;
};

const resolveSellerId = product => {
  const seller = product?.seller;
  if (!seller) return null;
  if (typeof seller === 'string') return seller;
  return seller._id || seller.id || null;
};

const buildShippingAddressPayload = (address, guestEmail, guestName) => {
  if (!address) return null;
  return {
    name: address.name || guestName?.trim() || '',
    address: address.address,
    city: address.city,
    state: address.state,
    country: address.country,
    postcode: getAddressPostcode(address),
    email: address.email || guestEmail?.trim() || '',
  };
};

const BasketPage = () => {
  const dispatch = useDispatch();
  const { locale } = useLocale();
  const money = amount => formatMarketMoney(amount, locale);
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
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [productTotal, setProductTotal] = useState(0);
  const [shipmentCost, setShipmentCost] = useState(0);
  const [shippingSelection, setShippingSelection] = useState({
    carrierCode: '',
    serviceCode: '',
  });
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [guestName, setGuestName] = useState('');

  const isGuestCheckout = !session?.user?.id;
  const grandTotal = productTotal + shipmentCost;

  // Fetch cart
  useEffect(() => {
    if (userId && token) {
      dispatch(fetchCart({ userId, token }))
        .unwrap()
        .catch(error => console.error('Error fetching cart:', error));
    } else {
      dispatch(hydrateGuestCart());
    }
  }, [userId, token, dispatch]);

  // Calculate totals
  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.productId.price,
      0
    );
    setProductTotal(total);
  }, [cartItems]);

  // Guest: default billing from shipping when no saved payment method
  useEffect(() => {
    if (!isGuestCheckout || !selectedAddress) return;
    if (selectedPaymentMethod?.id?.startsWith?.('guest-pm-')) return;
    setSelectedPaymentMethod({
      nameAccountHolder: guestName.trim() || selectedAddress.name || '',
      billingAddress: {
        name: selectedAddress.name || guestName.trim() || '',
        address: selectedAddress.address || '',
        city: selectedAddress.city || '',
        country: selectedAddress.country || preferredCountryName(),
        postCode: getAddressPostcode(selectedAddress),
      },
    });
  }, [isGuestCheckout, selectedAddress, guestName]);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      ToastService.error('Stripe is still loading...');
      return;
    }

    if (!selectedAddress) {
      ToastService.error('Please select a shipping address.');
      return;
    }

    if (isGuestCheckout) {
      if (!guestEmail.trim() || !guestName.trim()) {
        ToastService.error('Please enter your name and email for guest checkout.');
        return;
      }
    }

    const billingSource =
      selectedPaymentMethod?.billingAddress || selectedAddress || {};
    const postalCode =
      getAddressPostcode(billingSource) ||
      getAddressPostcode(selectedAddress) ||
      '';
    const billingLine1 =
      billingSource.address || selectedAddress?.address || '';
    const billingCity = billingSource.city || selectedAddress?.city || '';

    if (!postalCode) {
      ToastService.error(
        'Please add a payment method with a UK postcode, or complete your shipping postcode.'
      );
      return;
    }

    if (!billingLine1 || !billingCity) {
      ToastService.error('Please complete your billing or shipping address.');
      return;
    }

    if (!selectedPaymentMethod && !isGuestCheckout) {
      ToastService.error('Please select a payment method.');
      return;
    }

    setLoading(true);

    try {
      const guestPaymentMethod = {
        nameAccountHolder:
          selectedPaymentMethod?.nameAccountHolder || guestName.trim(),
        accountNumber: 'stripe',
        expiryDate: 'N/A',
        cvvNumber: 'N/A',
        useShippingAsBilling: true,
        billingAddress: {
          name:
            selectedPaymentMethod?.billingAddress?.name ||
            selectedAddress.name ||
            guestName.trim(),
          address:
            selectedPaymentMethod?.billingAddress?.address ||
            selectedAddress.address,
          city:
            selectedPaymentMethod?.billingAddress?.city || selectedAddress.city,
          country:
            selectedPaymentMethod?.billingAddress?.country ||
            selectedAddress.country,
          postCode:
            selectedPaymentMethod?.billingAddress?.postCode ||
            getAddressPostcode(selectedAddress),
        },
      };

      const orderPayload = {
        ...(isGuestCheckout
          ? { guestEmail: guestEmail.trim(), guestName: guestName.trim() }
          : { buyerId: userId }),
        products: cartItems.map(item => {
          const lineTotal = item.quantity * item.productId.price;
          const split = cartLineSplit(item);
          return {
            productId: item.productId._id || item.productId,
            name: item.productId.name,
            price: item.productId.price,
            quantity: item.quantity,
            weight: item.productId.weight,
            dimensions: item.productId.dimensions,
            seller: resolveSellerId(item.productId),
            charity: resolveCharityId(item.productId),
            totalProductCost: lineTotal,
            charityProfit: split.charityProfit,
            sellerProfit: split.sellerProfit,
            adminFee: split.platformFee,
          };
        }),
        totalAmount: productTotal,
        shipmentCost,
        grandTotal,
        carrierCode: shippingSelection.carrierCode || null,
        serviceCode: shippingSelection.serviceCode || null,
        shippingAddress: buildShippingAddressPayload(
          selectedAddress,
          guestEmail,
          guestName
        ),
        paymentMethod: isGuestCheckout
          ? guestPaymentMethod
          : selectedPaymentMethod,
      };

      const orderEndpoint = isGuestCheckout
        ? `${API_BASE_URL}/order/guest-create`
        : `${API_BASE_URL}/order/create`;

      const response = await axios.post(orderEndpoint, orderPayload, {
        ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
      });

      if (response.status !== 201) {
        throw new Error('Order creation failed.');
      }

      const { clientSecret, order, guestAccessToken } = response.data;

      const guestToken = guestAccessToken || '';
      if (isGuestCheckout && guestToken && order?._id) {
        storeGuestOrderToken(order._id, guestToken);
      }

      const guestAuthConfig = isGuestCheckout && guestToken
        ? { headers: { 'X-Guest-Order-Token': guestToken } }
        : token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : undefined;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name:
              selectedPaymentMethod?.nameAccountHolder ||
              selectedAddress?.name ||
              guestName.trim() ||
              'Customer',
            ...(isGuestCheckout && guestEmail.trim()
              ? { email: guestEmail.trim() }
              : {}),
            address: {
              line1: billingLine1,
              city: billingCity,
              postal_code: postalCode,
              country: toStripeCountryCode(
                billingSource.country || selectedAddress?.country
              ),
            },
          },
        },
      });

      if (result.error) {
        await axios.post(
          `${API_BASE_URL}/order/update-order-status`,
          {
            orderId: order._id,
            status: 'OrderPlaced',
            paymentStatus: 'Failed',
            paymentConfirmed: false,
            ...(isGuestCheckout && guestToken ? { guestToken } : {}),
          },
          guestAuthConfig || (token ? { headers: { Authorization: `Bearer ${token}` } } : undefined)
        );
        ToastService.error(result.error.message);
        return;
      }

      if (result.paymentIntent?.status === 'succeeded') {
        await axios.post(
          `${API_BASE_URL}/order/update-order-status`,
          {
            orderId: order._id,
            status: 'OrderConfirmed',
            paymentStatus: 'Paid',
            paymentConfirmed: true,
            paymentIntentId: result.paymentIntent.id,
            paymentConfirmedAt: result.paymentIntent.created * 1000,
            ...(isGuestCheckout && guestToken ? { guestToken } : {}),
          },
          guestAuthConfig || (token ? { headers: { Authorization: `Bearer ${token}` } } : undefined)
        );
        if (isGuestCheckout) {
          dispatch(clearGuestCart());
        }
      }

      ToastService.success('Payment successful!');
      const confirmUrl = isGuestCheckout
        ? `/checkout/confirmation/${order._id}?email=${encodeURIComponent(guestEmail.trim())}${guestToken ? `&guestToken=${encodeURIComponent(guestToken)}` : ''}`
        : `/checkout/confirmation/${order._id}`;
      router.push(confirmUrl);
    } catch (error) {
      console.error('Order error:', error.response?.data || error.message);
      ToastService.error('Failed to create order.');
    } finally {
      setLoading(false);
    }
  };

  const totalProductPrice = cartItems.reduce((acc, item) => {
    return acc + item.quantity * item.productId.price;
  }, 0);

  const cartTotals = cartItems.reduce(
    (acc, item) => {
      const split = cartLineSplit(item);
      return {
        charity: acc.charity + split.charityProfit,
        platform: acc.platform + split.platformFee,
        seller: acc.seller + split.sellerProfit,
      };
    },
    { charity: 0, platform: 0, seller: 0 },
  );

  const charityProfit = cartTotals.charity;
  const adminFee = cartTotals.platform;
  const sellerProfit = cartTotals.seller;

  const isCartLoading = cartStatus === 'loading';
  const isCartEmpty = !isCartLoading && cartItems.length === 0;

  return (
    <div className="basket-page-main-wrapper">
      <div className="custom-container max-w-[1008px]">
        <>
          {isCartEmpty ? (
            <div className="mx-auto my-16 max-w-md rounded-3xl border border-[#E6E3E7] bg-[#FCF2FF] px-8 py-14 text-center">
              <h4 className="font-primary text-[32px] text-[#0B0112]">Your basket is empty</h4>
              <p className="mt-3 text-[14px] text-[#6B686E]">
                Add items while browsing, then return here to checkout.
              </p>
              <a
                href="/product"
                className="mt-6 inline-flex h-11 items-center rounded-full bg-[#611192] px-6 text-[14px] font-semibold text-white"
              >
                Browse products
              </a>
            </div>
          ) : (
          <>
          {!session?.user?.id && (
            <div className="mb-6 rounded-2xl border border-[#611192]/20 bg-[#F2E8F8] px-5 py-4 flex flex-wrap items-center justify-between gap-3">
              <p className="body-small text-mono-100">
                Checking out as a guest? You can complete your purchase without
                an account, or sign in to save your details.
              </p>
              <a
                href="/auth/login?callbackUrl=/checkout"
                className="text-sm font-semibold text-[#611192] underline"
              >
                Sign in
              </a>
            </div>
          )}
          <BannerSection />

          <section className="basket-page-main-content-grid grid grid-cols-12 gap-5 sm:gap-y-10">
            <div className="basket-page-left-cont col-span-7 sm:order-2 md:col-span-6 sm:col-span-full">
              <CheckoutProductItem
                isLoading={isCartLoading}
                cartItems={cartItems}
              />

              <div className="shipping-and-payment-information">
                {isGuestCheckout && (
                  <div className="mb-6 rounded-xl border border-mono-40 bg-white p-4">
                    <p className="body-small font-medium mb-3">Guest details</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Full name"
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        value={guestName}
                        onChange={e => setGuestName(e.target.value)}
                      />
                      <input
                        type="email"
                        placeholder="Email address"
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        value={guestEmail}
                        onChange={e => setGuestEmail(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                <ShippingAddress setSelectedAddress={setSelectedAddress} />
                <div className="mt-4 mb-4">
                  <Button
                    variant="secondary"
                    className="w-full text-primary-color-100! border-primary-color-100!"
                    onClick={() => setShowShippingModal(true)}
                    disabled={!selectedAddress}
                  >
                    {shippingSelection.carrierCode
                      ? `Shipping: ${money(shipmentCost)} — change`
                      : 'Add shipping carrier (optional)'}
                  </Button>
                  {!shippingSelection.carrierCode && (
                    <p className="caption text-mono-70 mt-2">
                      You can checkout without selecting a carrier. Shipping may
                      be arranged separately.
                    </p>
                  )}
                </div>
                {isGuestCheckout ? (
                  <GuestPaymentMethods
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                    selectedAddress={selectedAddress}
                    guestName={guestName}
                  />
                ) : (
                  <PaymentMethodsArea
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                    selectedShippingAddress={selectedAddress}
                  />
                )}
              </div>
            </div>

            <div className="basket-page-right-cont sm:order-1 col-span-5 md:col-span-6 sm:col-span-full">
              <div className="basket-page-right-cont-wrapper overflow-hidden bg-white py-6">
                <div className="mb-4 flex items-end justify-between bg-[#FCF2FF] px-6 py-4">
                  <h3 className="font-primary text-[24px] text-[#0B0112]">Order summary</h3>
                  <p className="text-[18px] font-semibold text-[#611192]">
                    {money(totalProductPrice)}
                  </p>
                </div>

                {/* Collapsible */}
                <div className="order-item-list-box">
                  <p
                    className={`colaps-title body-regular px-6 mb-4 cursor-pointer flex items-center gap-[4px] ${
                      isCollapsed ? 'collapsed' : 'collapsed-open'
                    }`}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  >
                    Order details
                    <span className="number-of-product-for-price">
                      ({cartItems.length} items)
                    </span>
                    <span className="arrow-down">
                      <ArrowDownIcon />
                    </span>
                  </p>

                  {!isCollapsed && (
                    <div className="product-list px-6">
                      {cartItems.map((item, index) => {
                        const split = cartLineSplit(item);

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
                                {money(item.quantity * item.productId.price)}
                              </p>
                            </div>

                            <div className="flex justify-between caption-bold">
                              <p className="caption text-mono-80">
                                Charity
                              </p>
                              <p className="caption text-mono-100 mt-1">
                                {money(split.charityProfit)}
                              </p>
                            </div>
                            {split.sellerProfit > 0 && (
                              <div className="flex justify-between caption-bold">
                                <p className="caption text-mono-80">
                                  Seller share
                                </p>
                                <p className="caption text-mono-100 mt-1">
                                  {money(split.sellerProfit)}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="summary-foot border-t pt-6 px-6">
                  <div className="flex justify-between mb-2">
                    <p className="caption text-mono-80">Angelpage platform fee</p>
                    <p className="caption text-mono-100">
                      {money(adminFee)}
                    </p>
                  </div>

                  {sellerProfit > 0 && (
                    <div className="flex justify-between mb-2">
                      <p className="caption text-mono-80">Seller share</p>
                      <p className="caption text-mono-100">
                        {money(sellerProfit)}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between mb-2">
                    <p className="caption text-mono-80">Charity total</p>
                    <p className="caption text-mono-100">
                      {money(charityProfit)}
                    </p>
                  </div>

                  <div className="flex justify-between mb-2">
                    <p className="caption text-mono-80">Shipping cost</p>
                    <p className="caption text-mono-100">
                      {money(shipmentCost)}
                    </p>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between font-bold px-6 border-t pt-4 mt-4">
                  <p className="body-bold-medium">Total</p>
                  <p className="font-primary text-[28px] text-[#611192]">
                    {money(grandTotal)}
                  </p>
                </div>

                <div className="strip-card-are px-6 border-t py-4">
                  <p className="caption text-mono-70 mb-3">Card details</p>
                  <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>

                <div className="pay px-6 mt-3">
                  <Button
                    className="w-full"
                    variant="primary"
                    onClick={handlePayment}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Pay Now'}
                  </Button>
                </div>
              </div>
            </div>
          </section>
          </>
          )}
        </>
      </div>
      <ShippingCarriersModal
        isOpen={showShippingModal}
        onClose={() => setShowShippingModal(false)}
        token={token}
        selectedAddress={selectedAddress}
        cartItems={cartItems}
        apiBaseUrl={API_BASE_URL}
        initialCarrier={shippingSelection.carrierCode}
        initialService={shippingSelection.serviceCode}
        onSave={({ carrierCode, serviceCode, shipmentCost: cost }) => {
          setShippingSelection({ carrierCode, serviceCode });
          setShipmentCost(cost || 0);
        }}
      />
    </div>
  );
};

export default BasketPage;
