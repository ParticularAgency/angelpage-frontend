import React from 'react';

interface TabNavigationProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="flex flex-col w-1/4 space-y-4">
            <button
                onClick={() => setActiveTab('details')}
                className={`p-2 text-left ${activeTab === 'details' ? 'text-purple-600 font-bold' : 'text-gray-600'}`}
            >
                1. Details
            </button>
            <button
                onClick={() => setActiveTab('photos')}
                className={`p-2 text-left ${activeTab === 'photos' ? 'text-purple-600 font-bold' : 'text-gray-600'}`}
            >
                2. Photos
            </button>
            <button
                onClick={() => setActiveTab('price')}
                className={`p-2 text-left ${activeTab === 'price' ? 'text-purple-600 font-bold' : 'text-gray-600'}`}
            >
                3. Price
            </button>
        </div>
    );
};

export default TabNavigation;
