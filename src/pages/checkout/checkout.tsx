"use client";
import Image from "next/image";
import Link from 'next/link'
import { useState } from "react";

// Initial data for shipping and payment
const initialAddress = {
  name: "Wilson Ndasi",
  address: "826 Zenix Crescent, Thompsonland W2 6FT",
  city: "",
  country: "",
  postalCode: "",
};

const initialPaymentMethod = {
  cardType: "Visa",
  lastFourDigits: "5016",
  billingAddress: "826 Zenix Crescent, Thompsonland W2 6FT",
};

const BasketPage = () => {
      const [addresses, setAddresses] = useState([initialAddress]); // Store multiple addresses
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0); // Default selected address index
  const [newAddress, setNewAddress] = useState(initialAddress);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod);
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [isPriceSplitOpen, setIsPriceSplitOpen] = useState(false);

  // Edit existing address
  const handleEditAddress = (index: number) => {
    setSelectedAddressIndex(index);
    setNewAddress(addresses[index]);
    setIsEditingAddress(true);
    setIsAddingNewAddress(false);
  };

  // Save address (new or edited)
  const handleSaveAddress = () => {
    const updatedAddresses = [...addresses];
    if (isAddingNewAddress) {
      updatedAddresses.push(newAddress);
    } else {
      updatedAddresses[selectedAddressIndex] = newAddress;
    }
    setAddresses(updatedAddresses);
    setIsEditingAddress(false);
    setIsAddingNewAddress(false);
    setNewAddress(initialAddress); // Reset newAddress to initial
  };

  // Cancel editing or adding
  const handleCancelAddress = () => {
    setIsEditingAddress(false);
    setIsAddingNewAddress(false);
    setNewAddress(initialAddress); // Reset newAddress to initial
  };

  // Handle address selection
  const handleAddressSelection = (index: number) => {
    setSelectedAddressIndex(index);
  };

  // Edit payment method
  const handleEditPayment = () => setIsEditingPayment(true);
  const handleSavePayment = () => setIsEditingPayment(false);

  // Handlers for Price Split Modal
  const handlePriceSplitClick = () => setIsPriceSplitOpen(true);
  const handleClosePriceSplit = () => setIsPriceSplitOpen(false);

  return (
    <div className="basket-page-main-wrapper">
     <div className="custom-container max-w-[1008px]">
        <section className="basket-page-banner-area py-8 flex flex-col items-center">
           <h1 className="h4 banner-title">Basket</h1>
            <ul className="breadcrumb-area flex items-center gap-[10px] mt-[14px]">
                 <li className="breadcrumb-item body-caption prev-pages flex items-center gap-[10px]">
                    <Link className="body-caption text-mono-100" href="/">Basket</Link>
                    <span className="angle">{">"}</span>
                 </li>
                  <li className="breadcrumb-item body-caption current-page text-mono-70 flex items-center gap-[10px]">
                    <Link href="" className="body-caption text-mono-70">Order confirmation</Link>
                 </li>
             </ul>
        </section>
        <section className="basket-page-main-content-grid grid grid-cols-12 gap-5">
          <div className="basket-page-left-cont col-span-7 md:col-span-6 sm:col-span-full">
           <div className="basket-product-items">
               <h2 className="h5 font-primary text-mono-100 mb-4">Items</h2>
               <div className="basket-added-product-items"> 
                  <div className="basket-added-product-item">
                    <div className="basket-product-item-head gap-[23px] flex items-center">
                        <div className="seller-info-box flex items-center gap-[13px] pb-4">
                             <Image
                src="/images/users/users1.jpg"
                alt="Seller"
                width={74}
                height={70}
                className="w-8 h-8 rounded-full object-cover"
                />
                            <div className="seller-info-cont">
                                <p className="caption mb-[2px]">Seller</p>
                <p className="eyebrow-medium text-black">WHITNEY MOSS</p>
                            </div>
                        </div>
                        <div className="delivery-timeline">
                         <span className="p-2 body-bold-small bg-[#FCF2FF] text-primary-color-100 rounded-[24px]">
                          5-7 business days
                          </span>
                        </div>
                    </div>
                      <div className="added-product-item-info-box flex items-start gap-5 justify-between py-8">
            <div className="added-product-item-left-cont flex items-start gap-[18px]">
                <Image
                src="/images/products/handbags.png"
                alt="Seller"
                width={74}
                height={70}
                className="w-[74px] h-[70px] object-cover"
                />
                <div className="added-product-info">
                    <p className="product-brand eyebrow-medium text-mono-100">PRADA</p>
                    <p className="product-title caption-bold mt-[3px] text-mono-70">Handbag</p>
                <p className="product-specification caption mt-2">
                    Height: 00in &nbsp;|&nbsp; Weight: 00in
                </p>
                <p className="flex items-center gap-[13px] mt-[13px] caption">
                 <Image src="/images/icons/location.svg" alt="location icons" width={10} height={12} /> London
                </p>
                </div>
            </div>
            <div className="added-product-item-right-cont">
                <p className="body-bold-medium text-mono-100">£60.00</p>
                <button
                className="caption mt-2 text-primary-color-100 !underline"
                onClick={handlePriceSplitClick}
                >
                Price split
                </button>
            </div>
            </div>
                  </div>
                    <div className="basket-added-product-item pt-6">
                    <div className="basket-product-item-head gap-[23px] flex items-center">
                        <div className="seller-info-box flex items-center gap-[13px] pb-4">
                             <Image
                src="/images/users/users2.jpg"
                alt="Seller"
                width={74}
                height={70}
                className="w-8 h-8 rounded-full object-cover"
                />
                            <div className="seller-info-cont">
                                <p className="caption mb-[2px]">Seller</p>
                <p className="eyebrow-medium text-black">Mike Hilll</p>
                            </div>
                        </div>
                        <div className="delivery-timeline">
                         <span className="p-2 body-bold-small bg-[#FCF2FF] text-primary-color-100 rounded-[24px]">
                          5-7 business days
                          </span>
                        </div>
                    </div>
                      <div className="added-product-item-info-box flex items-start gap-5 justify-between py-8">
            <div className="added-product-item-left-cont flex items-start gap-[18px]">
                <Image
                src="/images/products/handbags.png"
                alt="Seller"
                width={74}
                height={70}
                className="w-[74px] h-[70px] object-cover"
                />
                <div className="added-product-info">
                    <p className="product-brand eyebrow-medium text-mono-100">Jordan</p>
                    <p className="product-title caption-bold mt-[3px] text-mono-70">Jordan Dunks</p>
                <p className="product-specification caption mt-2">
                   Size: 10 UK
                </p>
                <p className="flex items-center gap-[13px] mt-[13px] caption">
                 <Image src="/images/icons/location.svg" alt="location icons" width={10} height={12} /> Manchester
                </p>
                </div>
            </div>
            <div className="added-product-item-right-cont">
                <p className="body-bold-medium text-mono-100">£60.00</p>
                <button
                className="caption mt-2 text-primary-color-100 !underline"
                onClick={handlePriceSplitClick}
                >
                Price split
                </button>
            </div>
            </div>
                  </div>
                 
               </div>
           </div>
 

            <div className="">
            <div className="">
                {/* Shipping Information */}
                <h3 className="h5 font-primary text-mono-100">Shipping</h3>
                {addresses.map((address, index) => (
                <div className="border p-4 mb-4" key={index}>
                    <div className="flex justify-between">
                    <div className="flex items-center">
                        <input
                        type="radio"
                        name="shippingAddress"
                        checked={selectedAddressIndex === index}
                        onChange={() => handleAddressSelection(index)}
                        className="mr-2"
                        />
                        <div>
                        <p className="font-bold">{address.name}</p>
                        <p>{address.address}, {address.city}</p>
                        <p>{address.country}, {address.postalCode}</p>
                        </div>
                    </div>

                    {!isEditingAddress || selectedAddressIndex !== index ? (
                        <button
                        className="text-sm text-blue-500 underline"
                        onClick={() => handleEditAddress(index)}
                        >
                        Edit
                        </button>
                    ) : (
                        <div className="w-full">
                        <input
                            type="text"
                            value={newAddress.name}
                            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                            className="w-full p-2 mb-2 border"
                        />
                        <input
                            type="text"
                            value={newAddress.address}
                            onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                            className="w-full p-2 mb-2 border"
                        />
                        <input
                            type="text"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            className="w-full p-2 mb-2 border"
                        />
                        <input
                            type="text"
                            value={newAddress.country}
                            onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                            className="w-full p-2 mb-2 border"
                        />
                        <input
                            type="text"
                            value={newAddress.postalCode}
                            onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                            className="w-full p-2 mb-2 border"
                        />
                        <div className="flex justify-end">
                            <button className="text-blue-500 underline mr-4" onClick={handleCancelAddress}>
                            Cancel
                            </button>
                            <button className="bg-black text-white px-4 py-2" onClick={handleSaveAddress}>
                            Save
                            </button>
                        </div>
                        </div>
                    )}
                    </div>
                </div>
                ))}

                {/* Add New Address Section */}
                <div>
                {!isAddingNewAddress ? (
                    <button
                    className="text-sm text-blue-500 underline"
                    onClick={() => setIsAddingNewAddress(true)}
                    >
                    Add new address
                    </button>
                ) : (
                    <div className="border p-4 mb-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        className="w-full p-2 mb-2 border"
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                        className="w-full p-2 mb-2 border"
                    />
                    <input
                        type="text"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full p-2 mb-2 border"
                    />
                    <input
                        type="text"
                        placeholder="Country"
                        value={newAddress.country}
                        onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                        className="w-full p-2 mb-2 border"
                    />
                    <input
                        type="text"
                        placeholder="Postal Code"
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                        className="w-full p-2 mb-2 border"
                    />
                    <div className="flex justify-end">
                        <button className="text-blue-500 underline mr-4" onClick={handleCancelAddress}>
                        Cancel
                        </button>
                        <button className="bg-black text-white px-4 py-2" onClick={handleSaveAddress}>
                        Save
                        </button>
                    </div>
                    </div>
                )}
                </div>
            </div>

            {/* Payment Method Section */}
            <div>
                <h3 className="h5 font-primary text-mono-100">Payment Method</h3>
                <div className="border p-4 mb-4">
                <div className="flex justify-between">
                    <div>
                    <p className="font-bold">{paymentMethod.cardType} ending in {paymentMethod.lastFourDigits}</p>
                    <p>{paymentMethod.billingAddress}</p>
                    </div>
                    {!isEditingPayment ? (
                    <button className="text-sm text-blue-500 underline" onClick={handleEditPayment}>
                        Edit
                    </button>
                    ) : (
                    <div>
                        <input
                        type="text"
                        value={paymentMethod.cardType}
                        onChange={(e) => setPaymentMethod({ ...paymentMethod, cardType: e.target.value })}
                        className="w-full p-2 mb-2 border"
                        />
                        <input
                        type="text"
                        value={paymentMethod.lastFourDigits}
                        onChange={(e) => setPaymentMethod({ ...paymentMethod, lastFourDigits: e.target.value })}
                        className="w-full p-2 mb-2 border"
                        />
                        <div className="flex justify-end">
                        <button className="text-blue-500 underline mr-4" onClick={handleSavePayment}>
                            Save
                        </button>
                        </div>
                    </div>
                    )}
                </div>
                </div>
            </div>
            </div>
          </div> 

          <div className="basket-page-right-cont col-span-5 md:col-span-6 sm:col-span-full">
            <div className="border p-6 bg-[#F1F1F7]">
                <div className="flex justify-between items-end">
                <h3 className="body-bold-medium mb-4">Order summary</h3>
                <p className="font-semibold product-total-price">£100.00</p>
                </div>
              <div className="order-item-list-box">
                <p className="colaps-title body-regular mb-4">Order details <span className="number-of-product-for-price">(2 items)</span></p>
              </div>
                <div className="mb-6">
                <p className="eyebrow-medium">PRADA</p>
                <p className="caption-bold text-mono-80">Handbag</p>
                <div className="flex justify-between  caption-bold pl-[21px]">
                    <p className="caption-bold text-mono-80">Price</p>
                    <p className="caption-bold text-mono-80 mt-1">£50.00</p>
                </div>
                <div className="flex justify-between caption-bold pl-[21px]">
                    <p className="caption-bold text-mono-80">Charity profit (90%)</p>
                    <p className="caption-bold text-mono-80 mt-1">£45.00</p>
                </div>
                </div>

                <div className="mb-6">
                <p className="eyebrow-medium">JORDAN</p>
                <p className="caption-bold text-mono-80">Jordan Dunks</p>
                <div className="flex justify-between  caption-bold pl-[21px]">
                     <p className="caption-bold text-mono-80">Price</p>
                     <p className="caption-bold text-mono-80">£40.00</p> 
                </div>
                <div className="flex justify-between caption-bold pl-[21px]">
                     <p className="caption-bold text-mono-80">Charity profit (90%)</p>
                     <p className="caption-bold text-mono-80">£36.00</p> 
                </div>
                </div>

            <div className="summary-foot border-t pt-6">
                <div className="flex justify-between mb-2">
                    <p className="caption-bold text-mono-80">Angelpage admin fee</p>
                    <p className="caption-bold text-mono-80">£10.00</p>
                </div>
                <div className="flex justify-between mb-2">
                    <p className="caption-bold text-mono-80">Charity profit (90%)</p>
                    <p className="caption-bold text-mono-80">£90.00</p>
                </div>
                </div>

                <div className="flex justify-between font-bold border-t pt-4 mt-4">
                <p className="body-bold-medium product-total-price">Total</p>
                <p className="body-bold-medium">£100.00</p>
                </div>

                <button className="mt-6 w-full bg-black text-white py-2">Pay now</button>
            </div>
          </div>
           
        {isPriceSplitOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={handleClosePriceSplit}>
                &times;
                </button>
                <h3 className="text-lg font-semibold mb-4 text-center">Price split</h3>
                <div className="flex items-start mb-4">
                <Image src="/images/icons/hand-help.svg" alt='info icon image' width={13} height={13} />
                <div>
                    <h4 className="text-base font-semibold text-purple-700">Charity profit:</h4>
                    <p className="text-gray-600">The charity that hosts the item will receive 90% of the total cost of the item.</p>
                </div>
                </div>
                <div className="flex items-start mb-4">
                <Image src="/images/icons/Info-quare.svg" alt='info icon image' width={13} height={13} />
                <div>
                    <h4 className="text-base font-semibold text-purple-700">Angelpage administration fees:</h4>
                    <p className="text-gray-600">Angelpage retains the remaining 10% of each item cost. This helps Angelpage support users of the platform.</p>
                </div>
                </div>
                <div className="flex justify-end">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-md" onClick={handleClosePriceSplit}>Close</button>
                </div>
            </div>
            </div>
        )}
        </section>
     </div>
    </div>
  )
}

export default BasketPage
