import { Button, Input } from '@/components/elements';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

interface FormProps {
    setActiveTab: (tabName: string) => void;
}

const PriceForm: React.FC<FormProps> = ({ setActiveTab }) => {
    const [price, setPrice] = useState<string>(''); // State for price input

    // Function to handle price input change
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputPrice = e.target.value;

        // Validate the price input (allow only numeric values)
        if (/^\d*\.?\d*$/.test(inputPrice) || inputPrice === '') {
            setPrice(inputPrice); // Update price state if valid
        }
    };

    // Calculate charity profit as 90% of the price
    const calculateCharityProfit = (price: string): string => {
        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice) || numericPrice < 0) return '£0.00'; // Return £0.00 if invalid
        const profit = numericPrice * 0.9; // Calculate 90%
        return `£${profit.toFixed(2)}`; // Format to 2 decimal places
    };

    return (
        <div className="flex flex-col w-full">
            <div className="flex space-x-2 md:flex-col md:space-x-0 mb-8">
                <div className="w-1/2 md:w-full">
                    {/* Price input */}
                    <Input
                        label='Price'
                        name='price'
                        placeholder='Product price'
                        id='price'
                        className='flex-col'
                        value={price} // Bind input value to state
                        onChange={handlePriceChange} // Handle price changes
                    />
                </div>
                <div className="w-1/2 md:w-full">
                    {/* Charity profit calculated based on price */}
                    {/* Use a simple input for editable fields, or a span for read-only display */}
                    <div className='flex flex-col'>
                        <label htmlFor='profit'>Charity profit</label>
                        <span className='bg-[#F1F1F7] !border-none !text-mono-100 !font-medium p-2'>
                            {calculateCharityProfit(price)} {/* Display calculated profit */}
                        </span>
                    </div>
                </div>
            </div>

            {/* Pricing tip section */}
            <div className="bg-[#F1F1F7] pt-2 pl-3 pb-6 pr-[30px] mb-[19px]">
                <p className="text-body-small text-[#474648]">
                    <span className="text-primary-color-100 text-body-caption font-medium mb-2 flex gap-[10px]">
                        <Image src="/images/icons/price.svg" alt="Pricing Icon" width={12} height={12} /> Pricing tip
                    </span>
                    Keep in mind the original item price; 2/3 of that price is usually a good choice. However, you can still choose any price you feel is suitable for your item.
                </p>
            </div>

            {/* Shopping info section */}
            <div className="bg-[#F1F1F7] pt-2 pl-3 pb-6 pr-[30px]">
                <p className="text-body-small text-[#474648]">
                    <span className="text-primary-color-100 text-body-caption font-medium mb-2 flex gap-[10px]">
                        <Image src="/images/icons/price.svg" alt="Shopping Icon" width={12} height={12} /> Shopping info
                    </span>
                    Please note that shipping costs are the responsibility of the seller and will not be reimbursed by the platform.
                </p>
            </div>

            {/* Action buttons */}
            <div className="flex justify-between items-center mt-[27px] mb-4">
                <Button variant='accend-link' className='flex items-center !text-primary-color-100' onClick={() => setActiveTab('photos')}>
                    <Image
                        width={16}
                        height={16}
                        src="/images/icons/arr-left.svg"
                        alt="Left Arrow Icon"
                    />
                    Back
                </Button>
                <div className="flex sm:flex-col space-x-4">
                    <Button variant='accend-link' className='flex items-center underline !text-primary-color-100' onClick={() => console.log('Should not click')}>Save as draft</Button>
                    <Button type='submit' variant='primary'>Finish</Button>
                </div>
            </div>
            <p className='text-[11px]'>
                By posting this listing, you agree to the Angelpage seller 
                <Link href='/privacy-policy' className='underline text-primary-color-100'> privacy policy</Link> 
                and <Link href='/terms-conditions' className='underline text-primary-color-100'> terms & conditions</Link> agreement.
            </p>
        </div>
    );
};

export default PriceForm;
