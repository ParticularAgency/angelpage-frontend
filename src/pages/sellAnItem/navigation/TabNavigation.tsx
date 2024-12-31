'use client';
import React from 'react';
import { CheckmarkBlack } from '@/icons';

interface TabNavigationProps {
  activeTab: 'details' | 'photos' | 'price';
  setActiveTab: React.Dispatch<
    React.SetStateAction<'details' | 'photos' | 'price'>
  >;
  stepCompletion?: { details: boolean; photos: boolean; price: boolean }; // Made optional
  extraClass?: string; // New prop for additional classes
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  // setActiveTab,
  stepCompletion = { details: false, photos: false, price: false }, // Default value
  extraClass = '', // Default to empty string if no class is provided
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:gap-x-1 w-full gap-y-2 ${extraClass}`}
    >
      <button
        // onClick={() => setActiveTab('details')}
        className={`py-1 sm:max-w-full sm:w-full px-2 ${stepCompletion.details && 'steps-completed'} text-body-small text-left flex items-center justify-between gap-2 ${activeTab === 'details' ? 'bg-[#F1F1F8] font-medium text-mono-100' : 'text-mono-80'}`}
        tabIndex={0}
        // aria-pressed={activeTab === 'details'}
      >
        1 &nbsp; Details
        {stepCompletion.details && (
          <span className="mark-completion">
            <CheckmarkBlack />
          </span>
        )}
      </button>
      <button
        // onClick={() => setActiveTab('photos')}
        className={`py-1 sm:max-w-full sm:w-full px-2 ${stepCompletion.photos && 'steps-completed'} text-body-small text-left flex items-center justify-between gap-2 ${activeTab === 'photos' ? 'bg-[#F1F1F8] font-medium text-mono-100' : 'text-mono-80'}`}
        tabIndex={0}
        // aria-pressed={activeTab === 'photos'}
      >
        2 &nbsp; Photos
        {stepCompletion.photos && (
          <span className="mark-completion">
            <CheckmarkBlack />
          </span>
        )}
      </button>
      <button
        // onClick={() => setActiveTab('price')}
        className={`py-1 sm:max-w-full sm:w-full ${stepCompletion.price && 'steps-completed'} px-2 text-body-small text-left flex items-center justify-between gap-2 ${activeTab === 'price' ? 'bg-[#F1F1F8] font-medium text-mono-100' : 'text-mono-80'}`}
        tabIndex={0}
        // aria-pressed={activeTab === 'price'}
      >
        3 &nbsp; Price
        {stepCompletion.price && (
          <span className="mark-completion">
            <CheckmarkBlack />
          </span>
        )}
      </button>
    </div>
  );
};

export default TabNavigation;
