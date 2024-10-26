import React from 'react';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="flex flex-col w-full">
      <button
        onClick={() => setActiveTab('details')}
        className={`py-1 pl-2 text-body-small text-left ${activeTab === 'details' ? 'bg-[#F1F1F7] font-medium text-mono-100' : 'text-mono-80'}`}
      >
        1 &nbsp; Details
      </button>
      <button
        onClick={() => setActiveTab('photos')}
        className={`py-1 pl-2 text-body-small text-left ${activeTab === 'photos' ? 'bg-[#F1F1F7] font-medium text-mono-100' : 'text-mono-80'}`}
      >
        2 &nbsp; Photos
      </button>
      <button
        onClick={() => setActiveTab('price')}
        className={`py-1 pl-2 text-body-small text-left ${activeTab === 'price' ? 'bg-[#F1F1F7] font-medium text-mono-100' : 'text-mono-80'}`}
      >
        3 &nbsp; Price
      </button>
    </div>
  );
};

export default TabNavigation;
