import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/elements';
import { EditIcon, SaveIcon } from '@/icons';

const AddressForm: React.FC = () => {
  // Managing multiple addresses
  const [addresses, setAddresses] = useState([
    {
      id: 1, // Unique ID for each address
      type: 'Shipping from',
      name: 'Wilson Ndasi',
      address: '836 Zamlak Crescent',
      city: 'Thorperland',
      country: 'United Kingdom',
      postcode: 'W2 6FT',
      isEditing: false, // Manage editing state per address
    },
  ]);

  // Function to handle adding a new address
  const handleAddNewAddress = () => {
    const newAddress = {
      id: addresses.length + 1, // Ensure unique ID, consider using a library for unique IDs
      type: 'Shipping from',
      name: '',
      address: '',
      city: '',
      country: '',
      postcode: '',
      isEditing: true,
    };
    setAddresses([...addresses, newAddress]); // Add new blank address
  };

  // Function to handle edit/save toggle
  const handleEditClick = (id: number) => {
    setAddresses(
      addresses.map(address =>
        address.id === id
          ? { ...address, isEditing: !address.isEditing }
          : address
      )
    );
  };

  // Function to handle input changes
  const handleChange = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setAddresses(
      addresses.map(address =>
        address.id === id
          ? { ...address, [e.target.name]: e.target.value }
          : address
      )
    );
  };

  // Function to handle deleting an address
  const handleDelete = (id: number) => {
    setAddresses(addresses.filter(address => address.id !== id));
  };

  return (
    <div className="address-section pt-[23px] pb-8">
      {/* Title and Add New Address */}
      <div className="title-line-area-section flex pb-[13px] justify-between items-center gap-3 w-full !border-0">
        <p className="body-bold-regular">Addresses</p>
        <Button
          variant="accend-link"
          className="underline !text-primary-color-100"
          onClick={handleAddNewAddress}
        >
          Add new address
        </Button>
      </div>

      {/* Address Forms */}
      {addresses.map(address => (
        <div key={address.id} className="address-item mb-6 border rounded-lg">
          {/* Edit/Save Button */}
          <div className="flex justify-between items-center btn-states-box">
            {!address.isEditing ? (
              <p className="body-small">{address.type}</p>
            ) : (
              <p className="body-small"></p>
            )}
            <button
              onClick={() => handleEditClick(address.id)}
              className="states-btn body-small flex items-center gap-2 text-primary-color-100"
            >
              {address.isEditing ? (
                <>
                  Save <SaveIcon />
                </>
              ) : (
                <>
                  Edit <EditIcon />
                </>
              )}
            </button>
          </div>

          {/* Address Details or Form */}
          <div
            className={`address-details ${!address.isEditing ? '' : 'flex flex-col gap-2'}`}
          >
            {!address.isEditing ? (
              <>
                <p className="body-small">{address.name}</p>
                <p className="body-small">{address.address}</p>
                <p className="body-small">{address.city}</p>
                <p className="body-small">{address.country}</p>
                <p className="body-small">{address.postcode}</p>
              </>
            ) : (
              <>
                <Select
                  id={`address-type-${address.id}`} // Added id prop for Select
                  label="Address type"
                  name="type"
                  value={address.type}
                  onChange={e => handleChange(address.id, e)}
                  options={[
                    { label: 'Shipping from', value: 'Shipping from' },
                    { label: 'Shipping to', value: 'Shipping to' },
                  ]}
                  className="flex-col w-full max-w-[386px]"
                />
                <Input
                  label="Name"
                  type="text"
                  name="name"
                  value={address.name}
                  onChange={e => handleChange(address.id, e)}
                  className="flex-col w-full max-w-[386px]"
                />
                <Input
                  label="Address"
                  type="text"
                  name="address"
                  value={address.address}
                  onChange={e => handleChange(address.id, e)}
                  className="flex-col w-full max-w-[386px]"
                />
                <Input
                  label="City"
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={e => handleChange(address.id, e)}
                  className="flex-col w-full max-w-[386px]"
                />
                <Input
                  label="Country"
                  type="text"
                  name="country"
                  value={address.country}
                  onChange={e => handleChange(address.id, e)}
                  className="flex-col w-full max-w-[386px]"
                />
                <Input
                  label="Postcode"
                  type="text"
                  name="postcode"
                  value={address.postcode}
                  onChange={e => handleChange(address.id, e)}
                  className="flex-col w-full max-w-[386px]"
                />
                <div className="flex justify-start mt-2">
                  <Button
                    variant="accend-link"
                    className="flex items-center gap-2 !text-primary-color-100 !underline"
                    onClick={() => handleDelete(address.id)}
                  >
                    Delete address
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressForm;
