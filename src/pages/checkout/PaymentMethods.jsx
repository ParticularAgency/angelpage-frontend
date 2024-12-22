import React, { useState, useEffect} from 'react';
import { EditIcon, SaveIcon } from '@/icons';
import { Button, Checkbox, Input, Select } from '@/components/elements';
import { useSession } from 'next-auth/react';
import axios from 'axios';


// interface UserResponse {
//   user: {
//     payments: PaymentMethod[];
//     addresses: Address[];
//   };
// }

// interface PaymentMethod {
//   id: string;
//   type: string;
//   details: string; 
// }

// interface Address {
//   id: string;
//   street: string;
//   city: string;
//   zipCode: string; 
// }


// interface Address {
//   _id?: string;
//   name: string;
//   address: string;
//   city: string;
//   country: string;
//   postCode: string;
// }

// interface PaymentMethod {
//   _id?: string;
//   nameAccountHolder: string;
//   accountNumber: string;
//   expiryDate: string;
//   cvvNumber: string;
//   billingAddress: Address;
// }

const PaymentInfoForm = () => {
  const { data: session, status } = useSession() || {};
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(false);
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [selectedPaymentIndex, setSelectedPaymentIndex] = useState(0);

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

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'authenticated' && session?.token) {
        try {
          const response = await axios.get(`${API_BASE_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${session.token}` },
          });
          setPaymentMethods(response.data.user?.payments || []);
          setAddresses(response.data.user?.addresses || []);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [session, status]);

  const handlePaymentSelection = (index) => {
    setSelectedPaymentIndex(index);
  };

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

  const handleEditClick = (index) => {
    setNewPayment(paymentMethods[index]);
    setEditingIndex(index);
    setIsAdding(true);
    setUseShippingAsBilling(false);
    setSelectedShippingAddressId(null);
  };

  const handleSave = async () => {
    if (!newPayment.billingAddress.postCode) {
      alert('Please provide a postal code for the billing address.');
      return;
    }
    try {
      let billingAddress = { ...newPayment.billingAddress };

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
            postCode: selectedShippingAddress.postCode,
          };
        } else {
          console.error('Selected shipping address not found');
          return;
        }
      }

      const payment = { ...newPayment, billingAddress };

      if (editingIndex !== null) {
        const paymentId = paymentMethods[editingIndex]._id;
        if (paymentId) {
          const response = await axios.put(
            `${API_BASE_URL}/users/profile/payments/${paymentId}`,
            payment,
            { headers: { Authorization: `Bearer ${session?.token}` } }
          );
          setPaymentMethods(response.data.payments);
        }
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/users/profile/payments`,
          payment,
          { headers: { Authorization: `Bearer ${session?.token}` } }
        );
        setPaymentMethods(response.data.payments);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving payment method:', error);
    }
  };

  const handleDelete = async () => {
    if (paymentToDelete) {
      try {
        await axios.delete(
          `${API_BASE_URL}/users/profile/payments/${paymentToDelete}`,
          {
            headers: { Authorization: `Bearer ${session?.token}` },
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

  const resetForm = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setUseShippingAsBilling(false);
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
  };

  const handleDeleteConfirmation = (id) => {
    setPaymentToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleCheckboxChange = () => {
    setUseShippingAsBilling(!useShippingAsBilling);
    if (!useShippingAsBilling) {
      setSelectedShippingAddressId(null);
    }
  };

  const handleShippingAddressSelect = (e) => {
    setSelectedShippingAddressId(e.target.value);
  };

  const handleChange = (e) => {
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
      <div className="title-line-area-section flex pb-[13px] justify-between items-center gap-3 w-full !border-0">
        <p className="body-bold-regular">Payment Methods</p>
        <Button
          variant="accend-link"
          className="underline !text-primary-color-100"
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
                id="userShippingAddressSelect"
                name="shippingAddress" 
                label="Select Shipping Address"
                value={selectedShippingAddressId || ''}
                onChange={handleShippingAddressSelect}
                options={[
                  { label: 'Select an address', value: '' }, 
                  ...addresses.map(address => ({
                    label: `${address.name}, ${address.address}, ${address.city}, ${address.country}, ${address.postCode}`,
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
                className="!underline !text-primary-color-100 flex items-center gap-2"
                onClick={() => handleEditClick(index)}
              >
                Edit <EditIcon />
              </Button>
            </div>
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

export default PaymentInfoForm;
