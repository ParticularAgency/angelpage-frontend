'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Button, Input } from '@/components/elements';
import { useSession } from 'next-auth/react';


const SoldItemsPage = () => {
  const { data: session, status } = useSession() || {};
  const [soldItems, setSoldItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [setCountSoldItem] = useState(null);
  const [inputTrackingNumber, setInputTrackingNumber] = useState('');
  const [trackingError, setTrackingError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSoldItems();
    }
  }, [status]);

  const fetchSoldItems = async () => {
    if (!session?.user?.id || !session?.token) {
      console.error('Session is not available.');
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/seller/${session.user.id}/sold`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const { soldItems } = await response.json();
      setSoldItems(soldItems);
      setSelectedItem(soldItems[0] || null); // Select the first item by default
      setCountSoldItem(soldItems.length);
    } catch (error) {
      console.error('Error fetching sold items:', error);
    } finally {
      setLoading(false);
    }
  };



 const handleConfirmShipment = async () => {
   if (!inputTrackingNumber) {
     setTrackingError('Please enter a tracking number.');
     return;
   }

   try {
     const response = await fetch(
       `${process.env.NEXT_PUBLIC_API_URL}/order/${selectedItem.orderId}/shipped`,
       {
         method: 'PATCH',
         headers: {
           'Content-Type': 'application/json',
           Authorization: `Bearer ${session.token}`,
         },
         body: JSON.stringify({
           trackingNumber: inputTrackingNumber,
           carrierCode: selectedItem.carrierCode, // Optional, if available
           labelId: selectedItem.labelId, // Optional, if available
           serviceCode: selectedItem.serviceCode, // Optional, if available
         }),
       }
     );

     if (!response.ok) {
       throw new Error(await response.text());
     }

     const { order } = await response.json();

     // Update the selected item with the new status
     setSelectedItem({ ...selectedItem, status: order.status });

     // Optionally update the sold items list
     setSoldItems(
       soldItems.map(item => (item.orderId === order._id ? order : item))
     );

     setTrackingError('');
   } catch (error) {
     setTrackingError('Failed to update order status. Please try again.');
     console.error('Error confirming shipment:', error);
   }
 };


  const handleTrackingChange = e => {
    setInputTrackingNumber(e.target.value);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="sold-item-wrapper-area">
      <div className="sold-item-wrapper-head py-4 flex items-center justify-between">
        <h3 className="body-bold-regular text-mono-100">Sold Items</h3>
        <div className="sold-item-sort-box flex items-center gap-[14px]">
         
        </div>
      </div>
      <div className="sold-item-wrapper-cont-box pl-5 pr-9 grid grid-cols-12 gap-0 sm:grid-cols-6 md:px-0">
        <div className="col-span-4 md:col-span-5 sm:col-span-full sold-product-states-items">
          <ul className="space-y-0">
            {soldItems.map(item => (
              <li
                key={item.orderId}
                onClick={() => {
                  setSelectedItem(item);
                  setInputTrackingNumber('');
                  setTrackingError('');
                }}
                className={`p-4  sm:px-2 sold-product-states-item border cursor-pointer hover:bg-[#F1F1F8] ${item.orderId === selectedItem?.orderId ? 'bg-[#F1F1F8]' : ''}`}
              >
                <div className="flex items-center">
                  <div className="flex items-center gap-3 md:gap-[6px] justify-between w-full">
                    <div className="sold-item-info-box flex items-center gap-[20px] md:gap-4">
                      <div className="sold-item-img">
                        <Image
                          src={
                            item.productImages?.[0]?.url ||
                            '/images/placeholder-image.png'
                          }
                          alt={
                            item.productImages?.[0]?.altText || 'Product image'
                          }
                          className="h-[65px] object-cover"
                          width={70}
                          height={65}
                        />
                      </div>
                      <div className="sold-item-info-cont flex flex-col gap-1">
                        <span className="eyebrow-medium text-mono-100">
                          {item.productBrand}
                        </span>
                        <span className="caption-bold text-mono-70">
                          {item.productName}
                        </span>
                        <span className="body-bold-small text-mono-100">
                          £{item.productPrice}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`forms-bold bg-[#FCF2FF] inline-block py-1 whitespace-nowrap px-[6px] ${
                        item.status === 'Complete'
                          ? 'text-[#1FC430]'
                          : 'text-[#D10C3B]'
                      }`}
                    >
                      {item.status === 'OrderConfirmed'
                        ? 'Item shipped?'
                        : item.status === 'InTransit'
                          ? 'On the way'
                          : item.status === 'Delivered'
                            ? 'Complete'
                            : ''}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-8 md:col-span-7 pt-[23px] pr-[45px] md:pr-4 md:pl-4 pb-[50px] bg-[#F1F1F7] pl-5 sm:col-span-full sold-product-states-item-cont sticky sm:relative top-[30px] h-[65vh]">
          {selectedItem && (
            <>
              <h3 className="caption">Sale Date</h3>
              <div className="mt-1">
                <p>
                  <span className="body-bold-small"></span>{' '}
                  {new Date(selectedItem.orderDate).toLocaleDateString()}
                </p>
              </div>

              {/* Sale Progress */}
              <div className="relative mt-[15px]">
                <div className="flex flex-col space-y-6 sm:space-y-3 pl-7 relative sold-product-items-main-item-content">
                  <div className="flex p-4 bg-mono-0 relative flex-col gap-1 items-start">
                    <div
                      className={`w-[18px] h-[18px] rounded-full absolute dots-item-indicator left-[-36px] top-0 ${selectedItem.status ? 'bg-[#6A0398]' : 'states-not-complete'}`}
                    ></div>
                    <p className="body-bold-small">Purchase Confirmed</p>
                    <p className="purchase-confirmed-date-time forms text-mono-80">
                      {new Date(selectedItem.orderDate).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Item Shipped */}
                  <div className="flex p-4 bg-mono-0 relative flex-col gap-1 items-start">
                    <div
                      className={`w-[18px] h-[18px] rounded-full absolute dots-item-indicator left-[-36px] top-0 ${selectedItem.status === 'ItemShipped' || selectedItem.status === 'InTransit' || selectedItem.status === 'Delivered' || selectedItem.status === 'SalesProceeds' ? 'bg-[#6A0398]' : 'states-not-complete'}`}
                    ></div>
                    <div className="flex items-start flex-col gap-2 justify-start w-full">
                      {selectedItem.status === 'ItemShipped' ||
                      selectedItem.status === 'Delivered' ||
                      selectedItem.status === 'InTransit' ||
                      selectedItem.status === 'SalesProceeds' ? (
                        <>
                          <p className="body-bold-small mb-0">Item Shipped</p>
                          <p className="forms text-mono-70 mt-1">3 Nov 2024</p>
                          <p className="body-bold-small mt-1 flex items-center gap-1">
                            Tracking:{' '}
                            <span className="text-primary-color-100">
                              {' '}
                              DV38474905867352
                            </span>
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="body-bold-small">Item Shipped?</p>
                          <div className="flex sm:flex-col gap-2 items-center w-full">
                            <Input
                              type="text"
                              value={inputTrackingNumber}
                              onChange={handleTrackingChange}
                              placeholder="Order id number"
                              className="caption h-10 max-w-[184px] sm:max-w-full w-full"
                            />
                            <Button
                              onClick={handleConfirmShipment}
                              className="sm:max-w-full sm:w-full"
                              variant="primary"
                            >
                              Confirm Shipment
                            </Button>
                            {trackingError && (
                              <p className="body-bold-small text-error">
                                {trackingError}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Tracking Error */}
                  {trackingError && (
                    <p className="body-bold-small text-error">
                      {trackingError}
                    </p>
                  )}

                  {/* Item Delivered */}
                  {selectedItem.status === 'Delivered' ||
                  selectedItem.status === 'SalesProceeds' ? (
                    <div className="flex p-4 bg-mono-0 relative flex-col gap-1 items-start">
                      <div
                        className={`w-[18px] h-[18px] rounded-full absolute dots-item-indicator left-[-36px] top-0 ${selectedItem.status === 'Delivered' || selectedItem.status === 'SalesProceeds' ? 'bg-[#6A0398]' : 'states-not-complete'}`}
                      ></div>
                      <p className="body-bold-small mb-0">Item Delivered</p>
                      <p className="forms text-mono-70 mt-1">7 Nov 2024</p>
                    </div>
                  ) : (
                    ''
                  )}
                  {/* Sale Proceeds Sent */}
                  {selectedItem.status === 'SalesProceeds' && (
                    <div className="flex p-4 bg-mono-0 relative flex-col gap-1 items-start">
                      <div
                        className={`w-6 h-6 flex justify-center items-center rounded-full absolute dots-item-indicator left-[-38px] bottom-0 ${
                          selectedItem.status === 'SalesProceeds'
                            ? 'bg-[#6A0398]'
                            : 'states-not-complete !left-[-36px]'
                        }`}
                      >
                        {selectedItem.status === 'SalesProceeds' && (
                          <Image
                            src="/images/icons/checkmark.svg"
                            alt="checkmark icon"
                            width={16}
                            height={16}
                          />
                        )}
                      </div>
                      <p className="body-bold-small">
                        Sale proceedings sent to{' '}
                        <span className="sold-product-price-sent-to-selectedcharity">
                          {selectedItem.charityName}
                        </span>
                      </p>
                      <p className="forms text-mono-70 mt-1">7 Nov 2024</p>
                      {selectedItem.status === 'SalesProceeds' && (
                        <div className="">
                          <p className="body-bold-small text-mono-100 sold-product-90-percent-need-to-go-selected-charity">
                            £{selectedItem.charityProfit}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Sale Proceeds and Admin Fee */}
              {selectedItem.status === 'SalesProceeds' && (
                <div className="mt-4 pl-8">
                  <p className="body-small">
                    The remaining £{selectedItem.adminFee} was donated as
                    administration fees.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoldItemsPage;

// import Image from 'next/image';
// import React, { useState } from 'react';
// import { Button, Input } from '@/components/elements';

// const soldItemsMock = [
//   {
//     id: 1,
//     productBrand: 'PRADA',
//     productTitle: 'Handbag',
//     productImageSrc: '/images/products/handbags.png',
//     productPrice: '£10.00',
//     status: 'Complete',
//     saleDate: '1 Nov 2024',
//     stages: {
//       confirmed: true,
//       shipped: true,
//       delivered: true,
//       proceedsSent: true,
//     },
//     trackingNumber: 'DV123456789',
//   },
//   {
//     id: 2,
//     productBrand: 'ANTLER',
//     productTitle: 'Suitcase',
//     productImageSrc: '/images/products/suitcase.png',
//     productPrice: '£10.00',
//     status: 'Item shipped?',
//     saleDate: '1 Nov 2024',
//     stages: {
//       confirmed: true,
//       shipped: false,
//       delivered: false,
//       proceedsSent: false,
//     },
//     trackingNumber: 'DV987654321',
//   },
//   {
//     id: 3,
//     productBrand: 'MISSGUIDED',
//     productTitle: 'Multi-coloured Mules',
//     productImageSrc: '/images/products/mules.png',
//     productPrice: '£10.00',
//     status: 'Complete',
//     saleDate: '1 Nov 2024',
//     stages: {
//       confirmed: true,
//       shipped: true,
//       delivered: true,
//       proceedsSent: true,
//     },
//     trackingNumber: 'DV543210987',
//   },
// ];

// // Fee Calculation Function
// const calculateFees = (
//   productPrice: string
// ): { adminFee: string; saleProceeds: string } => {
//   const productPriceNumber = parseFloat(productPrice.replace('£', ''));
//   const adminFee = (productPriceNumber * 0.1).toFixed(2); // 10% fee
//   const saleProceeds = (productPriceNumber - parseFloat(adminFee)).toFixed(2); // Ensure adminFee is parsed to float for calculation

//   return { adminFee, saleProceeds };
// };

// const SoldItemsPage = () => {
//   const [soldItems, setSoldItems] = useState(soldItemsMock);
//   const [sortFilter, setSortFilter] = useState('Most recent');
//   const [selectedItem, setSelectedItem] = useState(soldItemsMock[0]);
//   const [inputTrackingNumber, setInputTrackingNumber] = useState('');
//   const [trackingError, setTrackingError] = useState('');

//   // Sorting Logic
//   const handleSortChange = (sortBy: string) => {
//     let sortedItems = [...soldItems];
//     if (sortBy === 'Awaiting shipping') {
//       sortedItems = sortedItems.filter(item => !item.stages.shipped);
//     } else if (sortBy === 'Shipped') {
//       sortedItems = sortedItems.filter(
//         item => item.stages.shipped && !item.stages.delivered
//       );
//     } else if (sortBy === 'Delivered') {
//       sortedItems = sortedItems.filter(item => item.stages.delivered);
//     }

//     setSortFilter(sortBy);
//     setSoldItems(sortedItems);
//   };

//   // Shipment Confirmation
//   const handleConfirmShipment = () => {
//     if (!inputTrackingNumber) {
//       setTrackingError('Please enter a tracking number.');
//       return;
//     }

//     if (inputTrackingNumber !== selectedItem.trackingNumber) {
//       setTrackingError('The tracking number does not match.');
//       return;
//     }

//     setTrackingError('');
//     setSelectedItem({
//       ...selectedItem,
//       stages: { ...selectedItem.stages, shipped: true },
//     });
//   };

//   const handleTrackingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputTrackingNumber(e.target.value);
//   };

//   return (
//     <div className="sold-item-wrapper-area">
//       <div className="sold-item-wrapper-head py-4 flex items-center justify-between">
//         <h3 className="body-bold-regular text-mono-100">Sold Items</h3>
//         <div className="sold-item-sort-box flex items-center gap-[14px]">
//           <p className="body-small">Sort by</p>
//           <select
//             value={sortFilter}
//             onChange={e => handleSortChange(e.target.value)}
//             className="caption py-1 px-2 !bg-mono-0 rounded"
//           >
//             <option value="Most recent">Most recent</option>
//             <option value="Awaiting shipping">Awaiting shipping</option>
//             <option value="Shipped">Shipped</option>
//             <option value="Delivered">Delivered</option>
//           </select>
//         </div>
//       </div>
//       <div className="sold-item-wrapper-cont-box pl-5 pr-9 grid grid-cols-12 gap-0 sm:grid-cols-6 md:px-0">
//         <div className="col-span-4 md:col-span-5 sm:col-span-full sold-product-states-items">
//           <ul className="space-y-0">
//             {soldItems.map(item => (
//               <li
//                 key={item.id}
//                 onClick={() => {
//                   setSelectedItem(item);
//                   setInputTrackingNumber('');
//                   setTrackingError('');
//                 }}
//                 className={`p-4  sm:px-2 sold-product-states-item border cursor-pointer hover:bg-[#F1F1F7] ${item.id === selectedItem?.id ? 'bg-[#F1F1F7]' : ''}`}
//               >
//                 <div className="flex items-center">
//                   <div className="flex items-center gap-3 md:gap-[6px] justify-between w-full">
//                     <div className="sold-item-info-box flex items-center gap-[33px] md:gap-4">
//                       <div className="sold-item-img">
//                         <Image
//                           src={item.productImageSrc}
//                           className="h-[65px] object-cover"
//                           alt="sold product item image"
//                           width={70}
//                           height={65}
//                         />
//                       </div>
//                       <div className="sold-item-info-cont flex flex-col gap-1">
//                         <span className="eyebrow-medium text-mono-100">
//                           {item.productBrand}
//                         </span>
//                         <span className="caption-bold text-mono-70">
//                           {item.productTitle}
//                         </span>
//                         <span className="body-bold-small text-mono-100">
//                           {item.productPrice}
//                         </span>
//                       </div>
//                     </div>
//                     <span
//                       className={`forms-bold bg-[#FAF2FF] inline-block py-1 px-[6px] ${item.status === 'Complete' ? 'text-[#1FC430]' : 'text-[#D10C3B]'}`}
//                     >
//                       {item.status}
//                     </span>
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="col-span-8 md:col-span-7 pt-[23px] pr-[45px] md:pr-4 md:pl-4 pb-[50px] bg-[#F1F1F7] pl-5 sm:col-span-full sold-product-states-item-cont">
//           {selectedItem && (
//             <>
//               <h3 className="caption">Sale Date</h3>
//               <div className="mt-1">
//                 <p>
//                   <span className="body-bold-small"></span>{' '}
//                   {selectedItem.saleDate}
//                 </p>
//               </div>

//               {/* Sale Progress */}
//               <div className="relative mt-[15px]">
//                 <div className="flex flex-col space-y-6 sm:space-y-3 pl-7 relative sold-product-items-main-item-content">
//                   <div className="flex p-4 bg-mono-0 relative flex-col gap-1 items-start">
//                     <div
//                       className={`w-[18px] h-[18px] rounded-full absolute dots-item-indicator left-[-36px] top-0 ${selectedItem.stages.confirmed ? 'bg-[#6A0398]' : 'states-not-complete'}`}
//                     ></div>
//                     <p className="body-bold-small">Purchase Confirmed</p>
//                     <p className="purchase-confirmed-date-time forms text-mono-80">
//                       1 Nov 2024
//                     </p>
//                   </div>

//                   {/* Item Shipped */}
//                   <div className="flex p-4 bg-mono-0 relative flex-col gap-1 items-start">
//                     <div
//                       className={`w-[18px] h-[18px] rounded-full absolute dots-item-indicator left-[-36px] top-0 ${selectedItem.stages.shipped ? 'bg-[#6A0398]' : 'states-not-complete'}`}
//                     ></div>
//                     <div className="flex items-start flex-col gap-2 justify-start w-full">
//                       {!selectedItem.stages.shipped ? (
//                         <>
//                           <p className="body-bold-small">Item Shipped?</p>
//                           <div className="flex sm:flex-col gap-2 items-center w-full">
//                             <Input
//                               type="text"
//                               value={inputTrackingNumber}
//                               onChange={handleTrackingChange}
//                               placeholder="Tracking number"
//                               className="caption h-10 max-w-[184px] sm:max-w-full w-full"
//                             />
//                             <Button
//                               onClick={handleConfirmShipment}
//                               className="sm:max-w-full sm:w-full"
//                               variant="primary"
//                             >
//                               Confirm Shipment
//                             </Button>
//                           </div>
//                         </>
//                       ) : (
//                         <>
//                           <p className="body-bold-small mb-0">Item Shipped</p>
//                           <p className="forms text-mono-70 mt-1">3 Nov 2024</p>
//                           <p className="body-bold-small mt-1 flex items-center gap-1">
//                             Tracking:{' '}
//                             <span className="text-primary-color-100">
//                               {' '}
//                               DV38474905867352
//                             </span>
//                           </p>
//                         </>
//                       )}
//                     </div>
//                   </div>

//                   {/* Tracking Error */}
//                   {trackingError && (
//                     <p className="body-bold-small text-error">
//                       {trackingError}
//                     </p>
//                   )}

//                   {/* Item Delivered */}
//                   {selectedItem.stages.delivered && (
//                     <div className="flex p-4 bg-mono-0 relative flex-col gap-1 items-start">
//                       <div
//                         className={`w-[18px] h-[18px] rounded-full absolute dots-item-indicator left-[-36px] top-0 ${selectedItem.stages.delivered ? 'bg-[#6A0398]' : 'states-not-complete'}`}
//                       ></div>
//                       <p className="body-bold-small mb-0">Item Delivered</p>
//                       <p className="forms text-mono-70 mt-1">7 Nov 2024</p>
//                     </div>
//                   )}
//                   {/* Sale Proceeds Sent */}
//                   {selectedItem.stages.proceedsSent && (
//                     <div className="flex p-4 bg-mono-0 relative flex-col gap-1 items-start">
//                       <div
//                         className={`w-6 h-6 flex justify-center items-center rounded-full absolute dots-item-indicator left-[-38px] bottom-0 ${
//                           selectedItem.stages.proceedsSent
//                             ? 'bg-[#6A0398]'
//                             : 'states-not-complete !left-[-36px]'
//                         }`}
//                       >
//                         {selectedItem.stages.proceedsSent && (
//                           <Image
//                             src="/images/icons/checkmark.svg"
//                             alt="checkmark icon"
//                             width={16}
//                             height={16}
//                           />
//                         )}
//                       </div>
//                       <p className="body-bold-small">
//                         Sale proceedings sent to{' '}
//                         <span className="sold-product-price-sent-to-selectedcharity">
//                           Samaritans Ltd
//                         </span>
//                       </p>
//                       <p className="forms text-mono-70 mt-1">7 Nov 2024</p>
//                       {selectedItem.stages.proceedsSent && (
//                         <div className="">
//                           {(() => {
//                             const { saleProceeds } = calculateFees(
//                               selectedItem.productPrice
//                             );
//                             return (
//                               <>
//                                 <p className="body-bold-small text-mono-100 sold-product-90-percent-need-to-go-selected-charity">
//                                   {saleProceeds}
//                                 </p>
//                               </>
//                             );
//                           })()}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Sale Proceeds and Admin Fee */}
//               {selectedItem.stages.proceedsSent && (
//                 <div className="mt-4 pl-8">
//                   {(() => {
//                     const { adminFee } = calculateFees(
//                       selectedItem.productPrice
//                     );
//                     return (
//                       <>
//                         <p className="body-small">
//                           The remaining {adminFee} was donated as administration
//                           fees.
//                         </p>
//                       </>
//                     );
//                   })()}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SoldItemsPage;
