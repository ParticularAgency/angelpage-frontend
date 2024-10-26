import React, { useState } from 'react';
import { Button, Input } from '@/components/elements';
import { EditIcon, SaveIcon } from '@/icons';

const AddressForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState({
    name: '1 Wine House',
    address: 'London Crescent',
    city: 'London',
    country: 'United Kingdom',
    postcode: 'N10 2QH',
  });

  const handleEditClick = () => setIsEditing(!isEditing);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  return (
    <div className="address-section pt-[23px] pb-8">
      <div className="title-line-area-section flex pb-[13px] justify-between items-center gap-3 w-full !border-0">
        <p className="body-bold-regular">Addresses</p>
        <Button
          variant="accend-link"
          className="underline !text-primary-color-100"
        >
          Add new address
        </Button>
      </div>
      <div className="flex justify-end items-center btn-states-box">
        <button
          onClick={handleEditClick}
          className="states-btn body-small flex items-center gap-2 text-primary-color-100"
        >
          {isEditing ? (
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
      <div
        className={`address-details ${!isEditing ? '' : 'flex flex-col gap-2'}`}
      >
        {!isEditing ? (
          <>
            <p className="body-small">{address.name}</p>
            <p className="body-small">{address.address}</p>
            <p className="body-small">{address.city}</p>
            <p className="body-small">{address.country}</p>
            <p className="body-small">{address.postcode}</p>
          </>
        ) : (
          <>
            <Input
              label="Name"
              type="text"
              name="name"
              value={address.name}
              onChange={handleChange}
              className="flex-col w-full max-w-[386px] sm:max-w-full"
            />
            <Input
              label="Address"
              type="text"
              name="address"
              value={address.address}
              onChange={handleChange}
              className="flex-col w-full max-w-[386px] sm:max-w-full"
            />
            <Input
              label="City"
              type="text"
              name="city"
              value={address.city}
              onChange={handleChange}
              className="flex-col w-full max-w-[386px] sm:max-w-full"
            />
            <Input
              label="Country"
              type="text"
              name="country"
              value={address.country}
              onChange={handleChange}
              className="flex-col w-full max-w-[386px] sm:max-w-full"
            />
            <Input
              label="Postcode"
              type="text"
              name="postcode"
              value={address.postcode}
              onChange={handleChange}
              className="flex-col w-full max-w-[386px] sm:max-w-full"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AddressForm;
