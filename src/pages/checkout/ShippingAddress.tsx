'use client';
import { Button, Input } from '@/components/elements';
import { EditIcon, SaveIcon } from '@/icons';
import { useState } from 'react';

// Define the Address type
interface Address {
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

// Initial data for shipping
const initialAddress: Address = {
  name: 'Wilson Ndasi',
  address: '826 Zenix Crescent,',
  city: 'Thompsonland',
  country: 'United Kingdom',
  postalCode: 'W2 6FT',
};

const ShippingAddress = () => {
  const [addresses, setAddresses] = useState<Address[]>([initialAddress]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<
    number | null
  >(null);
  const [newAddress, setNewAddress] = useState<Address>(initialAddress);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // Edit existing address
  const handleEditAddress = (index: number) => {
    setSelectedAddressIndex(index);
    setNewAddress(addresses[index]);
    setIsEditingAddress(true);
    setIsAddingNewAddress(false);
  };

  // Save address (new or edited)
  const handleSaveAddress = () => {
    // Ensure selectedAddressIndex is not null
    if (selectedAddressIndex === null) return;

    const updatedAddresses = [...addresses];
    if (isAddingNewAddress) {
      updatedAddresses.push(newAddress);
    } else {
      updatedAddresses[selectedAddressIndex] = newAddress; // Safely use index
    }
    setAddresses(updatedAddresses);
    setIsEditingAddress(false);
    setIsAddingNewAddress(false);
    setNewAddress(initialAddress); // Reset newAddress to initial
  };

  // Cancel editing or adding
  const handleCancelAddress = () => {
    setIsEditingAddress(false);
    setIsAddingNewAddress(false);
    setNewAddress(initialAddress); // Reset newAddress to initial
  };

  // Handle address selection
  const handleAddressSelection = (index: number) => {
    setSelectedAddressIndex(index);
  };

  const handleDeleteAddress = (index: number) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
    if (selectedAddressIndex === index) {
      setSelectedAddressIndex(updatedAddresses.length > 0 ? 0 : null);
    }
  };

  return (
    <div className="address-info-wrapper pt-10">
      <div className="info-area-head mb-4 flex items-center justify-between gap-4">
        <h3 className="h5 font-primary text-mono-100">Shipping</h3>
        <Button
          variant="accend-link"
          className="!underline !text-primary-color-100"
          onClick={() => setIsAddingNewAddress(true)}
        >
          Add new address
        </Button>
      </div>
      <div className="address-item-area">
        {addresses.map((address, index) => (
          <div className="address-wrapper-box-item pb-10" key={index}>
            <div className="address-wrapper-box-head flex items-center justify-between pt-3 pr-2 pb-[7px] pl-[25px]">
              <div className="select-address-checkbox">
                <input
                  type="radio"
                  name="shippingAddress"
                  checked={selectedAddressIndex === index}
                  onChange={() => handleAddressSelection(index)}
                  className="radio w-4 h-4 focus:rounded-full selecting-checkbox-item "
                />
              </div>
              <div className="btn-states">
                {!isEditingAddress ? (
                  <Button
                    variant="accend-link"
                    className="!underline !text-primary-color-100 flex items-center gap-2"
                    onClick={() => handleEditAddress(index)}
                  >
                    Edit <EditIcon />
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="accend-link"
                      onClick={handleCancelAddress}
                      className="!underline !text-primary-color-100 flex items-center gap-2"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="accend-link"
                      onClick={handleSaveAddress}
                      className="!underline !text-primary-color-100 flex items-center gap-2"
                    >
                      Save <SaveIcon />
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="address-cont-wrapper-box-area px-[25px] pt-[17px] pb-[21px]">
              {!isEditingAddress || selectedAddressIndex !== index ? (
                <div className="flex items-center">
                  <div className="flex flex-col gap-0">
                    <p className="inf-text-title forms-bold mb-2 text-mono-80">
                      Shipping to
                    </p>
                    <p className="body-bold-small mb-1">{address.name}</p>
                    <p className="body-small block">{address.address}</p>
                    <p className="body-small block">{address.city}</p>
                    <p className="body-small block">{address.country}</p>
                    <p className="body-small block">{address.postalCode}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <Input
                    type="text"
                    value={newAddress.name}
                    onChange={e =>
                      setNewAddress({ ...newAddress, name: e.target.value })
                    }
                    className="w-full p-2 mb-2 border max-w-[386px]"
                  />
                  <Input
                    type="text"
                    value={newAddress.address}
                    onChange={e =>
                      setNewAddress({ ...newAddress, address: e.target.value })
                    }
                    className="w-full p-2 mb-2 border max-w-[386px]"
                  />
                  <Input
                    type="text"
                    value={newAddress.city}
                    onChange={e =>
                      setNewAddress({ ...newAddress, city: e.target.value })
                    }
                    className="w-full p-2 mb-2 border max-w-[386px]"
                  />
                  <Input
                    type="text"
                    value={newAddress.country}
                    onChange={e =>
                      setNewAddress({ ...newAddress, country: e.target.value })
                    }
                    className="w-full p-2 mb-2 border max-w-[386px]"
                  />
                  <Input
                    type="text"
                    value={newAddress.postalCode}
                    onChange={e =>
                      setNewAddress({
                        ...newAddress,
                        postalCode: e.target.value,
                      })
                    }
                    className="w-full p-2 mb-2 border max-w-[386px]"
                  />
                  <Button
                    variant="accend-link"
                    className="!underline !text-primary-color-100"
                    onClick={() => handleDeleteAddress(index)}
                  >
                    Delete address
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Address Section */}
      <div className={`${isAddingNewAddress && 'pb-10'}`}>
        {isAddingNewAddress && (
          <>
            <div className="address-wrapper-box-head flex items-center justify-between pt-3 pr-2 pb-[7px] pl-[25px]">
              <div className=""></div>
              <div className="btn-states">
                <Button
                  variant="accend-link"
                  onClick={handleCancelAddress}
                  className="!underline !text-primary-color-100 flex items-center gap-2"
                >
                  Cancel
                </Button>
                <Button
                  variant="accend-link"
                  onClick={handleSaveAddress}
                  className="!underline !text-primary-color-100 flex items-center gap-2"
                >
                  Save <SaveIcon />
                </Button>
              </div>
            </div>
            <div className="address-cont-wrapper-box-area px-[25px] pt-[17px] pb-[21px]">
              <Input
                type="text"
                placeholder="Name"
                value={newAddress.name}
                onChange={e =>
                  setNewAddress({ ...newAddress, name: e.target.value })
                }
                className="w-full p-2 mb-2 border max-w-[386px]"
              />
              <Input
                type="text"
                placeholder="Address"
                value={newAddress.address}
                onChange={e =>
                  setNewAddress({ ...newAddress, address: e.target.value })
                }
                className="w-full p-2 mb-2 border max-w-[386px]"
              />
              <Input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={e =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
                className="w-full p-2 mb-2 border max-w-[386px]"
              />
              <Input
                type="text"
                placeholder="Country"
                value={newAddress.country}
                onChange={e =>
                  setNewAddress({ ...newAddress, country: e.target.value })
                }
                className="w-full p-2 mb-2 border max-w-[386px]"
              />
              <Input
                type="text"
                placeholder="Postal Code"
                value={newAddress.postalCode}
                onChange={e =>
                  setNewAddress({ ...newAddress, postalCode: e.target.value })
                }
                className="w-full p-2 mb-2 border max-w-[386px]"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShippingAddress;
