import React, { useState } from 'react';
import { EditIcon, SaveIcon } from '@/icons'; // Assuming your icons are correctly imported
import { Button, Input } from '@/components/elements';

const PaymentInfoForm = () => {
  const [isAdding, setIsAdding] = useState(false); // for adding new payment
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // for editing existing methods
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(false); // Checkbox state

  // Dummy shipping address to be used for the checkbox feature
  const shippingAddress = {
    name: 'Wilson Ndasi',
    addressLine1: '836 Zemlak Crescent',
    city: 'Thompsonland',
    postalCode: 'W2 6FT',
  };

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

  const [paymentMethods, setPaymentMethods] = useState([
    {
      nameAccountHolder: 'Visa - 5016',
      accountNumber: '',
      expiryDate: '',
      cvvNumber: '',
      billingAddress: shippingAddress,
    },
  ]);

  const handleAddNewClick = () => {
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
    setIsAdding(true);
    setEditingIndex(null); // When adding a new payment, we aren't editing
  };

  const handleEditClick = (index: number) => {
    setNewPayment(paymentMethods[index]);
    setEditingIndex(index);
    setIsAdding(true); // Reuse the same form for editing
  };

  const handleSave = () => {
    const finalPayment = {
      ...newPayment,
      billingAddress: useShippingAsBilling
        ? shippingAddress
        : newPayment.billingAddress, // Apply shipping address if checkbox is checked
    };

    if (editingIndex !== null) {
      const updatedMethods = [...paymentMethods];
      updatedMethods[editingIndex] = finalPayment;
      setPaymentMethods(updatedMethods);
    } else {
      setPaymentMethods([...paymentMethods, finalPayment]); // Add new method
    }
    setIsAdding(false); // Hide the form after saving
  };

  const handleDelete = () => {
    if (editingIndex !== null) {
      const updatedMethods = paymentMethods.filter(
        (_, index) => index !== editingIndex
      );
      setPaymentMethods(updatedMethods);
      setIsAdding(false); // Hide form after deletion
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseShippingAsBilling(e.target.checked);
    if (e.target.checked) {
      setNewPayment({
        ...newPayment,
        billingAddress: shippingAddress, // Set billing address to shipping when checked
      });
    }
  };

  return (
    <div className="payment-section pt-6 pb-8">
      <div className="title-line-area-section flex pb-[13px] justify-between items-center gap-3 w-full !border-0">
        <p className="body-bold-regular">Payment method</p>
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
            <div className="">
              <Input
                label="Name on account"
                type="text"
                name="nameAccountHolder" // Updated to match state key
                value={newPayment.nameAccountHolder}
                onChange={handleChange}
                className="w-full max-w-[386px] sm:max-w-full px-3 py-2 border rounded-md flex-col"
              />
              <Input
                label="Account number"
                type="text"
                name="accountNumber"
                value={newPayment.accountNumber}
                onChange={handleChange}
                className="w-full max-w-[386px] sm:max-w-full px-3 py-2 border rounded-md flex-col"
              />
              <div className="date-and-csv flex items-center gap-6 sm:fex-col px-3">
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
            </div>
            <div className="space-y-2">
              <Input
                label="Billing Name"
                type="text"
                name="name"
                value={newPayment.billingAddress.name}
                onChange={handleChange}
                disabled={useShippingAsBilling} // Disable when checkbox is checked
                className="w-full max-w-[386px] sm:max-w-full flex-col px-3 py-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Address"
                type="text"
                name="addressLine1"
                value={newPayment.billingAddress.addressLine1}
                onChange={handleChange}
                disabled={useShippingAsBilling} // Disable when checkbox is checked
                className="w-full max-w-[386px] sm:max-w-full flex-col px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <div className="w-full">
                <label className="block text-sm"></label>
                <Input
                  label="City"
                  type="text"
                  name="city"
                  value={newPayment.billingAddress.city}
                  onChange={handleChange}
                  disabled={useShippingAsBilling} // Disable when checkbox is checked
                  className="w-full max-w-[386px] sm:max-w-full px-3 flex-col py-2 border rounded-md"
                />
              </div>
              <div className="w-full">
                <Input
                  label="Postal Code"
                  type="text"
                  name="postalCode"
                  value={newPayment.billingAddress.postalCode}
                  onChange={handleChange}
                  disabled={useShippingAsBilling} // Disable when checkbox is checked
                  className="w-full max-w-[386px] sm:max-w-full px-3 py-2 flex-col border rounded-md"
                />
              </div>
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

            {/* Delete Button for editing mode */}
            {editingIndex !== null && (
              <div className="pb-4">
                <Button
                  variant="accend-link"
                  onClick={handleDelete}
                  className="flex items-center body-small !underline !text-primary-color-100"
                >
                  Delete card details
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="">
        {paymentMethods.map((method, index) => (
          <div key={index} className="">
            <div className="btn-states-box flex justify-end items-center">
              <button
                onClick={() => handleEditClick(index)}
                className="flex items-center gap-1 text-primary-color-100"
              >
                Edit <EditIcon />
              </button>
            </div>

            <div className="payment-details">
              <div>
                <p className="body-bold-small">{method.nameAccountHolder}</p>
                <p className="body-bold-small">{method.accountNumber}</p>
                <p className="body-bold-small">{method.expiryDate}</p>
                <p className="body-bold-small">{method.cvvNumber}</p>
                <p className="text-gray-500">Billing address</p>
              </div>
              <p className="body-small">{method.billingAddress.name}</p>
              <p className="body-small">{method.billingAddress.addressLine1}</p>
              <p className="body-small">{method.billingAddress.city}</p>
              <p className="body-small">{method.billingAddress.postalCode}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentInfoForm;
