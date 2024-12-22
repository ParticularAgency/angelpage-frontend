'use client';

import { Button, Input } from '@/components/elements';
import { EditIcon, SaveIcon } from '@/icons';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

// interface Address {
//   _id?: string;
//   type: string;
//   name: string;
//   address: string;
//   city: string;
//   country: string;
//   postcode: string;
//   isEditing?: boolean;
// }

const ShippingAddress = () => {
  const { data: session, status } = useSession() || {};
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(
    null
  );
  const [newAddress, setNewAddress] = useState({
    type: 'Shipping to',
    name: '',
    address: '',
    city: '',
    country: '',
    postcode: '',
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      if (status === 'authenticated' && session?.token) {
        try {
          const response = await axios.get(`${API_BASE_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${session.token}` },
          });
          const shippingAddresses = response.data.user?.addresses.filter(
            (addr) => addr.type === 'Shipping to'
          );
          setAddresses(shippingAddresses || []);
        } catch (error) {
          console.error('Error fetching addresses:', error);
        }
      }
    };

    fetchAddresses();
  }, [session, status]);

  // Add new address
  const handleAddNewAddress = () => {
    setNewAddress({
      type: 'Shipping to',
      name: '',
      address: '',
      city: '',
      country: '',
      postcode: '',
    });
    setIsAddingNewAddress(true);
    setIsEditingAddress(false);
  };

  // Save address (new or edited)
  const handleSaveAddress = async () => {
    try {
      if (isAddingNewAddress) {
        const response = await axios.post(
          `${API_BASE_URL}/users/profile/addresses`,
          newAddress,
          {
            headers: { Authorization: `Bearer ${session?.token}` },
          }
        );
        setAddresses(
          response.data.addresses.filter(
            (addr) => addr.type === 'Shipping to'
          )
        );
      } else if (isEditingAddress) {
        const response = await axios.put(
          `${API_BASE_URL}/users/profile/addresses/${newAddress._id}`,
          newAddress,
          { headers: { Authorization: `Bearer ${session?.token}` } }
        );
        setAddresses(
          response.data.addresses.filter(
            (addr) => addr.type === 'Shipping to'
          )
        );
      }

      setIsAddingNewAddress(false);
      setIsEditingAddress(false);
      setNewAddress({
        type: 'Shipping to',
        name: '',
        address: '',
        city: '',
        country: '',
        postcode: '',
      });
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  // Edit address
  const handleEditAddress = (address) => {
    setNewAddress(address);
    setIsEditingAddress(true);
    setIsAddingNewAddress(false);
  };

  // Delete address
  const handleDeleteAddress = async () => {
    try {
      if (addressToDelete) {
        const response = await axios.delete(
          `${API_BASE_URL}/users/profile/addresses/${addressToDelete}`,
          { headers: { Authorization: `Bearer ${session?.token}` } }
        );
        setAddresses(
          response.data.addresses.filter(
            (addr) => addr.type === 'Shipping to'
          )
        );
        setAddressToDelete(null);
        setIsConfirmOpen(false);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  // Select address
  const handleAddressSelection = (id) => {
    setSelectedAddressId(id);
  };

  return (
    <div className="address-info-wrapper pt-10">
      <div className="info-area-head mb-4 flex items-center justify-between gap-4">
        <h3 className="h5 font-primary text-mono-100">Shipping Address</h3>
        <Button
          variant="accend-link"
          className="!underline !text-primary-color-100"
          onClick={handleAddNewAddress}
        >
          Add new address
        </Button>
      </div>
      <div className="address-item-area">
        {addresses.map(address => (
          <div className="address-wrapper-box-item pb-10" key={address._id}>
            <div className="address-wrapper-box-head flex items-center justify-between pt-3 pr-2 pb-[7px] pl-[25px]">
              <div className="select-address-checkbox">
                <input
                  type="radio"
                  name="shippingAddress"
                  checked={selectedAddressId === address._id}
                  onChange={() => handleAddressSelection(address._id)}
                  className="radio w-4 h-4 focus:rounded-full selecting-checkbox-item "
                />
              </div>
              <div className="btn-states">
                <Button
                  variant="accend-link"
                  className="!underline !text-primary-color-100 flex items-center gap-2"
                  onClick={() => handleEditAddress(address)}
                >
                  Edit <EditIcon />
                </Button>
                <Button
                  variant="accend-link"
                  className="!underline !text-primary-color-100 flex items-center gap-2"
                  onClick={() => {
                    setAddressToDelete(address._id || null);
                    setIsConfirmOpen(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
            <div className="address-cont-wrapper-box-area px-[25px] pt-[17px] pb-[21px]">
              <p className="!text-mono-80 forms-bold mb-1">Shipping to</p>
              <p className="body-bold-small">{address.name}</p>
              <p className="body-small block">{address.address}</p>
              <p className="body-small block">{address.city}</p>
              <p className="body-small block">{address.country}</p>
              <p className="body-small block">{address.postcode}</p>
            </div>
          </div>
        ))}
      </div>

      {(isAddingNewAddress || isEditingAddress) && (
        <div className="address-edit-form">
          <Input
            className="flex flex-col"
            label="Name"
            value={newAddress.name}
            onChange={e =>
              setNewAddress({ ...newAddress, name: e.target.value })
            }
          />
          <Input
            className="flex flex-col"
            label="Address"
            value={newAddress.address}
            onChange={e =>
              setNewAddress({ ...newAddress, address: e.target.value })
            }
          />
          <Input
            className="flex flex-col"
            label="City"
            value={newAddress.city}
            onChange={e =>
              setNewAddress({ ...newAddress, city: e.target.value })
            }
          />
          <Input
            className="flex flex-col"
            label="Country"
            value={newAddress.country}
            onChange={e =>
              setNewAddress({ ...newAddress, country: e.target.value })
            }
          />
          <Input
            className="flex flex-col"
            label="Postcode"
            value={newAddress.postcode}
            onChange={e =>
              setNewAddress({ ...newAddress, postcode: e.target.value })
            }
          />
          <div className="flex justify-end gap-4">
            <Button
              variant="accend-link"
              onClick={() => setIsAddingNewAddress(false)}
            >
              Cancel
            </Button>
            <Button variant="accend-link" onClick={handleSaveAddress}>
              Save <SaveIcon />
            </Button>
          </div>
        </div>
      )}

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
              <Button variant="primary" onClick={handleDeleteAddress}>
                Yes, delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingAddress;
