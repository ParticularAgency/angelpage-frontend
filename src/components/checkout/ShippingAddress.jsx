'use client';



import { Button, Input } from '@/components/elements';

import { EditIcon, SaveIcon } from '@/icons';

import { useState, useEffect } from 'react';

import { useSession } from 'next-auth/react';

import axios from 'axios';

import { isUkCountry } from '@/utils/ukValidation';
import { preferredCountryName } from '@/lib/marketPreference';



const GUEST_ADDRESS_KEY = 'angelpage_guest_addresses';



const readGuestAddresses = () => {

  if (typeof window === 'undefined') return [];

  try {

    const raw = localStorage.getItem(GUEST_ADDRESS_KEY);

    return raw ? JSON.parse(raw) : [];

  } catch {

    return [];

  }

};



const writeGuestAddresses = items => {

  if (typeof window !== 'undefined') {

    localStorage.setItem(GUEST_ADDRESS_KEY, JSON.stringify(items));

  }

};



const ShippingAddress = ({ setSelectedAddress }) => {

  const { data: session, status } = useSession() || {};

  const isGuest = status === 'unauthenticated';

  const [addresses, setAddresses] = useState([]);

  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [newAddress, setNewAddress] = useState({

    type: 'Shipping to',

    name: '',

    address: '',

    city: '',

    country: 'United States',

    postcode: '',

  });

  useEffect(() => {
    const country = preferredCountryName();
    setNewAddress(prev =>
      prev.country === country ? prev : { ...prev, country },
    );
  }, []);

  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [addressToDelete, setAddressToDelete] = useState(null);



  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;



  useEffect(() => {

    if (!isGuest) return;

    const saved = readGuestAddresses();

    setAddresses(saved);

    if (saved.length > 0) {

      setSelectedAddressId(saved[0]._id);

      setSelectedAddress(saved[0]);

    } else {

      setIsAddingNewAddress(true);

    }

  }, [isGuest, setSelectedAddress]);



  const persistGuestAddresses = (next, selectedId = selectedAddressId) => {

    setAddresses(next);

    writeGuestAddresses(next);

    const selected = next.find(address => address._id === selectedId) || next[0];

    if (selected) {

      setSelectedAddressId(selected._id);

      setSelectedAddress(selected);

    } else {

      setSelectedAddressId(null);

      setSelectedAddress(null);

    }

  };



  const handleGuestAddressSave = () => {

    if (!isUkCountry(newAddress.country)) {

      alert('Angelpage ships to the United States, Canada, and the United Kingdom.');

      return;

    }

    if (

      !newAddress.name?.trim() ||

      !newAddress.address?.trim() ||

      !newAddress.city?.trim() ||

      !newAddress.postcode?.trim()

    ) {

      alert('Please complete all address fields.');

      return;

    }



    if (isEditingAddress && newAddress._id) {

      const next = addresses.map(address =>

        address._id === newAddress._id ? { ...newAddress } : address

      );

      persistGuestAddresses(next, newAddress._id);

    } else {

      const saved = {

        ...newAddress,

        _id: `guest-addr-${Date.now()}`,

      };

      const next = [...addresses, saved];

      persistGuestAddresses(next, saved._id);

    }



    setIsAddingNewAddress(false);

    setIsEditingAddress(false);

    setNewAddress({

      type: 'Shipping to',

      name: '',

      address: '',

      city: '',

      country: preferredCountryName(),

      postcode: '',

    });

  };



  // Fetch addresses on component mount

  useEffect(() => {

    const fetchAddresses = async () => {

      if (status === 'authenticated' && session?.token) {

        try {

          const response = await axios.get(`${API_BASE_URL}/users/profile`, {

            headers: { Authorization: `Bearer ${session.token}` },

          });

          const shippingAddresses = response.data.user?.addresses.filter(

            addr => addr.type === 'Shipping to'

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

      country: preferredCountryName(),

      postcode: '',

    });

    setIsAddingNewAddress(true);

    setIsEditingAddress(false);

  };



  // Save address (new or edited)

  const handleSaveAddress = async () => {

    if (!isUkCountry(newAddress.country)) {

      alert('Angelpage ships to the United States, Canada, and the United Kingdom.');

      return;

    }

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

          response.data.addresses.filter(addr => addr.type === 'Shipping to')

        );

      } else if (isEditingAddress) {

        const response = await axios.put(

          `${API_BASE_URL}/users/profile/addresses/${newAddress._id}`,

          newAddress,

          { headers: { Authorization: `Bearer ${session?.token}` } }

        );

        setAddresses(

          response.data.addresses.filter(addr => addr.type === 'Shipping to')

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

  const handleEditAddress = address => {

    setNewAddress(address);

    setIsEditingAddress(true);

    setIsAddingNewAddress(false);

  };



  // Delete address

  const handleDeleteAddress = async () => {

    try {

      if (!addressToDelete) return;



      if (isGuest) {

        const next = addresses.filter(address => address._id !== addressToDelete);

        persistGuestAddresses(

          next,

          selectedAddressId === addressToDelete ? next[0]?._id : selectedAddressId

        );

        setAddressToDelete(null);

        setIsConfirmOpen(false);

        if (next.length === 0) {

          setIsAddingNewAddress(true);

        }

        return;

      }



      const response = await axios.delete(

        `${API_BASE_URL}/users/profile/addresses/${addressToDelete}`,

        { headers: { Authorization: `Bearer ${session?.token}` } }

      );

      setAddresses(

        response.data.addresses.filter(addr => addr.type === 'Shipping to')

      );

      setAddressToDelete(null);

      setIsConfirmOpen(false);

    } catch (error) {

      console.error('Error deleting address:', error);

    }

  };



  // Select address

  const handleAddressSelection = id => {

    const selected = addresses.find(address => address._id === id);

    setSelectedAddressId(id);

    setSelectedAddress(selected);

  };



  const showAddressForm = isAddingNewAddress || isEditingAddress;



  return (

    <div className="address-info-wrapper pt-10">

      <div className="info-area-head mb-4 flex items-center justify-between gap-4">

        <h3 className="h5 font-primary text-mono-100">Shipping Address</h3>

        <Button

          variant="accend-link"

          className="underline! text-primary-color-100!"

          onClick={handleAddNewAddress}

        >

          Add new address

        </Button>

      </div>

      <div className="address-item-area">

        {showAddressForm && (

          <div className="address-wrapper-box-item pb-10">

            <div className="address-wrapper-box-head flex items-center justify-between pt-3 pr-2 pb-[7px] pl-[25px]">

              <div className="select-address-checkbox"></div>

              <div className="btn-states">

                <div className="flex justify-end gap-4">

                  <Button

                    variant="accend-link"

                    className="text-primary-color-100!"

                    onClick={() => {

                      setIsAddingNewAddress(false);

                      setIsEditingAddress(false);

                      setNewAddress({

                        type: 'Shipping to',

                        name: '',

                        address: '',

                        city: '',

                        country: preferredCountryName(),

                        postcode: '',

                      });

                    }}

                  >

                    Cancel

                  </Button>

                  <Button

                    variant="accend-link"

                    className="text-primary-color-100!"

                    onClick={

                      isGuest ? handleGuestAddressSave : handleSaveAddress

                    }

                  >

                    Save {isGuest ? null : <SaveIcon />}

                  </Button>

                </div>

              </div>

            </div>

            <div className="address-cont-wrapper-box-area px-[25px] pt-[17px] pb-[21px]">

              <Input

                className="flex flex-col py-2"

                label="Name"

                value={newAddress.name}

                onChange={e =>

                  setNewAddress({ ...newAddress, name: e.target.value })

                }

              />

              <Input

                className="flex flex-col py-2"

                label="Address"

                value={newAddress.address}

                onChange={e =>

                  setNewAddress({ ...newAddress, address: e.target.value })

                }

              />

              <Input

                className="flex flex-col py-2"

                label="City"

                value={newAddress.city}

                onChange={e =>

                  setNewAddress({ ...newAddress, city: e.target.value })

                }

              />

              <label className="flex flex-col py-2 text-body-small">
                Country
                <select
                  className="mt-1 border border-mono-100 bg-white px-3 py-2"
                  value={newAddress.country}
                  onChange={e =>
                    setNewAddress({ ...newAddress, country: e.target.value })
                  }
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </label>

              <Input

                className="flex flex-col py-2"

                label="Postcode"

                value={newAddress.postcode}

                onChange={e =>

                  setNewAddress({ ...newAddress, postcode: e.target.value })

                }

              />

            </div>

          </div>

        )}



        {!showAddressForm &&

          addresses.map(address => (

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

                    className="underline! text-primary-color-100! flex items-center gap-2"

                    onClick={() => handleEditAddress(address)}

                  >

                    Edit <EditIcon />

                  </Button>

                  <Button

                    variant="accend-link"

                    className="underline! text-primary-color-100! flex items-center gap-2"

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

                <p className="text-mono-80! forms-bold mb-1">Shipping to</p>

                <p className="body-bold-small">{address.name}</p>

                <p className="body-small block">{address.address}</p>

                <p className="body-small block">{address.city}</p>

                <p className="body-small block">{address.country}</p>

                <p className="body-small block">{address.postcode}</p>

              </div>

            </div>

          ))}

      </div>



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

