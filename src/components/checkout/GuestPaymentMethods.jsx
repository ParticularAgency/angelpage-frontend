'use client';



import React, { useEffect, useState } from 'react';

import { EditIcon, SaveIcon } from '@/icons';

import { Button, Checkbox, Input } from '@/components/elements';

import {

  isUkCountry,

  getAddressPostcode,

} from '@/utils/ukValidation';
import { preferredCountryName } from '@/lib/marketPreference';



const GUEST_PAYMENT_KEY = 'angelpage_guest_payment_methods';



const readGuestPayments = () => {

  if (typeof window === 'undefined') return [];

  try {

    const raw = localStorage.getItem(GUEST_PAYMENT_KEY);

    return raw ? JSON.parse(raw) : [];

  } catch {

    return [];

  }

};



const writeGuestPayments = items => {

  if (typeof window !== 'undefined') {

    localStorage.setItem(GUEST_PAYMENT_KEY, JSON.stringify(items));

  }

};



const GuestPaymentMethods = ({

  setSelectedPaymentMethod,

  selectedAddress,

  guestName,

}) => {

  const [paymentMethods, setPaymentMethods] = useState([]);

  const [selectedPaymentIndex, setSelectedPaymentIndex] = useState(0);

  const [isAdding, setIsAdding] = useState(false);

  const [editingIndex, setEditingIndex] = useState(null);

  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [paymentToDelete, setPaymentToDelete] = useState(null);

  const [newPayment, setNewPayment] = useState({

    nameAccountHolder: '',

    billingAddress: {

      name: '',

      address: '',

      city: '',

      country: 'United States',

      postCode: '',

    },

  });



  useEffect(() => {

    const saved = readGuestPayments();

    setPaymentMethods(saved);

    if (saved.length > 0) {

      setSelectedPaymentIndex(0);

      setSelectedPaymentMethod(saved[0]);

    }

  }, [setSelectedPaymentMethod]);

  useEffect(() => {
    const country = preferredCountryName();
    setNewPayment(prev =>
      prev.billingAddress?.country === country
        ? prev
        : {
            ...prev,
            billingAddress: { ...prev.billingAddress, country },
          },
    );
  }, []);



  useEffect(() => {

    if (useShippingAsBilling && selectedAddress && isAdding) {

      setNewPayment(prev => ({

        ...prev,

        nameAccountHolder:

          guestName || selectedAddress.name || prev.nameAccountHolder,

        billingAddress: {

          name: selectedAddress.name || guestName || '',

          address: selectedAddress.address || '',

          city: selectedAddress.city || '',

          country: selectedAddress.country || preferredCountryName(),

          postCode: getAddressPostcode(selectedAddress),

        },

      }));

    }

  }, [useShippingAsBilling, selectedAddress, guestName, isAdding]);



  const handlePaymentSelection = index => {

    setSelectedPaymentIndex(index);

    setSelectedPaymentMethod(paymentMethods[index]);

  };



  const handleAddNewClick = () => {

    setNewPayment({

      nameAccountHolder: guestName || '',

      billingAddress: {

        name: guestName || '',

        address: '',

        city: '',

        country: preferredCountryName(),

        postCode: '',

      },

    });

    setIsAdding(true);

    setEditingIndex(null);

    setUseShippingAsBilling(true);

  };



  const handleEditClick = index => {

    setNewPayment(paymentMethods[index]);

    setEditingIndex(index);

    setIsAdding(true);

    setUseShippingAsBilling(false);

  };



  const resetForm = () => {

    setIsAdding(false);

    setEditingIndex(null);

    setUseShippingAsBilling(true);

    setNewPayment({

      nameAccountHolder: '',

      billingAddress: {

        name: '',

        address: '',

        city: '',

        country: preferredCountryName(),

        postCode: '',

      },

    });

  };



  const handleSave = () => {

    let billingAddress = { ...newPayment.billingAddress };



    if (useShippingAsBilling && selectedAddress) {

      billingAddress = {

        name: selectedAddress.name || guestName || '',

        address: selectedAddress.address || '',

        city: selectedAddress.city || '',

        country: selectedAddress.country || preferredCountryName(),

        postCode: getAddressPostcode(selectedAddress),

      };

    }



    if (!newPayment.nameAccountHolder?.trim()) {

      alert('Please enter the name on card.');

      return;

    }

    if (!billingAddress.postCode?.trim()) {

      alert('Please enter a UK postcode for billing.');

      return;

    }

    if (!isUkCountry(billingAddress.country)) {

      alert('Billing address must be in the United States, Canada, or the United Kingdom.');

      return;

    }



    const method = {

      id:

        editingIndex !== null

          ? paymentMethods[editingIndex].id

          : `guest-pm-${Date.now()}`,

      nameAccountHolder: newPayment.nameAccountHolder.trim(),

      billingAddress,

    };



    let next;

    if (editingIndex !== null) {

      next = paymentMethods.map((item, index) =>

        index === editingIndex ? method : item

      );

      setSelectedPaymentIndex(editingIndex);

    } else {

      next = [...paymentMethods, method];

      setSelectedPaymentIndex(next.length - 1);

    }



    setPaymentMethods(next);

    writeGuestPayments(next);

    setSelectedPaymentMethod(method);

    resetForm();

  };



  const handleDelete = () => {

    if (!paymentToDelete) return;

    const next = paymentMethods.filter(method => method.id !== paymentToDelete);

    setPaymentMethods(next);

    writeGuestPayments(next);

    const nextIndex = Math.min(selectedPaymentIndex, Math.max(next.length - 1, 0));

    setSelectedPaymentIndex(nextIndex);

    setSelectedPaymentMethod(next[nextIndex] || null);

    setIsConfirmOpen(false);

    setPaymentToDelete(null);

  };



  const handleChange = e => {

    const { name, value } = e.target;

    if (name in newPayment.billingAddress) {

      setNewPayment({

        ...newPayment,

        billingAddress: { ...newPayment.billingAddress, [name]: value },

      });

    } else {

      setNewPayment({ ...newPayment, [name]: value });

    }

  };



  return (

    <div className="payment-section pt-6 pb-0">

      <div className="title-line-area-section flex pb-[13px] justify-between items-center gap-3 w-full border-0!">

        <p className="body-bold-regular">Payment Methods</p>

        <Button

          variant="accend-link"

          className="underline text-primary-color-100!"

          onClick={handleAddNewClick}

        >

          Add new payment method

        </Button>

      </div>



      {isAdding && (

        <div className="my-6 adding-payment-methods-area">

          <div className="flex justify-end space-x-4 mt-4 payment-methods-head">

            <Button

              variant="accend-link"

              className="text-primary-color-100!"

              onClick={resetForm}

            >

              Cancel

            </Button>

            <Button

              variant="accend-link"

              className="text-primary-color-100!"

              onClick={handleSave}

            >

              Save <SaveIcon />

            </Button>

          </div>

          <div className="payment-methods-items-wrap">

            <Input

              label="Name on card"

              type="text"

              name="nameAccountHolder"

              value={newPayment.nameAccountHolder}

              onChange={handleChange}

              className="w-full max-w-[386px] sm:max-w-full px-3 forms py-2 border rounded-md flex-col"

            />

            <div className="p-4">

              <Checkbox

                name="billingCheckbox"

                checked={useShippingAsBilling}

                onChange={() => setUseShippingAsBilling(!useShippingAsBilling)}

                label="Billing address the same as shipping address"

              />

            </div>

            {!useShippingAsBilling && (

              <>

                <Input

                  label="Billing Name"

                  type="text"

                  name="name"

                  value={newPayment.billingAddress.name}

                  onChange={handleChange}

                  className="w-full flex-col max-w-[386px] px-3 py-2 border rounded-md"

                />

                <Input

                  label="Address"

                  type="text"

                  name="address"

                  value={newPayment.billingAddress.address}

                  onChange={handleChange}

                  className="w-full flex-col max-w-[386px] px-3 py-2 border rounded-md"

                />

                <Input

                  label="City"

                  type="text"

                  name="city"

                  value={newPayment.billingAddress.city}

                  onChange={handleChange}

                  className="w-full max-w-[386px] sm:max-w-full px-3 flex-col py-2 border rounded-md"

                />

                <Input

                  label="Postal Code"

                  type="text"

                  name="postCode"

                  value={newPayment.billingAddress.postCode}

                  onChange={handleChange}

                  className="w-full max-w-[386px] sm:max-w-full px-3 py-2 flex-col border rounded-md"

                />

                <label className="flex w-full max-w-[386px] flex-col px-3 py-2 text-body-small sm:max-w-full">
                  Country
                  <select
                    name="country"
                    value={newPayment.billingAddress.country}
                    onChange={handleChange}
                    className="mt-1 border border-mono-100 bg-white px-3 py-2"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </label>

              </>

            )}

          </div>

        </div>

      )}



      {paymentMethods.map((method, index) => (

        <div key={method.id || index} className="mb-8">

          <div className="payment-wrapper-box-head flex items-center justify-between pt-3 pr-2 pb-[9px] pl-[25px]">

            <input

              type="radio"

              name="selectedPaymentMethod"

              checked={selectedPaymentIndex === index}

              onChange={() => handlePaymentSelection(index)}

              className="radio w-4 h-4 focus:rounded-full selecting-checkbox-item "

            />

            <div className="flex space-x-4">

              <Button

                variant="accend-link"

                className="underline! text-primary-color-100! flex items-center gap-2"

                onClick={() => handleEditClick(index)}

              >

                Edit <EditIcon />

              </Button>

            </div>

          </div>

          <div className="payment-details px-[25px]">

            <p className="body-bold-small">{method.nameAccountHolder}</p>

            <p className="body-bold-small">Card entered at checkout</p>

            <p className="forms-bold text-mono-80 mb-2">Billing address</p>

            <p className="body-small text-mono-100">

              {method.billingAddress.name}

            </p>

            <p className="body-small text-mono-100">

              {method.billingAddress.address}

            </p>

            <p className="body-small text-mono-100">

              {method.billingAddress.city}

            </p>

            <p className="body-small text-mono-100">

              {method.billingAddress.country}

            </p>

            <p className="body-small text-mono-100">

              {method.billingAddress.postCode}

            </p>

            <button

              onClick={() => {

                setPaymentToDelete(method.id);

                setIsConfirmOpen(true);

              }}

              className="flex items-center body-small mt-4 gap-1 text-primary-color-100"

            >

              Delete card details

            </button>

          </div>

        </div>

      ))}



      {isConfirmOpen && (

        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">

          <div className="bg-white p-6 shadow-lg max-w-sm w-full mx-4">

            <h3 className="h6 font-primary">Are you sure?</h3>

            <p className="text-body-small mt-2">

              This action cannot be undone.

            </p>

            <div className="flex justify-end gap-4 mt-6">

              <Button

                variant="secondary"

                onClick={() => setIsConfirmOpen(false)}

              >

                No

              </Button>

              <Button variant="primary" onClick={handleDelete}>

                Yes, delete

              </Button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};



export default GuestPaymentMethods;

