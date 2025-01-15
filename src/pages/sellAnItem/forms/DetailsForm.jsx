'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { Button, Input, Select, Textarea } from '@/components/elements';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import {
  ToastService,
} from '@/components/elements/notifications/ToastService';
import { categoriesData } from '@/libs/categoriesData';

// interface Dimensions {
//   height?: `${number}${'in' | 'cm'}` | '';
//   width?: `${number}${'in' | 'cm'}` | '';
//   depth?: `${number}${'in' | 'cm'}` | '';
// }

// interface DetailsData {
//   charityId?: string; // Adding charityId to the details data
//   charityName?: string; // Adding charityName to the details data
//   itemTitle?: string;
//   condition?: string;
//   brand?: string;
//   material?: string;
//   color?: string;
//   size?: string;
//   dimensions?: Dimensions[];
//   selectedCategory?: string;
//   selectedSubCategory?: string;
//   additionalInfo?: string;
// }

// interface FormProps {
//   setActiveTab: (tabName: 'details' | 'photos' | 'price') => void;
//   onSubmit: (detailsData: DetailsData) => void;
//   formData: DetailsData;
//   onSaveAsDraft: () => void;
//   hideCharitySelection?: boolean;
// }

const DetailsForm = ({
  setActiveTab,
  onSubmit,
  formData = {},
  onSaveAsDraft,
  hideCharitySelection = false,
}) => {
  const [unit, setUnit] = useState('in');
  const { data: session } = useSession() || {};

  // Separate states for charityId and charityName
  const [charityName, setCharityName] = useState(formData.charityName || '');
  const [charityId, setCharityId] = useState(
    formData.charityId || null
  );
  const [charityList, setCharityList] = useState([]);
  const [filteredCharities, setFilteredCharities] = useState([]);
  const [loadingCharities, setLoadingCharities] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const [itemTitle, setItemTitle] = useState(formData.itemTitle || '');
  const [condition, setCondition] = useState(formData.condition || '');
  const [brand, setBrand] = useState(formData.brand || '');
  const [material, setMaterial] = useState(formData.material || '');
  const [color, setColor] = useState(formData.color || '');
  const [size, setSize] = useState(formData.size || '');
  const [weight, setWeight] = useState(formData.weight || '');
  const [additionalInfo, setAdditionalInfo] = useState(
    formData.additionalInfo || ''
  );
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const [dimensions, setDimensions] = useState({
    height: formData.dimensions?.height || '',
    width: formData.dimensions?.width || '',
    depth: formData.dimensions?.depth || '',
  });

  const [selectedCategory, setSelectedCategory] = useState(
    formData.selectedCategory || 'Select'
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    formData.selectedSubCategory || 'Select'
  );
  const { categories } = categoriesData;

  // Handler for form submission
  const handleSubmit = e => {
    e.preventDefault();
    if (
      (!hideCharitySelection && (!charityId || !charityName)) || // Ensure charityId is selected
      !itemTitle ||
      selectedCategory === 'Select' ||
      !condition
    ) {
      ToastService.error('Please fill in all required fields.');
      return;
    }

    const detailsData = {
      charityId,
      charityName,
      itemTitle,
      condition,
      brand,
      material,
      color,
      size,
      weight,
      selectedCategory,
      selectedSubCategory,
      additionalInfo,
      dimensions: {
        height: dimensions.height !== '' ? `${dimensions.height}${unit}` : '',
        width: dimensions.width !== '' ? `${dimensions.width}${unit}` : '',
        depth: dimensions.depth !== '' ? `${dimensions.depth}${unit}` : '',
      },
    };

    onSubmit(detailsData);
    setActiveTab('photos');
  };

  // Fetch charity list from API
  useEffect(() => {
    const fetchCharityList = async () => {
      if (!session?.token) {
        console.warn('No session token available, cannot fetch charities.');
        return;
      }

      setLoadingCharities(true);
      try {
        console.log('Fetching charities with session token:', session.token);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/charity/charities`,
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          }
        );

        // Log the entire response to understand its structure
        console.log('Full API response:', response);

        // Check if the response has the correct structure
        if (response.data && Array.isArray(response.data.charities)) {
          setCharityList(response.data.charities);
          setFilteredCharities(response.data.charities);
        } else {
          console.warn('Unexpected response format:', response);
          ToastService.error(
            'Failed to load charity list. Unexpected response format.'
          );
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            ToastService.error(
              'Bad request. Please verify the request parameters.'
            );
          } else if (error.response?.status === 401) {
            ToastService.error('Unauthorized access. Please log in again.');
          } else {
            ToastService.error('Failed to load charity list.');
          }
        } else {
          console.error('Unexpected error:', error);
        }
      } finally {
        setLoadingCharities(false);
      }
    };

    if (session) {
      fetchCharityList();
    }
  }, [session]);

  // Update charity dropdown when search term changes
  useEffect(() => {
    if (Array.isArray(charityList) && charityList.length > 0) {
      const filtered = charityList.filter(charity =>
        charity.charityName
          ?.toLowerCase()
          .startsWith(debouncedSearchTerm.toLowerCase())
      );
      setFilteredCharities(filtered);
      setShowDropdown(filtered.length > 0 && debouncedSearchTerm.length > 0);
    }
  }, [debouncedSearchTerm, charityList]);

  const handleCharityInputChange = e => {
    const value = e.target.value;
    setSearchTerm(value);
    setCharityName(value);
    setCharityId(null); // Clear the charityId when the input changes
    setShowDropdown(value.length > 0);
  };

  const handleCharitySelect = (charity) => {
    setCharityName(charity.charityName);
    setCharityId(charity._id); // Save the charityId when a charity is selected
    setSearchTerm(charity.charityName);
    setShowDropdown(false);
  };

  const handleDropdownBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory('Select');
  };

  const handleDimensionChange = (
    e,
    key
  ) => {
    const value = e.target.value;
    setDimensions(prev => ({
      ...prev,
      [key]: value !== '' ? parseFloat(value) : '',
    }));
  };

  const filteredSubCategories =
    categories.find(cat => cat.id === selectedCategory)?.subCategories || [];

  const isClothing = [
    'women',
    'men',
    'children',
    'clothing',
  ].includes(selectedCategory);
    const isShoes = [
      'shoes',
    ].includes(selectedCategory);
  // const isBagsFurnitureElectronicsAccessories = [
  //   'bags',
  //   'homeware',
  //   'electronics',
  //   'accessories',
  // ].includes(selectedCategory);

  const inputRef = useRef(null);
  return (
    <>
      <p className="mb-5 body-bold-regular">Item details</p>
      <form className="flex flex-col w-full space-y-4" onSubmit={handleSubmit}>
        <div className="relative">
          {!hideCharitySelection && (
            <Input
              label="Choose Charity"
              name="charity"
              value={charityName}
              onChange={handleCharityInputChange}
              onBlur={handleDropdownBlur}
              placeholder="Start typing"
              id="charity"
              ref={inputRef}
              className="flex-col"
            />
          )}
          {showDropdown && (
            <div className="absolute z-10 bg-white border border-gray-300 rounded shadow-lg w-full max-h-60 overflow-auto">
              {loadingCharities ? (
                <div className="p-2">Loading charities...</div>
              ) : filteredCharities.length > 0 ? (
                <div className="max-h-48 overflow-y-auto">
                  {filteredCharities.map(charity => (
                    <div
                      key={charity._id}
                      onClick={() => handleCharitySelect(charity)}
                      className="p-2 caption hover:bg-gray-200 cursor-pointer"
                    >
                      {charity.charityName}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2 caption">No results found</div>
              )}
            </div>
          )}
        </div>
        <Input
          label="Item Title"
          name="itemTitle"
          value={itemTitle}
          onChange={e => setItemTitle(e.target.value)}
          placeholder="Multi-coloured Mules"
          id="item-title"
          className="flex-col"
        />

        {/* Category and Sub-category */}
        <div className="flex space-x-6 md:flex-col md:space-x-0 md:space-y-4">
          <div className="w-1/2 md:w-full">
            <Select
              label="Category"
              name="category"
              id="category"
              value={selectedCategory}
              onChange={e => handleCategoryChange(e.target.value)}
              options={[
                { value: '', label: 'Select' },
                ...categories.map(cat => ({ value: cat.id, label: cat.name })),
              ]}
            />
          </div>
          <div className="w-1/2 md:w-full">
            <Select
              label="Sub-category"
              name="subCategory"
              id="subCategory"
              value={selectedSubCategory}
              onChange={e => setSelectedSubCategory(e.target.value)}
              options={[
                { value: '', label: 'Select' },
                ...filteredSubCategories.map(sub => ({
                  value: sub.id,
                  label: sub.name,
                })),
              ]}
              disabled={selectedCategory === 'Select'}
            />
          </div>
        </div>

        <Select
          label="Condition"
          name="condition"
          value={condition}
          onChange={e => setCondition(e.target.value)}
          id="condition"
          options={[
            { value: '', label: 'Select' },
            { value: 'New', label: 'New' },
            { value: 'Used', label: 'Used' },
            { value: 'Refurbished', label: 'Refurbished' },
            { value: 'Very good condition', label: 'Very good condition' },
            { value: 'Good condition', label: 'Good condition' },
            { value: 'Fair condition', label: 'Fair condition' },
          ]}
        />

        <Input
          label="Brand"
          name="brand"
          id="brand"
          value={brand}
          onChange={e => setBrand(e.target.value)}
          placeholder="Type your Brand..."
          className="flex-col"
        />

        {/* <Select
          label="Material"
          name="material"
          id="material"
          value={material}
          onChange={e => setMaterial(e.target.value)}
          options={[
            { value: '', label: 'Select' },
            { value: 'Leather', label: 'Leather' },
            { value: 'Textile', label: 'Textile' },
            { value: 'Synthetic', label: 'Synthetic' },
          ]}
        /> */}
        <Input
          label="Material"
          name="material"
          id="material"
          value={material}
          onChange={e => setMaterial(e.target.value)}
          placeholder="Set product material..."
          className="flex-col"
        />
        <Input
          label="Colour"
          name="colour"
          id="colour"
          value={color}
          onChange={e => setColor(e.target.value)}
          placeholder="Set product color..."
          className="flex-col"
        />

        {isClothing && (
          <>
            <p className="text-body-small">For clothes and shoes</p>
            <Select
              label="Size"
              name="size"
              id="size"
              value={size}
              onChange={e => setSize(e.target.value)}
              options={[
                { value: '', label: 'Select' },
                { value: 'Small', label: 'Small' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Large', label: 'Large' },
                { value: 'Extra Large', label: 'Extra Large' },
              ]}
            />
          </>
        )}
        {isShoes && (
          <>
            <p className="text-body-small">For clothes and shoes</p>
            <Select
              label="Size"
              name="size"
              id="size"
              value={size}
              onChange={e => setSize(e.target.value)}
              options={[
                { value: '', label: 'Select' },
                { value: 'UK 1', label: 'UK 1' },
                { value: 'UK 2', label: 'UK 2' },
                { value: 'UK 3', label: 'UK 3' },
                { value: 'UK 4', label: 'UK 4' },
                { value: 'UK 5', label: 'UK 5' },
                { value: 'UK 6', label: 'UK 6' },
                { value: 'UK 7', label: 'UK 7' },
                { value: 'UK 8', label: 'UK 8' },
                { value: 'UK 9', label: 'UK 9' },
                { value: 'UK 10', label: 'UK 10' },
                { value: 'UK 11', label: 'UK 11' },
                { value: 'UK 12', label: 'UK 12' },
                { value: 'UK 13', label: 'UK 13' },
                { value: 'UK 14', label: 'UK 14' },
              ]}
            />
          </>
        )}
        {/* {isBagsFurnitureElectronicsAccessories && ( */}
        <>
          <p className="text-body-small">For package info</p>
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              <Input
                label="Weight"
                name="weight"
                id="weight"
                type="number"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="Set weight (ounces)..."
                className="flex-col w-full"
              />
            </div>

            <div className="flex gap-2">
              <Input
                label="Height"
                name="height"
                placeholder={`Enter height (${unit})`}
                id="height"
                type="number"
                value={dimensions.height || ''}
                onChange={e => handleDimensionChange(e, 'height')}
                className="flex-col w-full"
              />
              <UnitButton unit={unit} handleUnitChange={setUnit} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              <Input
                label="Width"
                name="width"
                placeholder={`Enter width (${unit})`}
                id="width"
                type="number"
                value={dimensions.width || ''}
                onChange={e => handleDimensionChange(e, 'width')}
                className="flex-col w-full"
              />
              {/* <UnitButton unit={unit} handleUnitChange={setUnit} /> */}
            </div>

            <div className="flex gap-2">
              <Input
                label="Depth (optional)"
                name="depth"
                placeholder={`Enter depth (${unit})`}
                id="depth"
                type="number"
                value={dimensions.depth || ''}
                onChange={e => handleDimensionChange(e, 'depth')}
                className="flex-col w-full"
              />
              <UnitButton unit={unit} handleUnitChange={setUnit} />
            </div>
          </div>
        </>
        <Textarea
          label="Additional Information"
          name="additionalInfo"
          value={additionalInfo}
          onChange={e => setAdditionalInfo(e.target.value)}
          placeholder="Enter any additional information"
        />

        <div className="flex justify-end">
          <Button
            variant="accend-link"
            className="flex items-center underline !text-primary-color-100"
            onClick={onSaveAsDraft}
          >
            Save as draft
          </Button>
          <Button type="submit" variant="primary">
            Continue
          </Button>
        </div>
      </form>
    </>
  );
};

// Reusable UnitButton Component
// interface UnitButtonProps {
//   unit: 'in' | 'cm';
//   handleUnitChange: (selectedUnit: 'in' | 'cm') => void;
// }

const UnitButton = ({ unit, handleUnitChange }) => {
  return (
    <Button
      type="button"
      variant="primary"
      className="self-end w-[50px] h-10"
      onClick={() => handleUnitChange(unit === 'in' ? 'cm' : 'in')}
    >
      {unit === 'in' ? 'cm' : 'in'}
    </Button>
  );
};

export default DetailsForm;
