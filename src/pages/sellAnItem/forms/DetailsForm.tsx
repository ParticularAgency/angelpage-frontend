'use client';
import React, { useRef , useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { Button, Input, Select, Textarea } from '@/components/elements';
import ToastNotification, {
  ToastService,
} from '@/components/elements/notifications/ToastService';
import { categoriesData } from '@/libs/categoriesData'; // Adjust the path as needed
import { charityData } from '@/libs/charities'; // Assuming this is your JSON data file for charities


interface DetailsData {
  charity?: string;
  itemTitle?: string;
  condition?: string;
  brand?: string;
  material?: string;
  color?: string;
  selectedCategory?: string;
  selectedSubCategory?: string;
  additionalInfo?: string;
  height?: `${number}${'in' | 'cm'}` | ''; 
  width?: `${number}${'in' | 'cm'}` | ''; 
  depth?: `${number}${'in' | 'cm'}` | ''; 
}

// Props for the DetailsForm component
interface FormProps {
  setActiveTab: (tabName: 'details' | 'photos' | 'price') => void; 
  onSubmit: (detailsData: DetailsData) => void; 
  formData: DetailsData;
}

const DetailsForm: React.FC<FormProps> = ({
  setActiveTab,
  onSubmit,
  formData = {},
}) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  // Initialize state with values from formData or empty string
  const [charity, setCharity] = useState(formData.charity || '');
  const [charityList] = useState(charityData);
  const [filteredCharities, setFilteredCharities] = useState(charityList);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCharity, setSelectedCharity] = useState<string | null>(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [itemTitle, setItemTitle] = useState(formData.itemTitle || '');
  const [condition, setCondition] = useState(formData.condition || '');
  const [brand, setBrand] = useState(formData.brand || '');
  const [material, setMaterial] = useState(formData.material || '');
  const [color, setColor] = useState(formData.color || '');
  const [additionalInfo, setAdditionalInfo] = useState(
    formData.additionalInfo || ''
  );
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const extractNumber = (
    value: `${number}in` | `${number}cm` | '' | undefined
  ): number | '' => {
    if (typeof value === 'string' && value !== '') {
      const numberMatch = value.match(/^\d+(\.\d+)?/);
      return numberMatch ? parseFloat(numberMatch[0]) : '';
    }
    return '';
  };

  // Initialize state with parsed values
  const [height, setHeight] = useState<number | ''>(
    extractNumber(formData.height)
  );
  const [width, setWidth] = useState<number | ''>(
    extractNumber(formData.width)
  );
  const [depth, setDepth] = useState<number | ''>(
    extractNumber(formData.depth)
  );

  const [selectedCategory, setSelectedCategory] = useState<string>(
    formData.selectedCategory || 'Select'
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(
    formData.selectedSubCategory || 'Select'
  );
  const { categories } = categoriesData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Check required fields
    if (
      !selectedCharity ||
      !charity ||
      !itemTitle ||
      selectedCategory === 'Select' ||
      !condition
    ) {
      ToastService.error('Please fill in all required fields.');
      return;
    }

    const detailsData: DetailsData = {
      charity,
      itemTitle,
      condition,
      brand,
      material,
      color,
      selectedCategory,
      selectedSubCategory,
      additionalInfo,
      height: height !== '' ? `${height}${unit}` : '',
      width: width !== '' ? `${width}${unit}` : '',
      depth: depth !== '' ? `${depth}${unit}` : '',
    };

    console.log(detailsData);
    onSubmit(detailsData);
    setActiveTab('photos');
  };

  const handleUnitChange = (selectedUnit: 'in' | 'cm') => {
    setUnit(selectedUnit);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory('Select'); // Reset subcategory when category changes
  };

  const filteredSubCategories =
    categories.find(cat => cat.id === selectedCategory)?.subCategories || [];

  const isClothingOrShoes = [
    'women',
    'men',
    'children',
    'clothing',
    'shoes',
  ].includes(selectedCategory);
  const isBagsFurnitureElectronicsAccessories = [
    'bags',
    'homeware',
    'electronics',
    'accessories',
  ].includes(selectedCategory);
  // Update filtered charities based on the debounced search term
useEffect(() => {
  const filtered = charityList.filter(charity =>
    charity.name.toLowerCase().startsWith(debouncedSearchTerm.toLowerCase())
  );
  setFilteredCharities(filtered);
  setShowDropdown(filtered.length > 0 && debouncedSearchTerm.length > 0); // Show dropdown if filtered results exist
}, [debouncedSearchTerm, charityList]);


 const handleCharityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const value = e.target.value;
   setSearchTerm(value);
   setCharity(value);
   setSelectedCharity(null);

   // Show dropdown only when there's a search term
   if (value.length > 0) {
     setShowDropdown(true);
   } else {
     setShowDropdown(false);
   }
 };


 const handleInputFocus = () => {
   // Show dropdown if there's a search term
   if (searchTerm.length > 0) {
     setShowDropdown(true);
   }
   inputRef.current?.focus(); // Set focus on input
 };

const handleCharitySelect = (charityName: string) => {
  // Set the selected charity
  setCharity(charityName);
  setSelectedCharity(charityName);
  setSearchTerm(charityName);

  // Close the dropdown immediately after selecting an item
  setShowDropdown(false);
};

const handleDropdownBlur = () => {
  // Close the dropdown after a delay if the input loses focus
  setTimeout(() => {
    setShowDropdown(false);
  }, 200); // This can be adjusted as needed
};

 const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <p className="mb-5 body-bold-regular">Item details</p>
      <form className="flex flex-col w-full space-y-4" onSubmit={handleSubmit}>
        <div className="relative">
          <Input
            label="Choose Charity"
            name="charity"
            value={charity}
            onChange={handleCharityInputChange}
            onFocus={handleInputFocus}
            onBlur={handleDropdownBlur}
            placeholder="Start typing"
            id="charity"
            ref={inputRef} // Attach ref to Input
            className="flex-col"
          />
          {showDropdown && (
            <div className="absolute z-10 bg-white border border-gray-300 rounded shadow-lg w-full max-h-60 overflow-auto">
              <div className="max-h-48 overflow-y-auto">
                {filteredCharities.length > 0 ? (
                  filteredCharities.map(charity => (
                    <div
                      key={charity.id}
                      onClick={() => handleCharitySelect(charity.name)} // Call updated function
                      className="p-2 caption hover:bg-gray-200 cursor-pointer"
                    >
                      {charity.name}
                    </div>
                  ))
                ) : (
                  <div className="p-2 caption hover:bg-gray-200">
                    No results found
                  </div>
                )}
              </div>
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
              disabled={selectedCategory === 'Select'} // Disable subcategory if no category is selected
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

        <Select
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

        {isClothingOrShoes && (
          <>
            <p className="text-body-small">For clothes and shoes</p>
            <Select
              label="Size"
              name="size"
              id="size"
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

        {isBagsFurnitureElectronicsAccessories && (
          <>
            <p className="text-body-small">
              For bags, furniture, electronics, and accessories
            </p>
            <div className="flex gap-2">
              <Input
                label="Height"
                name="height"
                placeholder={`Enter height (${unit})`}
                id="height"
                type="number"
                value={height || ''}
                onChange={e =>
                  setHeight(e.target.value ? parseFloat(e.target.value) : '')
                }
                className="flex-col w-11/12"
              />
              <UnitButton unit={unit} handleUnitChange={handleUnitChange} />
            </div>

            <div className="flex gap-2">
              <Input
                label="Width"
                name="width"
                placeholder={`Enter width (${unit})`}
                id="width"
                type="number"
                value={width || ''}
                onChange={e =>
                  setWidth(e.target.value ? parseFloat(e.target.value) : '')
                }
                className="flex-col w-11/12"
              />
              <UnitButton unit={unit} handleUnitChange={handleUnitChange} />
            </div>

            <div className="flex gap-2">
              <Input
                label="Depth (optional)"
                name="depth"
                placeholder={`Enter depth (${unit})`}
                id="depth"
                type="number"
                value={depth || ''}
                onChange={e =>
                  setDepth(e.target.value ? parseFloat(e.target.value) : '')
                }
                className="flex-col w-11/12"
              />
              <UnitButton unit={unit} handleUnitChange={handleUnitChange} />
            </div>
          </>
        )}

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
            onClick={() => ToastService.success('Save as draft')}
          >
            Save as draft
          </Button>
          <Button type="submit" variant="primary">
            Continue
          </Button>
        </div>
      </form>
      <ToastNotification />
    </>
  );
};

// Reusable UnitButton Component
interface UnitButtonProps {
  unit: 'in' | 'cm';
  handleUnitChange: (selectedUnit: 'in' | 'cm') => void;
}

const UnitButton: React.FC<UnitButtonProps> = ({ unit, handleUnitChange }) => {
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
