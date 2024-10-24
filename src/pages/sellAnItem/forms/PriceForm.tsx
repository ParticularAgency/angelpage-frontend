import { Button, Input } from '@/components/elements';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface FormProps {
    setActiveTab: (tabName: string) => void;
}

const PriceForm: React.FC<FormProps> = ({ setActiveTab }) => {
    return (
        <div className="flex flex-col w-full">
            <div className="flex space-x-2 md:flex-col md:space-x-0 mb-8">
                <div className="w-1/2 md:w-full">
                    <Input label='Price' name='price' placeholder='£65.00' id='price' className='flex-col' />
                </div>
                <div className="w-1/2 md:w-full">
                    <Input label='Charity profit' name='profit' value='£58.50' className='flex-col' inputClasses='bg-[#F1F1F7] !border-none !focus-none !text-mono-100 !font-medium' />
                </div>
            </div>
            {/* Photo tip section */}
            <div className="bg-[#F1F1F7] pt-2 pl-3 pb-6 pr-[30px] mb-[19px]">
                <p className="text-body-small text-[#474648]">
                    <p className="text-primary-color-100 text-body-caption font-medium mb-2 flex gap-[10px]"><Image src="/images/icons/price.svg" alt="Pricing Icon" width={12} height={12} /> Pricing tip</p>
                    Have in mind the original item price in mind, 2/3 of that price is usually a good choice. However, you can still choose any price you feel is suitable for your item.
                </p>
            </div>
            {/* Photo tip section */}
            <div className="bg-[#F1F1F7] pt-2 pl-3 pb-6 pr-[30px]">
                <p className="text-body-small text-[#474648]">
                    <p className="text-primary-color-100 text-body-caption font-medium mb-2 flex gap-[10px]"><Image src="/images/icons/price.svg" alt="Shopping Icon" width={12} height={12} /> Shopping info</p>
                    Please note that you, shipping costs are the responsibility of the seller and will not be reimbursed by the platform.
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
            <p className='text-[11px]'>By posting this listing, you agree to the Angelpage seller <Link href='' className='underline text-primary-color-100'>privacy policy</Link> and <Link href='' className='underline text-primary-color-100'>terms & conditions</Link> agreement.</p>
        </div>
    );
};

export default PriceForm;
