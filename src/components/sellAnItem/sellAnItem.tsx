"use client"

import { useState } from 'react';
import DetailsForm from './forms/DetailsForm';
import PhotosForm from './forms/PhotosForm';
import PriceForm from './forms/PriceForm';
import TabNavigation from './navigation/TabNavigation';

const SellAnItem = () => {
    const [activeTab, setActiveTab] = useState('details');

    return (
        <div className="flex space-x-8">
            {/* Navigation Section */}
            <div className="w-1/4">
                <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* Form Section */}
            <div className="w-3/4">
                {activeTab === 'details' && (
                    <>
                        <h1 className="text-2xl font-semibold mb-6">Item Details</h1>
                        <DetailsForm />
                    </>
                )}
                {activeTab === 'photos' && (
                    <>
                        <h1 className="text-2xl font-semibold mb-6">Photos</h1>
                        <PhotosForm />
                    </>
                )}
                {activeTab === 'price' && (
                    <>
                        <h1 className="text-2xl font-semibold mb-6">Price</h1>
                        <PriceForm />
                    </>
                )}
            </div>
        </div>
    );
};

export default SellAnItem;
