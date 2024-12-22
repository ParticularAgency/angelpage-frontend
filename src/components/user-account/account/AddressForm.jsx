import React, { useState, useEffect } from 'react';
import { Button, Input, Select } from '@/components/elements';
import { EditIcon, SaveIcon } from '@/icons';
import { useSession } from 'next-auth/react';
import axios from 'axios';


const AddressForm  = () => {
  const { data: session, status } = useSession() || {};
  const [addresses, setAddresses] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  // Fetch existing addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      if (status === 'authenticated' && session?.token) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
            {
              headers: {
                Authorization: `Bearer ${session.token}`,
              },
            }
          );
          setAddresses(response.data.user?.addresses || []);
        } catch (error) {
          console.error('Error fetching addresses:', error);
        }
      }
    };
    fetchAddresses();
  }, [session, status]);

  const handleAddNewAddress = () => {
    const newAddress = {
      tempId: Date.now(),
      type: 'Shipping from',
      name: '',
      address: '',
      city: '',
      country: '',
      postcode: '',
      isEditing: true,
    };
    setAddresses([...addresses, newAddress]);
  };

  const handleEditClick = (id) => {
    setAddresses(
      addresses.map(address =>
        address._id === id || address.tempId === id
          ? { ...address, isEditing: !address.isEditing }
          : address
      )
    );
  };

  const handleChange = (
    id,
    e
  ) => {
    const { name, value } = e.target;
    setAddresses(
      addresses.map(address =>
        address._id === id || address.tempId === id
          ? { ...address, [name]: value }
          : address
      )
    );
  };

  const handleDeleteConfirmation = (id) => {
    setAddressToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (addressToDelete) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/users/profile/addresses/${addressToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          }
        );
        setAddresses(
          addresses.filter(address => address._id !== addressToDelete)
        );
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
    setIsConfirmOpen(false);
    setAddressToDelete(null);
  };

 const handleSave = async (id) => {
   const address = addresses.find(
     addr => addr._id === id || addr.tempId === id
   );

   if (address) {
     try {
       if (address._id) {
         // Update existing address
         await axios.put(
           `${process.env.NEXT_PUBLIC_API_URL}/users/profile/addresses/${address._id}`,
           address,
           {
             headers: {
               Authorization: `Bearer ${session?.token}`,
             },
           }
         );
         setAddresses(
           addresses.map(addr =>
             addr._id === id ? { ...addr, isEditing: false } : addr
           )
         );
       } else {
         // Add new address
         const response = await axios.post(
           `${process.env.NEXT_PUBLIC_API_URL}/users/profile/addresses`,
           address,
           {
             headers: {
               Authorization: `Bearer ${session?.token}`,
             },
           }
         );

         // Check if addresses are returned in the response
         if (response.data.addresses) {
           // Update state with the full array of addresses returned from the server
           setAddresses(
             response.data.addresses.map(addr => ({
               ...addr,
               isEditing: false,
             }))
           );
         } else {
           console.error('Unexpected response structure:', response.data);
         }
       }
     } catch (error) {
       console.error(
         'Error saving address:',
         error.response?.data ||
           error.message
       );
     }
   }
 };

  return (
    <div className="address-section pt-[23px] pb-0">
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

      {addresses.map(address => (
        <div
          key={address._id || address.tempId}
          className="address-item mb-6 border rounded-lg"
        >
          <div className="flex justify-between items-center btn-states-box">
            <p className="body-small">
              {address.isEditing ? '' : address.type}
            </p>
            <button
              onClick={() => {
                const id = address._id || address.tempId;
                if (id !== undefined) {
                  address.isEditing ? handleSave(id) : handleEditClick(id);
                }
              }}
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
                  id={`address-type-${address._id || address.tempId}`}
                  label="Address type"
                  name="type"
                  value={address.type}
                  onChange={e => {
                    const id = address._id ?? address.tempId;
                    if (id !== undefined) {
                      handleChange(id, e);
                    }
                  }}
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
                  value={address.name || ''}
                  onChange={e => {
                    const id = address._id ?? address.tempId;
                    if (id !== undefined) {
                      handleChange(id, e);
                    }
                  }}
                  className="flex-col w-full max-w-[386px]"
                />
                <Input
                  label="Address"
                  type="text"
                  name="address"
                  value={address.address || ''}
                  onChange={e => {
                    const id = address._id ?? address.tempId;
                    if (id !== undefined) {
                      handleChange(id, e);
                    }
                  }}
                  className="flex-col w-full max-w-[386px]"
                />
                <Input
                  label="City"
                  type="text"
                  name="city"
                  value={address.city || ''}
                  onChange={e => {
                    const id = address._id ?? address.tempId;
                    if (id !== undefined) {
                      handleChange(id, e);
                    }
                  }}
                  className="flex-col w-full max-w-[386px]"
                />
                <Input
                  label="Country"
                  type="text"
                  name="country"
                  value={address.country || ''}
                  onChange={e => {
                    const id = address._id ?? address.tempId;
                    if (id !== undefined) {
                      handleChange(id, e);
                    }
                  }}
                  className="flex-col w-full max-w-[386px]"
                />
                <Input
                  label="Postcode"
                  type="text"
                  name="postcode"
                  value={address.postcode || ''}
                  onChange={e => {
                    const id = address._id ?? address.tempId;
                    if (id !== undefined) {
                      handleChange(id, e);
                    }
                  }}
                  className="flex-col w-full max-w-[386px]"
                />
                <div className="flex justify-start mt-2">
                  <Button
                    variant="accend-link"
                    className="flex items-center gap-2 !text-primary-color-100 !underline"
                    onClick={() => {
                      if (address._id) {
                        handleDeleteConfirmation(address._id);
                      }
                    }}
                  >
                    Delete address
                  </Button>
                </div>
              </>
            )}
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

export default AddressForm;
