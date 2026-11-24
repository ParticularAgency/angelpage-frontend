'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export type AccountTab = {
  id: string;
  label: string;
  badge?: number;
};

export type AccountTabGroup = {
  id: string;
  label: string;
  tabIds: string[];
};

interface AccountTabNavProps {
  tabs: AccountTab[];
  groups?: AccountTabGroup[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  trailing?: React.ReactNode;
}

const AccountTabNav: React.FC<AccountTabNavProps> = ({
  tabs,
  groups = [],
  activeTabId,
  onTabChange,
  trailing,
}) => {
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const groupedIds = new Set(groups.flatMap(g => g.tabIds));
  const standaloneTabs = tabs.filter(t => !groupedIds.has(t.id));

  const tabById = (id: string) => tabs.find(t => t.id === id);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenGroupId(null);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const pillClass = (active: boolean) =>
    `tabs-btn-list body-small relative whitespace-nowrap rounded-[20px] cursor-pointer transition-colors duration-200 ${
      active
        ? 'bg-[#FCF2FF] text-primary-color-100'
        : 'hover:bg-[#FCF2FF] hover:text-primary-color-100'
    }`;

  const renderBadge = (badge?: number) =>
    badge != null && badge > 0 ? (
      <span className="absolute -top-3 sm:top-0 right-[-14px] sm:-right-2 min-w-[17px] h-6 flex items-center justify-center bg-error forms-bold font-medium text-mono-0 rounded-[8px] px-1 text-[10px]">
        {badge > 99 ? '99+' : badge}
      </span>
    ) : null;

  const selectTab = (id: string) => {
    onTabChange(id);
    setOpenGroupId(null);
  };

  return (
    <div
      ref={navRef}
      className="storefront-tabs-btn-box flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 w-full"
    >
      <ul className="tabs-btn-items flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6">
        {standaloneTabs.map(tab => (
          <li key={tab.id}>
            <button
              type="button"
              className={`${pillClass(tab.id === activeTabId)} px-[17px] py-2`}
              onClick={() => selectTab(tab.id)}
            >
              {tab.label}
              {renderBadge(tab.badge)}
            </button>
          </li>
        ))}

        {groups.map(group => {
          const groupTabs = group.tabIds
            .map(id => tabById(id))
            .filter((t): t is AccountTab => !!t);
          if (!groupTabs.length) return null;

          if (groupTabs.length === 1) {
            const tab = groupTabs[0];
            return (
              <li key={group.id}>
                <button
                  type="button"
                  className={`${pillClass(tab.id === activeTabId)} px-[17px] py-2`}
                  onClick={() => selectTab(tab.id)}
                >
                  {tab.label}
                  {renderBadge(tab.badge)}
                </button>
              </li>
            );
          }

          const activeChild = groupTabs.find(t => t.id === activeTabId);
          const isGroupActive = !!activeChild;
          const isOpen = openGroupId === group.id;
          const groupBadge = groupTabs.reduce(
            (sum, t) => sum + (t.badge && t.badge > 0 ? t.badge : 0),
            0,
          );

          return (
            <li key={group.id} className="relative">
              <button
                type="button"
                className={`${pillClass(isGroupActive || isOpen)} inline-flex items-center gap-1.5 px-4 py-2 pr-3`}
                onClick={() => setOpenGroupId(isOpen ? null : group.id)}
                aria-expanded={isOpen}
                aria-haspopup="true"
              >
                {isGroupActive ? activeChild.label : group.label}
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-primary-color-100/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  strokeWidth={2}
                  aria-hidden
                />
                {!isGroupActive && groupBadge > 0 && renderBadge(groupBadge)}
                {isGroupActive &&
                  activeChild?.badge != null &&
                  activeChild.badge > 0 &&
                  renderBadge(activeChild.badge)}
              </button>

              {isOpen && (
                <div
                  className="absolute left-0 top-full z-30 mt-2 min-w-[200px] rounded-2xl border border-[#E8D4F4]/80 bg-white py-1.5 shadow-[0_8px_30px_rgba(97,17,146,0.12)] ring-1 ring-black/3"
                  role="listbox"
                >
                  <p className="px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-mono-70">
                    {group.label}
                  </p>
                  <div className="mx-3.5 mb-1 border-b border-[#E8D4F4]/60" />
                  {groupTabs.map(tab => {
                    const isActive = tab.id === activeTabId;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onClick={() => selectTab(tab.id)}
                        className={`flex w-full items-center gap-2 px-3.5 py-2.5 text-sm text-left ${
                          isActive
                            ? 'bg-[#FCF2FF] text-primary-color-100 font-medium'
                            : 'text-mono-100 hover:bg-mono-20'
                        }`}
                      >
                        {isActive ? (
                          <Check
                            className="h-4 w-4 shrink-0 text-primary-color-100"
                            strokeWidth={2.5}
                            aria-hidden
                          />
                        ) : (
                          <span className="w-4 shrink-0" aria-hidden />
                        )}
                        <span className="flex-1">{tab.label}</span>
                        {tab.badge != null && tab.badge > 0 && (
                          <span className="ml-2 rounded-full bg-error px-1.5 py-0.5 text-[10px] text-white">
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {trailing && (
        <div className="tabs-btn-list body-small whitespace-nowrap px-[17px] py-2 rounded-[20px] shrink-0 self-start">
          {trailing}
        </div>
      )}
    </div>
  );
};

export default AccountTabNav;
