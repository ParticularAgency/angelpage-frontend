import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/elements';

// Sample data
const boughtItems = [
  {
    id: 1,
    productBrand: 'HOLLISTER',
    productTitle: 'Crew Neck Jumper',
    productPrice: '£10.00',
    productImageSrc: '/images/products/handbags.png',
    saleDate: '24 Aug 2024',
    status: 'Complete',
    trackingNumber: 'DV123456789',
    stages: {
      confirmed: true,
      shipped: true,
      delivered: true,
      saleProceeding: true,
    },
    saleDetails: {
      sentTo: 'Samaritans Ltd',
      date: '8 Nov 2024',
    },
  },
  {
    id: 2,
    productBrand: 'JORDAN',
    productTitle: 'Jordan Dunks',
    productPrice: '£10.00',
    productImageSrc: '/images/products/suitcase.png',
    saleDate: '21 Aug 2024',
    status: 'Item received?',
    trackingNumber: 'DV987654321',
    stages: {
      confirmed: true,
      shipped: true,
      delivered: false,
      saleProceeding: false,
    },
    saleDetails: {},
  },
  {
    id: 3,
    productBrand: 'APPLE',
    productTitle: 'iPhone 13',
    productPrice: '£50.00',
    productImageSrc: '/images/products/mules.png', 
    saleDate: '25 Aug 2024',
    status: 'Complete',
    trackingNumber: 'DV543210987',
    stages: {
      confirmed: true,
      shipped: true,
      delivered: true,
      saleProceeding: true,
    },
    saleDetails: {
      sentTo: 'Samaritans Ltd',
      date: '8 Nov 2024',
    },
  },
];

// Function to calculate charity proceeds and administration fees
const calculateFees = (priceString: string) => {
  const price = parseFloat(priceString.replace('£', '')); // Parse the price from string to number
  const charityProceeds = (price * 0.9).toFixed(2); // 90% goes to charity
  const adminFee = (price * 0.1).toFixed(2); // 10% is administration fee
  return { charityProceeds, adminFee };
};
const BoughtItems = () => {
  const [selectedItem, setSelectedItem] = useState(boughtItems[0]); // Default to item 1 (Hollister)

  // Function to handle delivery confirmation by buyer
  const handleConfirmDelivery = () => {
    setSelectedItem({
      ...selectedItem,
      stages: { ...selectedItem.stages, delivered: true },
      status: 'Complete',
    });
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
            {boughtItems.map((item) => (
              <li
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-4 sm:px-2 bought-product-states-item border cursor-pointer hover:bg-[#F1F1F7] ${item.id === selectedItem?.id ? 'bg-[#F1F1F7]' : ''}`}
              >
                <div className="flex items-center">
                  <div className="flex items-center gap-3 md:gap-[6px] justify-between w-full">
                    <div className="bought-item-info-box flex items-center gap-[33px]  md:gap-4">
                      <div className="bought-item-img">
                        <Image
                          src={item.productImageSrc}
                          className="h-[65px] object-cover"
                          alt="sold product item image"
                          width={70}
                          height={65}
                        />
                      </div>
                      <div className="bought-item-info-cont flex flex-col gap-1">
                        <span className="eyebrow-medium text-mono-100">{item.productBrand}</span>
                        <span className="caption-bold text-mono-70">{item.productTitle}</span>
                        <span className="body-bold-small text-mono-100">{item.productPrice}</span>
                      </div>
                    </div>
                    <span className={`forms-bold bg-[#FAF2FF] inline-block py-1 px-[6px] ${item.status === 'Complete' ? 'text-[#1FC430]' : 'text-[#D10C3B]'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Details for the selected item */}
        <div className="col-span-8 md:col-span-7 pt-[23px] pr-[45px] md:pr-4 md:pl-4 pb-[50px] bg-[#F1F1F7] pl-5 sm:col-span-full sold-product-states-item-cont">
          {selectedItem && (
            <>
              <h3 className="caption">Purchase date</h3>
              <div className="mt-1">
                <p>{selectedItem.saleDate}</p>
              </div>

              <div className="relative mt-[15px]">
                <div className="flex flex-col space-y-6 sm:space-y-3 pl-7 relative sold-product-items-main-item-content">
                  {/* Payment Sent */}
                  <div className="flex p-4 bg-mono-0 relative flex-col gap-1 items-start">
                    <div className={`w-[18px] h-[18px] rounded-full absolute dots-item-indicator left-[-36px] top-0 ${selectedItem.stages.confirmed ? 'bg-[#6A0398]' : 'states-not-complete'}`}></div>
                    <div>
                      <p className="body-bold-small">Payment sent</p>
                      <p className="forms text-mono-70 mt-1">21 Aug 2024</p>
                    </div>
                  </div>

                  {/* Item Dispatched */}
                  <div className="flex p-4 bg-mono-0 relative flex-col gap-1 items-start">
                    <div className={`w-[18px] h-[18px] rounded-full absolute dots-item-indicator left-[-36px] top-0 ${selectedItem.stages.shipped ? 'bg-[#6A0398]' : 'states-not-complete'}`}></div>
                    <div>
                      <p className="text-body-bold-small">Item dispatched</p>
                      <p className="forms text-mono-70 mt-1">23 Aug 2024</p>
                      <p className="body-bold-small mt-1">
                        Tracking: <span className="text-purple-600">{selectedItem.trackingNumber}</span>
                      </p>
                    </div>
                  </div>

                  {/* Confirm Delivery */}
                  {!selectedItem.stages.delivered && (
                    <div className="flex p-4 bg-mono-0 relative flex-col gap-1 items-start">
                      <div className={`w-[18px] h-[18px] rounded-full absolute dots-item-indicator left-[-36px] top-0 ${selectedItem.stages.delivered ? 'bg-[#6A0398]' : 'states-not-complete'}`}></div>
                      <div className='flex items-center gap-4'>
                        <p className="body-bold-small">Item received?</p>
                        <Button
                          variant='primary'
                          onClick={handleConfirmDelivery}
                          className="bg-purple-600 text-white px-4 py-2 mt-2"
                        >
                          Confirm delivery
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Item Delivered */}
                  {selectedItem.stages.delivered && (
                    <div className="flex p-4 bg-mono-0 relative flex-col gap-1 items-start">
                      <div className={`w-[18px] h-[18px] rounded-full absolute dots-item-indicator left-[-36px] top-0 ${selectedItem.stages.delivered ? 'bg-[#6A0398]' : 'states-not-complete'}`}></div>
                      <div>
                        <p className="body-bold-small">Item received</p>
                        <p className="forms text-mono-70 mt-1">27 Aug 2024</p>
                      </div>
                    </div>
                  )}

                  {/* Sale Proceeding Sent */}
                  {selectedItem.stages.saleProceeding && (
                    <div className="flex p-4 bg-mono-0 relative flex-col gap-1 items-start">
                      <div className={`w-6 h-6 flex justify-center items-center rounded-full absolute dots-item-indicator left-[-38px] bottom-0 ${selectedItem.stages.saleProceeding ? 'bg-[#6A0398]' : 'states-not-complete !left-[-36px]'}`}>
                        {selectedItem.stages.saleProceeding && (
                          <Image src="/images/icons/checkmark.svg" alt="checkmark icon" width={16} height={16} />
                        )}
                      </div>
                      <div>
                        <p className="body-bold-small">
                          Sale proceeds sent to {selectedItem.saleDetails.sentTo}
                        </p>
                        <p className="forms text-mono-70 mt-1">{selectedItem.saleDetails.date}</p>

                        {/* Display dynamic charity and admin fee calculation */}
                        <div>
                          {(() => {
                            const { charityProceeds } = calculateFees(selectedItem.productPrice);
                            return (
                              <>
                                <p className="body-bold-small">£{charityProceeds}</p>
                                
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
               {/* Sale Proceeds and Admin Fee */}
            {selectedItem.stages.saleProceeding && (
              <div className="mt-1 pl-8">
                {(() => {
                  const {  adminFee } = calculateFees(selectedItem.productPrice);
                  return (
                    <>
                      <p className="body-small">The remaining {adminFee} was donated as administration fees.</p>
                    </>
                  );
                })()}
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
