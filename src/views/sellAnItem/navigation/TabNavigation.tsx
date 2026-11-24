'use client';
import React from 'react';

interface TabNavigationProps {
  activeTab: 'details' | 'photos' | 'price';
  setActiveTab: React.Dispatch<
    React.SetStateAction<'details' | 'photos' | 'price'>
  >;
  stepCompletion?: { details: boolean; photos: boolean; price: boolean };
  extraClass?: string;
}

const STEPS: Array<{
  id: 'details' | 'photos' | 'price';
  index: string;
  title: string;
  hint: string;
}> = [
  { id: 'details', index: '01', title: 'Details', hint: 'Item, charity, and shipping' },
  { id: 'photos', index: '02', title: 'Photos', hint: 'Show the item clearly' },
  { id: 'price', index: '03', title: 'Price', hint: 'Set the gift split' },
];

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
  stepCompletion = { details: false, photos: false, price: false },
  extraClass = '',
}) => {
  const canOpen = (id: 'details' | 'photos' | 'price') => {
    if (id === 'details') return true;
    if (id === 'photos') return stepCompletion.details || activeTab === 'photos' || activeTab === 'price';
    return stepCompletion.photos || activeTab === 'price';
  };

  return (
    <ol className={`flex flex-col gap-2 sm:flex-row sm:gap-2 ${extraClass}`}>
      {STEPS.map(step => {
        const active = activeTab === step.id;
        const done = stepCompletion[step.id] && !active;
        const open = canOpen(step.id);
        return (
          <li key={step.id} className="sm:min-w-0 sm:flex-1">
            <button
              type="button"
              disabled={!open}
              onClick={() => open && setActiveTab(step.id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition sm:flex-col sm:items-start sm:gap-1 sm:px-3 ${
                active
                  ? 'bg-[#611192] text-white'
                  : done
                    ? 'bg-[#FCF2FF] text-[#611192]'
                    : 'bg-transparent text-[#5C5560]'
              } ${open ? '' : 'cursor-not-allowed opacity-50'}`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                  active
                    ? 'bg-white text-[#611192]'
                    : done
                      ? 'bg-[#611192] text-white'
                      : 'border border-[#E6E3E7] text-[#5C5560]'
                }`}
              >
                {done ? '✓' : step.index}
              </span>
              <span>
                <span className="block text-sm font-medium">{step.title}</span>
                <span className={`mt-0.5 block text-xs sm:hidden ${active ? 'text-white/80' : 'text-[#8B888C]'}`}>
                  {step.hint}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
};

export default TabNavigation;
