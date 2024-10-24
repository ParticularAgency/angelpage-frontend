import React from 'react';

const PriceForm = () => {
    return (
        <div className="flex flex-col w-full space-y-4">
            <div className="flex space-x-4">
                <div className="w-1/2">
                    <label className="block text-gray-700">Price</label>
                    <input
                        type="text"
                        className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="£65.00"
                    />
                </div>
                <div className="w-1/2">
                    <label className="block text-gray-700">Charity Profit</label>
                    <input
                        type="text"
                        className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="£58.50"
                    />
                </div>
            </div>
            <div className="flex justify-between items-center">
                <button type="button" className="text-purple-600">Back</button>
                <button type="submit" className="bg-black text-white px-4 py-2 rounded-md">Finish</button>
            </div>
        </div>
    );
};

export default PriceForm;
