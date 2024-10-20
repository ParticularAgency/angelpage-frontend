import React from 'react';
import Link from 'next/link';

const TabNavigation = ({ activeTab }: { activeTab: string }) => {
    return (
        <div className="flex flex-col w-1/4 space-y-4">
            <Link href="/details">
                <a className={`p-2 ${activeTab === 'details' ? 'text-purple-600 font-bold' : 'text-gray-600'}`}>
                    1. Details
                </a>
            </Link>
            <Link href="/photos">
                <a className={`p-2 ${activeTab === 'photos' ? 'text-purple-600 font-bold' : 'text-gray-600'}`}>
                    2. Photos
                </a>
            </Link>
            <Link href="/price">
                <a className={`p-2 ${activeTab === 'price' ? 'text-purple-600 font-bold' : 'text-gray-600'}`}>
                    3. Price
                </a>
            </Link>
        </div>
    );
};

export default TabNavigation;
