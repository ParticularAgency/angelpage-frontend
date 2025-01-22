'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Button, Input } from '@/components/elements';
import { useSession } from 'next-auth/react';
import axios from 'axios';
// import { DeleteIcon } from '@/icons';
import { ToastService } from '@/components/elements/notifications/ToastService';
import Link from 'next/link';
import LoadingModal from '@/icons/loadingModal';

const SoldItemsPage = () => {
  const { data: session, status } = useSession() || {};
  const [soldItems, setSoldItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [setCountSoldItem] = useState(null);
  const [inputTrackingNumber, setInputTrackingNumber] = useState('');
  const [trackingError, setTrackingError] = useState('');
  const [loading, setLoading] = useState(true);
  // const [generateLabelError, setGenerateLabelError] = useState('');
  const [isGeneratingLabel, setIsGeneratingLabel] = useState(false);

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
      console.log('sold items', soldItems);
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
            carrierCode: selectedItem.carrierCode || 'hermes', // Default carrier code if missing
            labelId: selectedItem.labelId || '', // Optional
            serviceCode: selectedItem.serviceCode || '', // Optional
            notifyCustomer: true,
            notifySalesChannel: true,
          }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to update order status.');
      }

      const { order } = await response.json();

      setSelectedItem({
        ...selectedItem,
        status: order.status,
        trackingNumber: order.trackingNumber,
        carrierCode: order.carrierCode,
      });

      setSoldItems(
        soldItems.map(item => (item.orderId === order._id ? order : item))
      );

      setInputTrackingNumber('');
      setTrackingError('');
      ToastService.success('Shipment confirmed successfully!');
    } catch (error) {
      console.error('Error confirming shipment:', error);
      setTrackingError(error.message || 'Failed to update order status.');
      ToastService.error('Failed to confirm shipment.');
    }
  };

  const handleGenerateLabel = async () => {
    if (!selectedItem) return;

    setIsGeneratingLabel(true);
    //  setGenerateLabelError('');
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/order/orders/${selectedItem.orderId}/createlabel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
      console.log('lebels response', response);
      console.log('lebels data', response.data.order);
      console.log('lebels data labels', response.data.order);
      if (response.data.success) {
        const updatedOrder = response.data.order;

        setSelectedItem({ ...selectedItem, ...updatedOrder });
        setSoldItems(
          soldItems.map(item =>
            item.orderId === updatedOrder._id ? updatedOrder : item
          )
        );
        ToastService.success('Label created successfully!');
      }
    } catch (error) {
      console.error(
        'Error generating label:',
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.message || 'Failed to generate shipping label.';
      //  setGenerateLabelError(errorMessage);
      ToastService.error(errorMessage);
    } finally {
      setIsGeneratingLabel(false);
    }
  };

  const handleTrackingChange = e => {
    setInputTrackingNumber(e.target.value);
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
  if (soldItems.length === 0) {
    return (
      <>
        <div className="not-found-screen-design flex flex-col items-center pt-12 pb-12 custom-container">
          <h5 className="body-bold-medium !text-[18px] text-mono-100 font-medium font-secondary mb-2 text-center">
            No items sold yet
          </h5>
          <p className="body-bold-small font-secondary font-regular text-mono-90 text-center max-w-[620px] w-full mx-auto">
            It seems you haven’t sold anything on the platform so far. Once you
            sell an item, all the relevant details will appear here. Go ahead
            and list your items to start selling!
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
    <div className="sold-item-wrapper-area">
      <div className="sold-item-wrapper-head py-4 flex items-center justify-between">
        <h3 className="body-bold-regular text-mono-100">Sold Items</h3>
        <div className="sold-item-sort-box flex items-center gap-[14px]"></div>
      </div>
      <div className="sold-item-wrapper-cont-box pl-5 pr-9 grid grid-cols-12 gap-0 sm:grid-cols-6 md:px-0">
        <div className="col-span-4 md:col-span-5 sm:col-span-full sold-product-states-items">
          <ul className="space-y-0">
            {!loading && (
              <>
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
                                item.productImages?.[0]?.altText ||
                                'Product image'
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
                        <div className="states-box flex flex-col-reverse justify-between items-end">
                          <span
                            className={`forms-bold bg-[#FCF2FF] inline-block py-1 whitespace-nowrap px-[6px] ${
                              item.status === 'Complete'
                                ? 'text-[#1FC430]'
                                : 'text-[#D10C3B]'
                            }`}
                          >
                            {item.status === 'OrderConfirmed'
                              ? 'Item shipped?'
                              : item.status === 'OrderPlaced'
                                ? 'Awaiting payment'
                                : item.status === 'LabelCreated'
                                  ? 'Awaiting Shipped'
                                  : item.status === 'ItemShipped'
                                    ? 'On the way'
                                    : item.status === 'InTransit'
                                      ? 'In transit'
                                      : item.status === 'Delivered'
                                        ? 'Delivered'
                                        : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>

        <div
          className={`col-span-8 md:col-span-7 pt-[23px] pr-[45px] md:pr-4 md:pl-4 pb-[50px] bg-[#F1F1F7] pl-5 sm:col-span-full sold-product-states-item-cont sticky sm:relative top-[30px]  ${loading ? 'h-full' : 'h-[65vh]'}`}
        >
          {!loading && (
            <>
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
                        <p className="body-bold-small">
                          {selectedItem.status === 'OrderPlaced'
                            ? 'Purchase fail'
                            : 'Purchase Confirmed'}
                        </p>
                        <p className="purchase-confirmed-date-time forms text-mono-80">
                          {selectedItem.status === 'OrderPlaced' ? (
                            <>
                              {' '}
                              {new Date(
                                selectedItem.orderDate
                              ).toLocaleString()}
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

                      {/* Item Shipped */}
                      <div className="flex relative flex-col gap-1 items-start">
                        <div
                          className={`w-[18px] h-[18px] rounded-full absolute dots-item-indicator left-[-36px] top-0 ${selectedItem.status === 'ItemShipped' || selectedItem.status === 'InTransit' || selectedItem.status === 'Delivered' || selectedItem.status === 'SalesProceeds' ? 'bg-[#6A0398]' : 'states-not-complete'}`}
                        ></div>
                        <div className="flex items-start flex-col gap-2 justify-start w-full">
                          {selectedItem.status === 'ItemShipped' ||
                          selectedItem.status === 'Delivered' ||
                          selectedItem.status === 'InTransit' ||
                          selectedItem.status === 'SalesProceeds' ? (
                            <>
                              <div className="bg-mono-0 p-4 w-full">
                                <p className="body-bold-small mb-0">
                                  Item Shipped
                                </p>
                                <p className="forms text-mono-70 mt-1">
                                  {' '}
                                  <>
                                    {new Date(
                                      selectedItem.paymentConfirmedAt
                                    ).toLocaleString()}
                                  </>
                                </p>
                                <p className="body-bold-small mt-1 flex items-center gap-1">
                                  Tracking:{' '}
                                  <span className="text-primary-color-100">
                                    {' '}
                                    {selectedItem.trackingNumber}
                                  </span>
                                </p>
                                {selectedItem?.label_download ? (
                                  <Link
                                    target="_blank"
                                    href={selectedItem.label_download}
                                  >
                                    <Button
                                      variant="accend-link"
                                      className="!underline !text-primary-color-100 !py-0 !px-0"
                                    >
                                      Download order label
                                    </Button>
                                  </Link>
                                ) : (
                                  <Button variant="secondary" disabled>
                                    No label available
                                  </Button>
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="create-label-area bg-mono-0 p-4 w-full">
                                {selectedItem && (
                                  <>
                                    <p className="body-bold-small mb-2">
                                      Item Details
                                    </p>
                                    <div className="mb-3">
                                      <p className="body-bold-small  flex items-center gap-1">
                                        <strong>Order Id:</strong>{' '}
                                        <span className="!text-primary-color-100">
                                          {' '}
                                          {selectedItem.shipStationOrderId}{' '}
                                        </span>
                                        <Button
                                          className=" !py-0 !px-1 !h-6 mt-[-3px]"
                                          onClick={() => {
                                            navigator.clipboard.writeText(
                                              selectedItem.shipStationOrderId
                                            );
                                            ToastService.success(
                                              'Order ID copied to clipboard!'
                                            );
                                          }}
                                          variant="accend-link"
                                        >
                                          <Image
                                            src="/images/copy-svgrepo-com.svg"
                                            alt="copy item icon"
                                            width={24}
                                            height={24}
                                            className="w-5 h-5 object-cover"
                                          />
                                        </Button>
                                      </p>
                                      <p className="body-bold-small">
                                        <strong>Shipping cost:</strong>{' '}
                                        <span className="!text-primary-color-100">
                                          {' '}
                                          {selectedItem.shipmentCost}
                                        </span>
                                      </p>
                                      <p className="body-bold-small">
                                        <strong>Status:</strong>{' '}
                                        {selectedItem.status}
                                      </p>
                                      {selectedItem.trackingNumber && (
                                        <>
                                          <p className="body-bold-small flex items-center gap-1">
                                            <strong>Tracking number:</strong>{' '}
                                            {'  '}
                                            <span className="!text-primary-color-100">
                                              {' '}
                                              {selectedItem.trackingNumber}
                                            </span>
                                            <Button
                                              onClick={() => {
                                                navigator.clipboard.writeText(
                                                  selectedItem.trackingNumber
                                                );
                                                ToastService.success(
                                                  'Tracking number copied to clipboard!'
                                                );
                                              }}
                                              variant="accend-link"
                                              className=" !py-0 !px-1 !h-6 mt-[-3px]"
                                            >
                                              <Image
                                                src="/images/copy-svgrepo-com.svg"
                                                alt="copy item icon"
                                                width={24}
                                                height={24}
                                                className="w-5 h-5 object-cover"
                                              />
                                            </Button>
                                          </p>
                                        </>
                                      )}
                                    </div>

                                    {selectedItem.status === 'LabelCreated' ? (
                                      <>
                                        {selectedItem?.label_download ? (
                                          <Link
                                            target="_blank"
                                            href={selectedItem.label_download}
                                          >
                                            <Button variant="primary">
                                              Download order label
                                            </Button>
                                          </Link>
                                        ) : (
                                          <Button variant="secondary" disabled>
                                            No label available
                                          </Button>
                                        )}
                                      </>
                                    ) : (
                                      <Button
                                        variant="primary"
                                        onClick={handleGenerateLabel}
                                        disabled={isGeneratingLabel}
                                      >
                                        {isGeneratingLabel
                                          ? 'Generating label...'
                                          : 'Generate order label'}
                                      </Button>
                                    )}
                                  </>
                                )}
                              </div>

                              {selectedItem.status === 'LabelCreated' ? (
                                <div className="bg-mono-0 p-4 w-full">
                                  <p className="body-bold-small">
                                    Item Shipped?
                                  </p>
                                  <div className="flex sm:flex-col gap-2 items-center w-full">
                                    <Input
                                      type="text"
                                      value={inputTrackingNumber}
                                      onChange={handleTrackingChange}
                                      placeholder="Tracking number"
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
                                </div>
                              ) : (
                                ''
                              )}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoldItemsPage;
