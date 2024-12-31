'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Button} from '@/components/elements';
import { useSession } from 'next-auth/react';


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
        console.log(purchaseItems)
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

    if (loading) {
      return <p>Loading...</p>;
    }

    if (!purchaseItems.length) {
      return <p>No items found.</p>;
    }

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
                            item.productImages?.[0]?.altText || 'Product image'
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
                      {item.status === 'OrderPlaced'
                        ? 'Item shipped?'
                        : item.status === 'InTransit'
                          ? 'Item received?'
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

        {/* Details for the selected item */}
        <div className="col-span-8 md:col-span-7 pt-[23px] pr-[45px] md:pr-4 md:pl-4 pb-[50px] bg-[#F1F1F7] pl-5 sm:col-span-full sold-product-states-item-cont  sticky sm:relative top-[30px] h-[65vh]">
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
                      <p className="body-bold-small">Payment sent</p>
                      <p className="forms text-mono-70 mt-1">
                        {' '}
                        {new Date(selectedItem.createdAt).toLocaleDateString()}
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
                            DV38474905867352
                          </span>
                        </p>
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
        </div>
      </div>
    </div>
  );
};

export default BoughtItems;
