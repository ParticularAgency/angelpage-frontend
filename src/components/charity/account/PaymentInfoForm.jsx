'use client';
import React, { useState, useEffect } from 'react';
import { EditIcon, SaveIcon } from '@/icons';
import { Button, Checkbox, Input, Select } from '@/components/elements';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const PaymentInfoForm = () => {
  const { data: session, status } = useSession() || {};
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(false);
  const [selectedShippingAddressId, setSelectedShippingAddressId] =
    useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);

  const [newPayment, setNewPayment] = useState({
    nameAccountHolder: '',
    accountNumber: '',
    expiryDate: '',
    cvvNumber: '',
    billingAddress: {
      name: '',
      address: '',
      city: '',
      country: '',
      postCode: '',
    },
  });

  // Fetch payment methods and addresses on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'authenticated' && session?.token) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/charity/profile`,
            {
              headers: {
                Authorization: `Bearer ${session.token}`,
              },
            }
          );
          setPaymentMethods(response.data.user?.payments || []);
          setAddresses(response.data.user?.addresses || []);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, [session, status]);

  const handleAddNewClick = () => {
    setNewPayment({
      nameAccountHolder: '',
      accountNumber: '',
      expiryDate: '',
      cvvNumber: '',
      billingAddress: {
        name: '',
        address: '',
        city: '',
        country: '',
        postCode: '',
      },
    });
    setIsAdding(true);
    setEditingIndex(null);
    setUseShippingAsBilling(false);
    setSelectedShippingAddressId(null);
  };

  const handleEditClick = index => {
    setNewPayment(paymentMethods[index]);
    setEditingIndex(index);
    setIsAdding(true);
    setUseShippingAsBilling(false);
    setSelectedShippingAddressId(null);
  };

  const handleSave = async () => {
    try {
      let billingAddress = { ...newPayment.billingAddress };

      // Use selected shipping address if `useShippingAsBilling` is checked
      if (useShippingAsBilling && selectedShippingAddressId) {
        const selectedShippingAddress = addresses.find(
          address => address._id === selectedShippingAddressId
        );

        if (selectedShippingAddress) {
          billingAddress = {
            name: selectedShippingAddress.name,
            address: selectedShippingAddress.address,
            city: selectedShippingAddress.city,
            country: selectedShippingAddress.country,
            postCode: selectedShippingAddress.postcode,
          };
        } else {
          console.error('Selected shipping address not found');
          return;
        }
      }

      const payment = {
        ...newPayment,
        billingAddress,
      };

      if (editingIndex !== null) {
        // Update existing payment method
        const paymentId = paymentMethods[editingIndex]._id;
        if (paymentId) {
          await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/charity/profile/payments/${paymentId}`,
            payment,
            {
              headers: {
                Authorization: `Bearer ${session?.token}`,
              },
            }
          );
          setPaymentMethods(
            paymentMethods.map((method, index) =>
              index === editingIndex ? { ...payment, _id: paymentId } : method
            )
          );
        }
      } else {
        // Add new payment method
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/charity/profile/payments`,
          payment,
          {
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          }
        );
        const addedPayment = response.data?.payments?.slice(-1)[0];
        if (addedPayment) setPaymentMethods([...paymentMethods, addedPayment]);
      }

      // Reset form after saving
      setIsAdding(false);
      setNewPayment({
        nameAccountHolder: '',
        accountNumber: '',
        expiryDate: '',
        cvvNumber: '',
        billingAddress: {
          name: '',
          address: '',
          city: '',
          country: '',
          postCode: '',
        },
      });
    } catch (error) {
      console.error('Error saving payment method:', error);
    }
  };

  const handleDelete = async () => {
    if (paymentToDelete) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/charity/profile/payments/${paymentToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          }
        );
        setPaymentMethods(
          paymentMethods.filter(payment => payment._id !== paymentToDelete)
        );
        setIsConfirmOpen(false);
        setPaymentToDelete(null);
      } catch (error) {
        console.error('Error deleting payment method:', error);
      }
    }
  };

  const handleDeleteConfirmation = id => {
    setPaymentToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleCancel = () => {
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

  const handleCheckboxChange = () => {
    setUseShippingAsBilling(!useShippingAsBilling);
    if (!useShippingAsBilling) {
      setSelectedShippingAddressId(null);
    }
  };

  const handleShippingAddressSelect = e => {
    setSelectedShippingAddressId(e.target.value);
  };
  const handleConnectStripe = async () => {
    const code = queryParams.get('code');

    if (code) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/charity/stripe/connect-url`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.token}`,
            },
            body: JSON.stringify({ code }),
          }
        );

        const { url } = await response.json();
        console.log('Stripe Connect URL:', url);

        // Redirect the user to the Stripe Connect URL
        window.location.href = url;
      } catch (error) {
        console.error('Error generating Stripe OAuth URL:', error);
      }
    }
  };

  return (
    <div className="payment-section pt-6 pb-0">
      <div className="title-line-area-section flex pb-[13px] items-center gap-3 w-full !border-0">
        <p className="body-bold-regular whitespace-nowrap w-full">
          Payment Methods
        </p>
        <div className="btn-box flex flex-col items-end">
          <Button
            variant="accend-link"
            className="underline !text-primary-color-100"
            onClick={handleAddNewClick}
          >
            Add new payment method
          </Button>
          <Button
            onClick={handleConnectStripe}
            variant="accend-link"
            className="underline !text-primary-color-100"
          >
            Connect your business account <span className="text-error">*</span>
          </Button>
        </div>
      </div>

      {isAdding && (
        <div className="my-6 adding-payment-methods-area">
          <div className="flex justify-end space-x-4 mt-4 payment-methods-head">
            <Button
              variant="accend-link"
              className="!text-primary-color-100"
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
            <Input
              label="Card number"
              type="text"
              name="accountNumber"
              value={newPayment.accountNumber}
              onChange={handleChange}
              className="w-full max-w-[386px] sm:max-w-full px-3 forms py-2 border rounded-md flex-col"
            />
            <div className="date-and-csv flex items-center gap-6 sm:flex-col px-3">
              <Input
                label="Expiry date"
                type="text"
                name="expiryDate"
                value={newPayment.expiryDate}
                onChange={handleChange}
                className="w-full forms max-w-[120px] sm:max-w-full py-2 !px-0 border rounded-md flex-col"
              />
              <Input
                label="CVV"
                type="text"
                name="cvvNumber"
                value={newPayment.cvvNumber}
                onChange={handleChange}
                className="w-full forms max-w-[80px] sm:max-w-full py-2 !px-0 border rounded-md flex-col"
              />
            </div>
            <div className="p-4">
              <Checkbox
                name="billingCheckbox"
                checked={useShippingAsBilling}
                onChange={handleCheckboxChange}
                label="Billing address the same as shipping address"
              />
            </div>
            {useShippingAsBilling ? (
              <Select
                id="userShippingAddressSelect" // Unique ID for this select input
                name="shippingAddress" // Name property for form identification
                label="Select Shipping Address"
                value={selectedShippingAddressId || ''}
                onChange={handleShippingAddressSelect}
                options={[
                  { label: 'Select an address', value: '' }, // Blank option at the start
                  ...addresses.map(address => ({
                    label: `${address.name}, ${address.address}, ${address.city}, ${address.country}, ${address.postcode}`,
                    value: address._id,
                  })),
                ]}
                className="w-full flex-col max-w-[386px] px-3 py-2 border rounded-md"
              />
            ) : (
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
                <Input
                  label="Country"
                  type="text"
                  name="country"
                  value={newPayment.billingAddress.country}
                  onChange={handleChange}
                  className="w-full max-w-[386px] sm:max-w-full px-3 flex-col py-2 border rounded-md"
                />
              </>
            )}
          </div>
        </div>
      )}

      {paymentMethods.map((method, index) => (
        <div key={method._id || index} className="mb-8">
          <div className="btn-states-box flex justify-end items-center">
            <button
              onClick={() => handleEditClick(index)}
              className="flex items-center gap-1 text-primary-color-100"
            >
              Edit <EditIcon />
            </button>
          </div>
          <div className="payment-details">
            <p className="body-bold-small">{method.nameAccountHolder}</p>
            <p className="body-bold-small">
              **** **** **** {method.accountNumber.slice(-4)}
            </p>
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
              onClick={() => handleDeleteConfirmation(method._id)}
              className="flex items-center body-small mt-4 gap-1 text-primary-color-100"
            >
              Delete card details
            </button>
          </div>
        </div>
      ))}

      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 shadow-lg max-w-sm w-full mx-4">
            <h3 className="h6 font-primary">Are you sure?</h3>
            <p className="text-body-small mt-2">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4 mt-6">
              <Button variant="secondary" onClick={handleCancel}>
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

export default PaymentInfoForm;
