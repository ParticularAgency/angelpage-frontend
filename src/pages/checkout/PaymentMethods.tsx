import React, { useState } from 'react';
import { EditIcon, SaveIcon } from '@/icons';
import { Button, Input } from '@/components/elements';

// Default shipping address data
const initialShippingAddress = {
  name: 'Wilson Ndasi',
  addressLine1: '836 Zamlak Crescent',
  city: 'Thompsonland',
  postalCode: 'W2 6FT',
};

const PaymentMethodsArea = () => {
const [paymentMethods, setPaymentMethods] = useState([
  {
    nameAccountHolder: 'Visa - 5016',
    accountNumber: '', 
    expiryDate: '', 
    cvvNumber: '', 
    billingAddress: initialShippingAddress,
  },
]);

const [selectedPaymentIndex, setSelectedPaymentIndex] = useState<number | null>(
  0
);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(false);
  const [newPayment, setNewPayment] = useState({
  nameAccountHolder: '',
  accountNumber: '',
  expiryDate: '',
  cvvNumber: '',
  billingAddress: {
    name: '',
    addressLine1: '',
    city: '',
    postalCode: '',
  },
});


  // Handle selection of a payment method
  const handlePaymentSelection = (index: number) => {
    setSelectedPaymentIndex(index);
  };

  // Handle adding new payment method
  const handleAddNewClick = () => {
    setIsAdding(true);
    setIsEditing(false);
    setNewPayment({
      nameAccountHolder: '',
      accountNumber: '',
      expiryDate: '',
      cvvNumber: '',
      billingAddress: {
        name: '',
        addressLine1: '',
        city: '',
        postalCode: '',
      },
    });
  };

const handleEditClick = (index: number) => {
  setEditingIndex(index);

  // Populate newPayment with existing data or default values
  setNewPayment({
    ...paymentMethods[index],
    accountNumber: '', 
    expiryDate: '', 
    cvvNumber: '', 
  });

  setIsEditing(true);
  setIsAdding(false);
};


  // Save new or edited payment method
  const handleSavePayment = () => {
    const updatedPayments = [...paymentMethods];
    if (isEditing && editingIndex !== null) {
      updatedPayments[editingIndex] = newPayment;
    } else {
      updatedPayments.push(newPayment);
    }
    setPaymentMethods(updatedPayments);
    setIsAdding(false);
    setIsEditing(false);
    setNewPayment({
      nameAccountHolder: '',
      accountNumber: '',
      expiryDate: '',
      cvvNumber: '',
      billingAddress: {
        name: '',
        addressLine1: '',
        city: '',
        postalCode: '',
      },
    });
  };

  // Cancel add/edit actions
  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setNewPayment({
      nameAccountHolder: '',
      accountNumber: '',
      expiryDate: '',
      cvvNumber: '',
      billingAddress: {
        name: '',
        addressLine1: '',
        city: '',
        postalCode: '',
      },
    });
  };

  // Delete payment method
  const handleDeletePayment = (index: number) => {
    const updatedPayments = paymentMethods.filter((_, i) => i !== index);
    setPaymentMethods(updatedPayments);
    if (selectedPaymentIndex === index) {
      setSelectedPaymentIndex(updatedPayments.length > 0 ? 0 : null);
    }
  };

  // Handle checkbox change for using shipping address as billing address
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setUseShippingAsBilling(checked);
    setNewPayment(prevPayment => ({
      ...prevPayment,
      billingAddress: checked
        ? initialShippingAddress
        : { name: '', addressLine1: '', city: '', postalCode: '' },
    }));
  };

  return (
    <div className="payment-section pt-6 pb-8">
      <div className="title-line-area-section flex pb-3 justify-between items-center w-full">
        <p className="body-bold-regular">Payment method</p>
        <Button
          variant="accend-link"
          className="underline !text-primary-color-100"
          onClick={handleAddNewClick}
        >
          Add new payment method
        </Button>
      </div>

      {/* Add/Edit Payment Method Form */}
      {isAdding || isEditing ? (
        <div className="my-6 adding-payment-methods-area">
          <div className="payment-wrapper-box-head flex justify-end pt-3 pr-2 pb-[9px] pl-[25px]">
            <Button
              variant="accend-link"
              className="!text-primary-color-100 !py-[2px]"
              onClick={handleSavePayment}
            >
              Save <SaveIcon />
            </Button>
            <Button
              variant="accend-link"
              className="!text-secondary-color-100 !py-[2px]"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
          <div className="payment-methods-items-wrap">
            <Input
              label="Name on card"
              type="text"
              name="nameAccountHolder"
              value={newPayment.nameAccountHolder}
              onChange={e =>
                setNewPayment({
                  ...newPayment,
                  nameAccountHolder: e.target.value,
                })
              }
              className="w-full max-w-[386px] px-3 forms py-2 border rounded-md flex-col"
            />
            <Input
              label="Card number"
              type="text"
              name="accountNumber"
              value={newPayment.accountNumber}
              onChange={e =>
                setNewPayment({ ...newPayment, accountNumber: e.target.value })
              }
              className="w-full max-w-[386px] px-3 forms py-2 border rounded-md flex-col"
            />
            <div className="flex items-center gap-6 px-3">
              <Input
                label="Expiry date"
                type="text"
                name="expiryDate"
                value={newPayment.expiryDate}
                onChange={e =>
                  setNewPayment({ ...newPayment, expiryDate: e.target.value })
                }
                className="w-full max-w-[120px] forms py-2 !px-0 border rounded-md flex-col"
              />
              <Input
                label="CVV"
                type="text"
                name="cvvNumber"
                value={newPayment.cvvNumber}
                onChange={e =>
                  setNewPayment({ ...newPayment, cvvNumber: e.target.value })
                }
                className="w-full max-w-[80px] forms py-2 !px-0 border rounded-md flex-col"
              />
            </div>
            <div className="p-4">
              <label className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  checked={useShippingAsBilling}
                  onChange={handleCheckboxChange}
                />
                <span>Billing address the same as shipping address</span>
              </label>
            </div>
            <div className="billing-address">
              <Input
                label="Billing Name"
                type="text"
                name="billingName"
                value={newPayment.billingAddress.name}
                onChange={e =>
                  setNewPayment({
                    ...newPayment,
                    billingAddress: {
                      ...newPayment.billingAddress,
                      name: e.target.value,
                    },
                  })
                }
                className="w-full max-w-[386px] px-3 forms py-2 border rounded-md flex-col"
              />
              <Input
                label="Billing Address Line 1"
                type="text"
                name="billingAddressLine1"
                value={newPayment.billingAddress.addressLine1}
                onChange={e =>
                  setNewPayment({
                    ...newPayment,
                    billingAddress: {
                      ...newPayment.billingAddress,
                      addressLine1: e.target.value,
                    },
                  })
                }
                className="w-full max-w-[386px] px-3 forms py-2 border rounded-md flex-col"
              />
              <Input
                label="Billing City"
                type="text"
                name="billingCity"
                value={newPayment.billingAddress.city}
                onChange={e =>
                  setNewPayment({
                    ...newPayment,
                    billingAddress: {
                      ...newPayment.billingAddress,
                      city: e.target.value,
                    },
                  })
                }
                className="w-full max-w-[386px] px-3 forms py-2 border rounded-md flex-col"
              />
              <Input
                label="Billing Postal Code"
                type="text"
                name="billingPostalCode"
                value={newPayment.billingAddress.postalCode}
                onChange={e =>
                  setNewPayment({
                    ...newPayment,
                    billingAddress: {
                      ...newPayment.billingAddress,
                      postalCode: e.target.value,
                    },
                  })
                }
                className="w-full max-w-[386px] px-3 forms py-2 border rounded-md flex-col"
              />
            </div>
            {isEditing && editingIndex !== null && (
              <Button
                variant="accend-link"
                className="text-primary-color-100 !underline flex items-center gap-2"
                onClick={() => handleDeletePayment(editingIndex)}
              >
                Delete payment details
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div>
          {paymentMethods.length === 0 ? (
            <p>No payment methods available</p>
          ) : (
            paymentMethods.map((method, index) => (
              <div key={index} className="payment-method-item pb-10">
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
                      className="text-primary-color-100 flex items-center gap-2"
                      onClick={() => handleEditClick(index)}
                    >
                      Edit <EditIcon />
                    </Button>
                  </div>
                </div>
                <div className="payment-details px-3">
                  <p className="body-bold-small">{method.nameAccountHolder}</p>
                  <p className="!text-mono-80 forms-bold mb-2">
                    Billing address
                  </p>
                  <p className="body-small">{method.billingAddress.name}</p>
                  <p className="body-small">
                    {method.billingAddress.addressLine1}
                  </p>
                  <p className="body-small">{method.billingAddress.city}</p>
                  <p className="body-small">
                    {method.billingAddress.postalCode}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsArea;
