import { Button, Input, Select, Textarea } from '@/components/elements';
import React, { useState } from 'react';
import { categoriesData } from '@/libs/categoriesData';  // Adjust the path as needed

interface FormProps {
    setActiveTab: (tabName: string) => void;
}

const DetailsForm: React.FC<FormProps> = ({ setActiveTab }) => {
    // State for unit system (either 'in' or 'cm')
    const [unit, setUnit] = useState<'in' | 'cm'>('in');

    // State for selected category and subcategory
    const [selectedCategory, setSelectedCategory] = useState<string>('Select');
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>('Select');

    // Categories and subcategories come from the imported JSON file
    const { categories } = categoriesData;

    // Handler for unit change
    const handleUnitChange = (selectedUnit: 'in' | 'cm') => {
        setUnit(selectedUnit);  // Update the unit for all inputs
    };
 
    // Handler for category change
    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);
        setSelectedSubCategory('Select'); // Reset subcategory when category changes
    };

    // Get the subcategories for the selected category
    const filteredSubCategories = categories.find(cat => cat.id === selectedCategory)?.subCategories || [];

    // Check if the selected category is for clothes or shoes
    const isClothingOrShoes = ['women', 'men', 'children', 'clothing', 'shoes'].includes(selectedCategory);

    // Check if the selected category is bags, furniture, electronics, or accessories
    const isBagsFurnitureElectronicsAccessories = ['bags', 'homeware', 'electronics', 'accessories'].includes(selectedCategory);

    return (
        <form className="flex flex-col w-full space-y-4">
            {/* Charity Input */}
            <div>
                <Input label='Choose Charity' name='charity' placeholder='Start typing' id='charity' className='flex-col' />
            </div>

            {/* Item Title Input */}
            <div>
                <Input label='Item Title' name='item-title' placeholder='Multi-coloured Mules' id='item-title' className='flex-col' />
            </div>

            {/* Category and Sub-category */}
            <div className="flex space-x-6 md:flex-col md:space-x-0 md:space-y-4">
                <div className="w-1/2 md:w-full">
                    <Select
                        label='Category'
                        name='category'
                        id='category'
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        options={['Select', ...categories.map(cat => ({ value: cat.id, label: cat.name }))]}
                    />
                </div>
                <div className="w-1/2 md:w-full">
                    <Select
                        label='Sub-category'
                        name='subCategory'
                        id='subCategory'
                        value={selectedSubCategory}
                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                        options={['Select', ...filteredSubCategories.map(sub => ({ value: sub.id, label: sub.name }))]}
                        disabled={selectedCategory === 'Select'}  // Disable subcategory if no category is selected
                    />
                </div>
            </div>

            {/* Condition, Brand, Material, Colour Inputs */}
            <div>
                <Select label='Condition' name='condition' id='condition' options={['Select', 'New', 'Used', 'Refurbished', 'Very good condtion','Good condtion','Fair condition']} />
            </div>
            <div>
                {/* <Select label='Brand' name='brand' id='brand' options={['Select', 'Nike', 'Adidas', 'Reebok']} /> */}
                <Input label='Brand' name='brand' id='brand' placeholder='Type your Brand...' className="flex-col" />
            </div>
            <div>
                <Select label='Material' name='material' id='material' options={['Select', 'Leather', 'Textile', 'Synthetic']} />
            </div>
            <div>
                {/* <Select label='Colour' name='colour' id='colour' options={['Select', 'Red', 'Blue', 'Green']} /> */}
                 <Input label='Colour' name='colour' id='colour' placeholder='Set product color...' className="flex-col" />
            </div>

            {/* Conditionally render Size for Clothes and Shoes */}
            {isClothingOrShoes && (
                <>
                    <p className='text-body-small'>For clothes and shoes</p>
                    <div>
                        <Select label='Size' name='size' id='size' options={['Select', 'Small', 'Medium', 'Large', 'Extra Large']} />
                    </div>
                </>
            )}

            {/* Conditionally render Height, Width, and Depth for bags, furniture, electronics, and accessories */}
            {isBagsFurnitureElectronicsAccessories && (
                <>
                    <p className='text-body-small'>For bags, furniture, electronics, and accessories</p>
                    <div className='flex gap-2'>
                        <Input label='Height' name='height' placeholder={`Enter height (${unit})`} id='height' type='number' className='flex-col w-11/12' />
                        <UnitButton unit={unit} handleUnitChange={handleUnitChange} />
                    </div>

                    <div className='flex gap-2'>
                        <Input label='Width' name='width' placeholder={`Enter width (${unit})`} id='width' type='number' className='flex-col w-11/12' />
                        <UnitButton unit={unit} handleUnitChange={handleUnitChange} />
                    </div>

                    <div className='flex gap-2'>
                        <Input label='Depth (optional)' name='depth' placeholder={`Enter depth (${unit})`} id='depth' type='number' className='flex-col w-11/12' />
                        <UnitButton unit={unit} handleUnitChange={handleUnitChange} />
                    </div>
                </>
            )}

            {/* Additional Information */}
            <div>
                <Textarea label='Additional Information' name='additionalInfo' placeholder='Enter any additional information' />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end">
                <Button variant='accend-link' className='flex items-center underline !text-primary-color-100' onClick={() => console.log('Save as draft clicked')}>
                    Save as draft
                </Button>
                <Button type='submit' variant='primary' onClick={() => setActiveTab('photos')}>
                    Continue
                </Button>
            </div>
        </form>
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
            type='button'
            variant='primary'
            className='self-end w-[50px] h-10'
            onClick={() => handleUnitChange(unit === 'in' ? 'cm' : 'in')}  // Toggle between 'in' and 'cm'
        >
            {unit === 'in' ? 'cm' : 'in'}  {/* Display the current unit */}
        </Button>
    );
};

export default DetailsForm;
