import React, { useState } from 'react';
import { EditIcon, SaveIcon, DeleteIcon } from '@/icons'; // Assuming your icons are correctly imported
import { Button, Checkbox, Input } from '@/components/elements';

const PaymentInfoForm = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Dummy shipping address to be used for the checkbox feature
  const shippingAddress = {
    name: 'Wilson Ndasi',
    addressLine1: '836 Zamlak Crescent',
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
    setEditingIndex(null); // Reset editing index when adding new
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
        : newPayment.billingAddress, // Use shipping address if checked
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
    setIsConfirmOpen(false); // Close confirmation modal
  };

  const handleDeleteConfirmation = (index: number) => {
    setEditingIndex(index); // Set the current index for deletion
    setIsConfirmOpen(true); // Open confirmation modal
  };

  const handleCancel = () => {
    setIsConfirmOpen(false); // Close confirmation modal
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
    <div className="payment-section pt-6 pb-0">
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
            <Input
              label="Billing Name"
              type="text"
              name="name"
              value={newPayment.billingAddress.name}
              onChange={handleChange}
              disabled={useShippingAsBilling} // Disable when checkbox is checked
              className="w-full flex-col max-w-[386px] px-3 py-2 border rounded-md"
            />
            <Input
              label="Address"
              type="text"
              name="addressLine1"
              value={newPayment.billingAddress.addressLine1}
              onChange={handleChange}
              disabled={useShippingAsBilling} // Disable when checkbox is checked
              className="w-full flex-col max-w-[386px] px-3 py-2 border rounded-md"
            />

            <div className="flex flex-col">
              <div className="w-full">
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

            {/* Delete Button for editing mode */}
            {editingIndex !== null && (
              <div className="pb-4">
                <Button
                  variant="accend-link"
                  onClick={() => handleDeleteConfirmation(editingIndex)}
                  className="flex items-center body-small !underline !text-primary-color-100"
                >
                  Delete card details <DeleteIcon />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        {paymentMethods.map((method, index) => (
          <div key={index} className="mb-8">
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
              {/* <p className="body-bold-small">{method.accountNumber}</p>
              <p className="body-bold-small">{method.expiryDate}</p>
              <p className="body-bold-small">{method.cvvNumber}</p> */}
              <p className="text-gray-500">Billing address</p>
              <p className="body-small">{method.billingAddress.name}</p>
              <p className="body-small">{method.billingAddress.addressLine1}</p>
              <p className="body-small">{method.billingAddress.city}</p>
              <p className="body-small">{method.billingAddress.postalCode}</p>
            </div>

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
        ))}
      </div>
    </div>
  );
};

export default PaymentInfoForm;
