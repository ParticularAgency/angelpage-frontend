'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Button} from '@/components/elements';
import { useSession } from 'next-auth/react';
// import { ToastService } from '@/components/elements/notifications/ToastService';
import Link from 'next/link';
import LoadingModal from '@/icons/loadingModal';


const BoughtItems = () => {
    const { data: session, status } = useSession() || {};
    const [purchaseItems, setPurchaseItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // Default to item 1 (Hollister)
  const [loading, setLoading] = useState(true);
 
    const fetchPurchaseItems = async () => {
      if (!session?.user?.id || !session?.token) {
        console.error('Session is not available.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/order/buyer/${session.user.id}/orders`,
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(await response.text());
        }

        const { purchaseItems } = await response.json(); // Expecting `purchaseItems` from API
        if (!Array.isArray(purchaseItems)) {
          throw new Error('Invalid data format received. Expected an array.');
        }
        console.log('bought response' , purchaseItems)
        setPurchaseItems(purchaseItems);
        setSelectedItem(purchaseItems[0] || null); // Select the first item by default
      } catch (error) {
        console.error('Error fetching purchase items:', error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (status === 'authenticated') {
        fetchPurchaseItems();
      }
    }, [status]);


 const handleConfirmDelivery = async () => {
   if (!selectedItem?.orderId) {
     setTrackingError('No order selected.');
     return;
   }

   try {
     const response = await fetch(
       `${process.env.NEXT_PUBLIC_API_URL}/order/${selectedItem.orderId}/delivered`,
       {
         method: 'PATCH',
         headers: {
           'Content-Type': 'application/json',
           Authorization: `Bearer ${session.token}`,
         },
       }
     );

     if (!response.ok) {
       throw new Error(await response.text());
     }

     const { order } = await response.json();

     // Update the selected item and sold items list
     setSelectedItem({ ...selectedItem, status: order.status });
     setSoldItems(
       soldItems.map(item => (item.orderId === order._id ? order : item))
     );

     setTrackingError('');
   } catch (error) {
     setTrackingError('Failed to confirm delivery. Please try again.');
     console.error('Error confirming delivery:', error);
   }
 };


  if (loading) {
    return (
      <div className="sold-item-wrapper-area">
        <div className="sold-item-wrapper-head py-4 flex items-center justify-between">
          <h3 className="body-bold-regular text-mono-100">Sold Items</h3>
          <div className="sold-item-sort-box flex items-center gap-[14px]"></div>
        </div>
        <div className="sold-item-wrapper-cont-box pl-5 pr-9 grid grid-cols-12 gap-0 sm:grid-cols-6 md:px-0">
          <div className="col-span-4 md:col-span-5 sm:col-span-full sold-product-states-items">
            <ul className="space-y-0">
              {loading && (
                <>
                  <li
                    className={`p-4  sm:px-2 sold-product-states-item border cursor-pointer hover:bg-[#F1F1F8]`}
                  >
                    <div className="flex items-center">
                      <div className="flex items-center gap-3 md:gap-[6px] justify-between w-full">
                        <div className="sold-item-info-box flex items-center gap-[20px] md:gap-4">
                          <div className="sold-item-img w-[70px] h-[65px] skeleton bg-mono-40 rounded-[4px]"></div>
                          <div className="sold-item-info-cont flex flex-col gap-1">
                            <span className="eyebrow-medium skeleton w-[140px] bg-mono-40 h-3 text-mono-100">
                              {/* {item.productBrand} */}
                            </span>
                            <span className="caption-bold skeleton w-[140px] bg-mono-40 h-2 text-mono-70">
                              {/* {item.productName} */}
                            </span>
                            <span className="body-bold-small skeleton w-[90px] bg-mono-40 h-2 text-mono-100">
                              {/* £{item.productPrice} */}
                            </span>
                          </div>
                        </div>
                        <div className="states-box flex flex-col-reverse justify-between items-end">
                          <span
                            className={`forms-bold skeleton w-[70px] h-1 bg-[#FCF2FF] inline-block py-1 whitespace-nowrap px-[6px]`}
                          ></span>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li
                    className={`p-4  sm:px-2 sold-product-states-item border cursor-pointer hover:bg-[#F1F1F8]`}
                  >
                    <div className="flex items-center">
                      <div className="flex items-center gap-3 md:gap-[6px] justify-between w-full">
                        <div className="sold-item-info-box flex items-center gap-[20px] md:gap-4">
                          <div className="sold-item-img w-[70px] h-[65px] skeleton bg-mono-40 rounded-[4px]"></div>
                          <div className="sold-item-info-cont flex flex-col gap-1">
                            <span className="eyebrow-medium skeleton w-[140px] bg-mono-40 h-3 text-mono-100">
                              {/* {item.productBrand} */}
                            </span>
                            <span className="caption-bold skeleton w-[140px] bg-mono-40 h-2 text-mono-70">
                              {/* {item.productName} */}
                            </span>
                            <span className="body-bold-small skeleton w-[90px] bg-mono-40 h-2 text-mono-100">
                              {/* £{item.productPrice} */}
                            </span>
                          </div>
                        </div>
                        <div className="states-box flex flex-col-reverse justify-between items-end">
                          <span
                            className={`forms-bold skeleton w-[70px] h-1 bg-[#FCF2FF] inline-block py-1 whitespace-nowrap px-[6px]`}
                          ></span>
                        </div>
                      </div>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div
            className={`col-span-8 md:col-span-7 pt-[23px] pr-[45px] md:pr-4 md:pl-4 pb-[50px] bg-[#F1F1F7] pl-5 sm:col-span-full sold-product-states-item-cont sticky sm:relative top-[30px]  ${loading ? 'h-full' : 'h-[65vh]'}`}
          >
            {loading && (
              <>
                <div className="loading-model py-20">
                  <LoadingModal />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
  if (purchaseItems.length === 0) {
    return (
      <>
        <div className="not-found-screen-design flex flex-col items-center pt-12 pb-12 custom-container">
          <h5 className="body-bold-medium !text-[18px] text-mono-100 font-medium font-secondary mb-2 text-center">
            No items purchased yet.
          </h5>
          <p className="body-bold-small font-secondary font-regular text-mono-90 text-center max-w-[420px] w-full mx-auto">
            Currently, there are no purchase data available. Please return to
            the homepage for more options.
          </p>
          {/* <Link href="/">
            <Button variant="primary" className="mx-auto mt-6">
              Return Home
            </Button>
          </Link> */}
        </div>
      </>
    );
  }
  return (
    <div className="bought-items-wrapper-area">
      <div className="bought-item-wrapper-head py-4 flex items-center justify-between">
        <h3 className="body-bold-regular text-mono-100">Bought Items</h3>
        <div className="bought-item-sort-box flex items-center gap-[14px]"></div>
      </div>

      <div className="bought-item-wrapper-cont-box pl-5 pr-9 grid grid-cols-12 md:px-0 gap-0 sm:grid-cols-6">
        {/* List of bought items */}
        <div className="col-span-4 md:col-span-5 sm:col-span-full bought-product-states-items">
          <ul>
            {!loading && (
              <>
                {purchaseItems.map(item => (
                  <li
                    key={item.orderId}
                    onClick={() => setSelectedItem(item)}
                    className={`p-4 sm:px-2 bought-product-states-item border cursor-pointer hover:bg-[#F1F1F7] ${item.orderId === selectedItem?.orderId ? 'bg-[#F1F1F7]' : ''}`}
                  >
                    <div className="flex items-center">
                      <div className="flex items-center gap-3 md:gap-[6px] justify-between w-full">
                        <div className="bought-item-info-box flex items-center gap-[33px]  md:gap-4">
                          <div className="bought-item-img">
                            <Image
                              src={
                                item.productImages?.[0]?.url ||
                                '/images/placeholder-image.png'
                              }
                              alt={
                                item.productImages?.[0]?.altText ||
                                'Product image'
                              }
                              className="h-[65px] object-cover"
                              width={70}
                              height={65}
                            />
                          </div>
                          <div className="bought-item-info-cont flex flex-col gap-1">
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
                          className={`forms-bold bg-[#FAF2FF] inline-block whitespace-nowrap py-1 px-[6px] ${item.status === 'Complete' ? 'text-[#1FC430]' : 'text-[#D10C3B]'}`}
                        >
                          {item.status === 'OrderConfirmed'
                            ? 'Item shipped?'
                            : item.status === 'OrderPlaced'
                              ? 'Awaiting payment'
                              : item.status === 'InTransit'
                                ? 'Item received?'
                                : item.status === 'ItemShipped'
                                  ? 'Item received?'
                                  : item.status === 'Delivered'
                                    ? 'Complete'
                                    : ''}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>

        {/* Details for the selected item */}
        <div 
         className={`col-span-8 md:col-span-7 pt-[23px] pr-[45px] md:pr-4 md:pl-4 pb-[50px] bg-[#F1F1F7] pl-5 sm:col-span-full sold-product-states-item-cont sticky sm:relative top-[30px]  ${loading ? 'h-full' : 'h-[65vh]'}`} >
       {!loading && (
         <>
          {selectedItem && (
            <>
              <h3 className="caption">Purchase date</h3>
              <div className="mt-1">
                <p> {new Date(selectedItem.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="relative mt-[15px]">
                <div className="flex flex-col space-y-6 sm:space-y-3 pl-7 relative sold-product-items-main-item-content">
                  {/* Payment Sent */}
                  <div className="flex p-4 bg-mono-0 relative flex-col gap-1 items-start">
                    <div
                      className={`w-[18px] h-[18px] rounded-full absolute dots-item-indicator left-[-36px] top-0 ${selectedItem.status ? 'bg-[#6A0398]' : 'states-not-complete'}`}
                    ></div>
                    <div>
                      <p className="body-bold-small">
                        {selectedItem.status === 'OrderPlaced'
                          ? 'Payment fail'
                          : 'Payment sent'}
                      </p>
                      <p className="forms text-mono-70 mt-1">
                        {selectedItem.status === 'OrderPlaced' ? (
                          <>
                            {' '}
                            {new Date(selectedItem.createdAt).toLocaleString()}
                          </>
                        ) : (
                          <>
                            {new Date(
                              selectedItem.paymentConfirmedAt
                            ).toLocaleString()}
                          </>
                        )}{' '}
                      </p>
                    </div>
                  </div>

                  {selectedItem.status === 'ItemShipped' ||
                  selectedItem.status === 'InTransit' ||
                  selectedItem.status === 'Delivered' ||
                  selectedItem.status === 'SalesProceeds' ? (
                    <div className="flex p-4 bg-mono-0 relative flex-col gap-1 items-start">
                      <div
                        className={`w-[18px] h-[18px] rounded-full absolute dots-item-indicator left-[-36px] top-0 ${selectedItem.status === 'ItemShipped' || selectedItem.status === 'InTransit' || selectedItem.status === 'SalesProceeds' || selectedItem.status === 'Delivered' ? 'bg-[#6A0398]' : 'states-not-complete'}`}
                      ></div>
                      <div>
                        <p className="text-body-bold-small">Item dispatched</p>
                        <p className="forms text-mono-70 mt-1">
                          {' '}
                          {new Date(
                            selectedItem.updatedAt
                          ).toLocaleDateString()}
                        </p>
                        <p className="body-bold-small mt-1">
                          Tracking:{' '}
                          <span className="text-purple-600">
                            {selectedItem.trackingNumber}
                          </span>
                        </p>

                        {selectedItem.tracking_url ? (
                          <Link
                            target="_blank"
                            href={selectedItem.tracking_url}
                          >
                            <Button variant="primary" className="mt-2">
                              Track order
                            </Button>
                          </Link>
                        ) : (
                          <Button variant="secondary" className="mt-2" disabled>
                            No tracking available
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                  {/* Confirm Delivery */}
                  {selectedItem.status === 'ItemShipped' ||
                    (selectedItem.status === 'InTransit' && (
                      <div className="flex p-4 bg-mono-0 relative flex-col gap-1 items-start">
                        <div
                          className={`w-[18px] h-[18px] rounded-full absolute dots-item-indicator left-[-36px] top-0 ${selectedItem.status === 'complete' ? 'bg-[#6A0398]' : 'states-not-complete'}`}
                        ></div>
                        <div className="flex items-center gap-4">
                          <p className="body-bold-small">Item received?</p>
                          <Button
                            variant="primary"
                            onClick={handleConfirmDelivery}
                            className="bg-purple-600 text-white px-4 py-2 mt-2"
                          >
                            Confirm delivery
                          </Button>
                        </div>
                      </div>
                    ))}

                  {/* Item Delivered */}
                  {selectedItem.status === 'Delivered' ||
                  selectedItem.status === 'SalesProceeds' ? (
                    <div className="flex p-4 bg-mono-0 relative flex-col gap-1 items-start">
                      <div
                        className={`w-[18px] h-[18px] rounded-full absolute dots-item-indicator left-[-36px] top-0 ${selectedItem.status === 'Delivered' || selectedItem.status === 'SalesProceeds' ? 'bg-[#6A0398]' : 'states-not-complete'}`}
                      ></div>
                      <div>
                        <p className="body-bold-small">Item received</p>
                        <p className="forms text-mono-70 mt-1">
                          {new Date(
                            selectedItem.updatedAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}

                  {/* Sale Proceeding Sent */}
                  {selectedItem.status === 'SalesProceeds' && (
                    <div className="flex p-4 bg-mono-0 relative flex-col gap-1 items-start">
                      <div
                        className={`w-6 h-6 flex justify-center items-center rounded-full absolute dots-item-indicator left-[-38px] bottom-0 ${selectedItem.status === 'SalesProceeds' ? 'bg-[#6A0398]' : 'states-not-complete !left-[-36px]'}`}
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
                      <div>
                        <p className="body-bold-small">
                          Sale proceeds sent to {selectedItem.charityName}
                        </p>
                        <p className="forms text-mono-70 mt-1">
                          {new Date(
                            selectedItem.updatedAt
                          ).toLocaleDateString()}
                        </p>

                        {/* Display dynamic charity and admin fee calculation */}
                        <div>
                          <p className="body-bold-small">
                            £{selectedItem.charityProfit}
                          </p>
                        </div>
                      </div>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoughtItems;
