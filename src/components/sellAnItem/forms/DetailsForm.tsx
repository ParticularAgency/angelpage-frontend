import React from 'react';

const DetailsForm = () => {
    return (
        <form className="flex flex-col w-full space-y-4">
            <div>
                <label className="block text-gray-700">Choose Charity</label>
                <input
                    type="text"
                    className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Start typing"
                />
            </div>
            <div>
                <label className="block text-gray-700">Item Title</label>
                <input
                    type="text"
                    className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Multi-coloured Mules"
                />
            </div>
            {/* Add other form fields here as per design */}
            <div className="flex justify-between items-center">
                <button type="button" className="text-purple-600">Save as draft</button>
                <button type="submit" className="bg-black text-white px-4 py-2 rounded-md">Continue</button>
            </div>
        </form>
    );
};

export default DetailsForm;
