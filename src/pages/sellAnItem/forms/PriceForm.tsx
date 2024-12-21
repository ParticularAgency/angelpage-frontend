'use client';
import { Button, Input } from '@/components/elements';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import {
  ToastService,
} from '@/components/elements/notifications/ToastService';

interface FormProps {
  setActiveTab: (tabName: 'details' | 'photos' | 'price') => void;
  onSubmit: (detailsData: DetailsData) => void;
  onFinish: () => void;
  onBack: () => void;
  onSaveAsDraft: () => void; // Handler for Save as Draft
  formData?: { price: string; charityProfit: string };
  isSubmitting: boolean;
}

interface DetailsData {
  price: string;
  charityProfit: string;
}

const PriceForm: React.FC<FormProps> = ({
  onSubmit,
  onFinish,
  onBack,
  onSaveAsDraft,
  formData = { price: '', charityProfit: '' },
  isSubmitting,
}) => {
  const [price, setPrice] = useState<string>(formData.price);
  const [charityProfit, setCharityProfit] = useState<string>(
    formData.charityProfit
  );
  const [error, setError] = useState<string>(''); // State for error message

  // Refs to store the latest values
  const priceRef = useRef(price);
  const charityProfitRef = useRef(charityProfit);

  // Helper function to calculate charity profit based on the entered price
  const calculateCharityProfit = (priceValue: string) => {
    const numericPrice = parseFloat(priceValue.replace(/[^\d.]/g, ''));
    if (!isNaN(numericPrice) && numericPrice > 0) {
      return `£${(numericPrice * 0.9).toFixed(2)}`;
    } else {
      return '£0.00';
    }
  };

  // Handle price input changes
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputPrice = e.target.value;

    // Ensure the input always starts with "£" and only allows numbers after it
    if (!inputPrice.startsWith('£')) {
      inputPrice = '£' + inputPrice.replace(/£/g, '');
    }

    // Allow only valid numeric values after "£"
    const numericValue = inputPrice.slice(1);
    if (/^\d*\.?\d*$/.test(numericValue) || numericValue === '') {
      const newPrice = '£' + numericValue;
      setPrice(newPrice);
      priceRef.current = newPrice;

      // Update charity profit
      const updatedCharityProfit = calculateCharityProfit(newPrice);
      setCharityProfit(updatedCharityProfit);
      charityProfitRef.current = updatedCharityProfit;
      setError(''); // Clear any error messages on valid input
    } else {
      const errorMessage = 'Invalid price format. Please enter a valid price.';
      setError(errorMessage);
      ToastService.error(errorMessage); // Show toast notification
    }
  };

  // Handle submit to ensure it uses the latest values from refs
  const handleSubmit = () => {
    const finalPrice = priceRef.current;
    const finalCharityProfit = charityProfitRef.current;

    // Validation: Check if the price is blank or invalid
    const numericPrice = parseFloat(finalPrice.replace(/[^\d.]/g, ''));
    if (finalPrice.trim() === '' || finalPrice === '£') {
      const errorMessage = 'Price is required. Please enter a price.';
      setError(errorMessage);
      ToastService.error(errorMessage); // Show toast notification
      return; // Stop submission
    }

    // Minimum price validation
    if (numericPrice < 1) {
      const errorMessage =
        'Price must be at least £1. Please enter a valid price.';
      setError(errorMessage);
      ToastService.error(errorMessage); // Show toast notification
      return; // Stop submission
    }

    // If no errors, submit the latest values
    onSubmit({ price: finalPrice, charityProfit: finalCharityProfit });
    ToastService.success('Your product listed successfully!');
    onFinish(); // Call onFinish only after a successful submit
  };

  useEffect(() => {
    // Update the state if formData changes
    setPrice(formData.price);
    setCharityProfit(formData.charityProfit);
  }, [formData]);

  return (
    <>
      <div className="flex flex-col w-full">
        <p className="mb-2 body-bold-regular">Price</p>
        <div className="flex space-x-2  md:space-x-0 md:gap-3 mb-8">
          <div className="w-1/2 md:w-full price-input-box">
            <Input
              label="Price"
              name="price"
              placeholder="£"
              id="price"
              className={`flex-col !body-bold-small text-mono-100 ${error ? 'border-red-500' : ''}`} // Highlight error
              value={price}
              onChange={handlePriceChange}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <div className="w-1/2 md:w-full">
            <div className="flex flex-col">
              <label htmlFor="profit" className="mb-2 forms">
                Charity profit
              </label>
              <span className="bg-[#F1F1F7] body-bold-small !border-none flex items-center h-10 !text-mono-100 !font-medium p-2">
                {calculateCharityProfit(price)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#F1F1F7] pt-2 pl-3 pb-6 pr-[30px] mb-[19px]">
          <p className="text-body-small text-[#474648]">
            <span className="text-primary-color-100 text-body-caption font-medium mb-2 flex gap-[10px]">
              <Image
                src="/images/icons/price.svg"
                alt="Pricing Icon"
                width={12}
                height={12}
              />
              Pricing tip
            </span>
            Keep in mind the original item price; 2/3 of that price is usually a
            good choice. However, you can still choose any price you feel is
            suitable for your item.
          </p>
        </div>

        <div className="bg-[#F1F1F7] pt-2 pl-3 pb-6 pr-[30px]">
          <p className="text-body-small text-[#474648]">
            <span className="text-primary-color-100 text-body-caption font-medium mb-2 flex gap-[10px]">
              <Image
                src="/images/icons/price.svg"
                alt="Shopping Icon"
                width={12}
                height={12}
              />
              Shopping info
            </span>
            Please note that shipping costs are the responsibility of the seller
            and will not be reimbursed by the platform.
          </p>
        </div>

        <div className="flex justify-between items-center mt-[27px] mb-4">
          <Button
            variant="accend-link"
            className="flex items-center !text-primary-color-100"
            onClick={onBack}
          >
            <Image
              width={16}
              height={16}
              src="/images/icons/arr-left.svg"
              alt="Left Arrow Icon"
            />
            Back
          </Button>
          <div className="flex sm:flex-col space-x-4">
            <Button
              variant="accend-link"
              className="flex items-center underline !text-primary-color-100 !pr-0"
              onClick={onSaveAsDraft}
            >
              Save as draft
            </Button>
            <Button
              type="button"
              variant="primary"
              className={`flex items-center ${error ? 'opacity-50 cursor-not-allowed' : ''}`} // Disable button if there is an error
              onClick={handleSubmit}
              disabled={!!error} // Disable button if there's an error
            >
              {isSubmitting ? 'Loading...' : 'Finish'}
            </Button>
          </div>
        </div>
        <p className="text-[11px]">
          By posting this listing, you agree to the Angelpage seller{' '}
          <Link
            href="/privacy-policy"
            className="underline text-primary-color-100"
          >
            privacy policy
          </Link>{' '}
          and{' '}
          <Link
            href="/terms-conditions"
            className="underline text-primary-color-100"
          >
            terms & conditions
          </Link>{' '}
          agreement.
        </p>
      </div>
     
    </>
  );
};

export default PriceForm;
