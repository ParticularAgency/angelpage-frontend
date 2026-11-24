'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import FullScreenLoader from '@/components/common/loading/FullScreenLoader';
import axios from 'axios';
import BannerSection from './Banner';
import CharityAccountInfoMain from './account';
import DeleteAccount from './delete-account';
import CharityProductListingArea from './listing';
import { Product } from '@/types/productTypes';
import SoldItems from './sold';
import AnalyticsPage from './Analytics';
import CharityCommunityPanel from '@/components/charity/account/CharityCommunityPanel';
import CharityStaffPanel from '@/components/charity/account/CharityStaffPanel';
import AccountMessagingPanel from '@/components/account/AccountMessagingPanel';
import NotificationsCentre from '@/components/account/NotificationsCentre';
import CharityPayoutsPanel from '@/components/account/CharityPayoutsPanel';
import CharityProductIntegrationPanel from '@/components/charity/account/CharityProductIntegrationPanel';
import AffiliateDashboard from '@/components/affiliate/AffiliateDashboard';
import SocialDashboard from '@/components/social/SocialDashboard';
import GalleryPanel from '@/components/gallery/GalleryPanel';
import LogoutButton from '@/components/elements/button/LogoutButton';
import AccountTabNav, {
  type AccountTab,
  type AccountTabGroup,
} from '@/components/account/AccountTabNav';
import { getCharityTabsForSession } from '@/constants/charityPanels';

const CHARITY_TAB_GROUP_DEFS: AccountTabGroup[] = [
  {
    id: 'products',
    label: 'Products',
    tabIds: ['listings', 'product-sync', 'affiliate'],
  },
  {
    id: 'content',
    label: 'Content',
    tabIds: ['gallery', 'social', 'community'],
  },
  {
    id: 'inbox',
    label: 'Inbox',
    tabIds: ['messages', 'notifications'],
  },
];

interface ProductResponse {
  products: Product[];
}

const CharityAccount = () => {
  const { data: session } = useSession() || {};
  const role = session?.user?.role;
  const permissions = (session?.user as { permissions?: string[] })?.permissions;
  const staffRole = (session?.user as { staffRole?: string })?.staffRole;
  const visibleTabs = getCharityTabsForSession(role, permissions);
  const [activeTabId, setActiveTabId] = useState<string>('listings');
  const [productsCount, setProductsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (visibleTabs.length && !visibleTabs.some(t => t.id === activeTabId)) {
      setActiveTabId(visibleTabs[0].id);
    }
  }, [role, permissions, visibleTabs, activeTabId]);

  const fetchUserProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ProductResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/products/listings`,
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );
      setProductsCount(response.data.products.length);
    } catch (error) {
      console.error('Error fetching charity products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.token) {
      fetchUserProducts();
    }
  }, [session?.token]);

  if (!session) {
    return <p>Please log in to view your charity account.</p>;
  }
  if (loading) {
    return <FullScreenLoader />;
  }

  const charityNavTabs: AccountTab[] = [
    ...visibleTabs.map(tab => ({
      id: tab.id,
      label: tab.label,
      badge: tab.id === 'listings' ? productsCount : undefined,
    })),
    ...(role === 'CHARITY'
      ? [{ id: 'delete', label: 'Delete account' }]
      : []),
  ];

  const visibleIds = new Set(charityNavTabs.map(t => t.id));
  const charityGroups = CHARITY_TAB_GROUP_DEFS.map(g => ({
    ...g,
    tabIds: g.tabIds.filter(id => visibleIds.has(id)),
  })).filter(g => g.tabIds.length > 0);

  return (
    <div className="charity-account-main-wrapper">
      <BannerSection />
      {role === 'CHARITY_STAFF' && (
        <div className="custom-container mt-4">
          <p className="body-caption text-mono-70 rounded-lg bg-[#FCF2FF] px-4 py-2">
            Charity staff mode — listings, orders, and community only.
            {staffRole === 'MANAGER' ? ' Manager access includes analytics.' : ''}
          </p>
        </div>
      )}
      <div className="charity-storefront-wrapper-area">
        <div className="storefront-tabs-area">
          <div className="storefront-tabs-box">
            <div className="custom-container">
              <div className="custom-container pt-[51px] pb-[17px] sm:pb-0 sm:pt-8">
                <AccountTabNav
                  tabs={charityNavTabs}
                  groups={charityGroups}
                  activeTabId={activeTabId}
                  onTabChange={setActiveTabId}
                  trailing={<LogoutButton />}
                />
              </div>
            </div>
          </div>

          <div className="charity-account-tabs-cont-area pb-20">
            <div className="custom-container">
              <ul className="tabs-content-area">
                {activeTabId === 'analytics' && (
                  <li className="tabs-cont-item">
                    <AnalyticsPage />
                  </li>
                )}
                {activeTabId === 'account' && (
                  <li className="tabs-cont-item">
                    <CharityAccountInfoMain />
                  </li>
                )}
                {activeTabId === 'listings' && (
                  <li className="tabs-cont-item">
                    <CharityProductListingArea />
                  </li>
                )}
                {activeTabId === 'product-sync' && (
                  <li className="tabs-cont-item">
                    <CharityProductIntegrationPanel />
                  </li>
                )}
                {activeTabId === 'affiliate' && (
                  <li className="tabs-cont-item">
                    <AffiliateDashboard />
                  </li>
                )}
                {activeTabId === 'gallery' && (
                  <li className="tabs-cont-item">
                    <GalleryPanel />
                  </li>
                )}
                {activeTabId === 'social' && (
                  <li className="tabs-cont-item">
                    <SocialDashboard />
                  </li>
                )}
                {activeTabId === 'sold' && (
                  <li className="tabs-cont-item">
                    <SoldItems />
                  </li>
                )}
                {activeTabId === 'messages' && (
                  <li className="tabs-cont-item">
                    <AccountMessagingPanel />
                  </li>
                )}
                {activeTabId === 'notifications' && (
                  <li className="tabs-cont-item">
                    <NotificationsCentre />
                  </li>
                )}
                {activeTabId === 'payouts' && (
                  <li className="tabs-cont-item">
                    <CharityPayoutsPanel />
                  </li>
                )}
                {activeTabId === 'community' && (
                  <li className="tabs-cont-item">
                    <CharityCommunityPanel />
                  </li>
                )}
                {activeTabId === 'team' && (
                  <li className="tabs-cont-item">
                    <CharityStaffPanel />
                  </li>
                )}
                {activeTabId === 'delete' && (
                  <li className="tabs-cont-item">
                    <DeleteAccount />
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharityAccount;
