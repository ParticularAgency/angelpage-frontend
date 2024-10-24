"use client"

import { useState } from 'react';
import DetailsForm from './forms/DetailsForm';
import PhotosForm from './forms/PhotosForm';
import PriceForm from './forms/PriceForm';
import TabNavigation from './navigation/TabNavigation';

const SellAnItem = () => {
    const [activeTab, setActiveTab] = useState('details');

    return (
        <div className="max-w-[590px] m-auto pt-14 pb-[111px] sm:pb-18">
            <div className="flex sm:flex-col gap-5">
            {/* Navigation Section */}
            <div className='sm:w-full sm:px-4 w-1/4'>
                <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* Form Section */}
            <div  className='sm:w-full sm:px-4 w-3/4'>
                {activeTab === 'details' && (
                    <>
                        <p className="font-medium mb-[19px]">Item Details</p>
                        <DetailsForm />
                    </>
                )}
                {activeTab === 'photos' && (
                    <>
                        <p className="font-medium mb-[19px]">Photos</p>
                        <PhotosForm />
                    </>
                )}
                {activeTab === 'price' && (
                    <>
                        <p className="font-medium mb-[19px]">Price</p>
                        <PriceForm />
                    </>
                )}
            </div>
            </div>
        </div>
    );
};

export default SellAnItem;
