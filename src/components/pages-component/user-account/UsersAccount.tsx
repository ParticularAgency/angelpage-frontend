'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import FullScreenLoader from '@/components/common/loading/FullScreenLoader';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import BannerSection from './Banner';
import DeleteAccount from './delete-account';
import { Product } from '@/types/productTypes';
import AnalyticsPage from './Analytics';
import UsersAccountInfoMain from './Account';
import UsersProductListingArea from './listing';
import SoldItemsPage from './sold';
import BoughtItemsPage from './bought';
import LogoutButton from '@/components/elements/button/LogoutButton';
import AccountMessagingPanel from '@/components/account/AccountMessagingPanel';
import NotificationsCentre from '@/components/account/NotificationsCentre';
import UserEarningsPanel from '@/components/account/UserEarningsPanel';
import AffiliateDashboard from '@/components/affiliate/AffiliateDashboard';
import SocialDashboard from '@/components/social/SocialDashboard';
import GalleryPanel from '@/components/gallery/GalleryPanel';
import AccountTabNav, {
  type AccountTab,
  type AccountTabGroup,
} from '@/components/account/AccountTabNav';

interface ProductResponse {
  products: Product[];
}

const USER_TABS: AccountTab[] = [
  { id: 'analytics', label: 'Analytics' },
  { id: 'account', label: 'Account' },
  { id: 'listings', label: 'Listings' },
  { id: 'affiliate', label: 'Affiliate' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'social', label: 'Social' },
  { id: 'sold', label: 'Sold' },
  { id: 'bought', label: 'Bought' },
  { id: 'messages', label: 'Messages' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'earnings', label: 'Earnings' },
  { id: 'delete', label: 'Delete account' },
];

const USER_TAB_GROUPS: AccountTabGroup[] = [
  {
    id: 'selling',
    label: 'Selling',
    tabIds: ['listings', 'affiliate', 'sold', 'bought', 'earnings'],
  },
  {
    id: 'content',
    label: 'Content',
    tabIds: ['gallery', 'social'],
  },
  {
    id: 'inbox',
    label: 'Inbox',
    tabIds: ['messages', 'notifications'],
  },
];

const UsersAccount = () => {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams?.get('tab');
  const initialTab =
    tabFromUrl && USER_TABS.some(t => t.id === tabFromUrl)
      ? tabFromUrl
      : 'analytics';
  const [activeTabId, setActiveTabId] = useState(initialTab);
  const { data: session } = useSession() || {};
  const [productsCount, setProductsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (tabFromUrl && USER_TABS.some(t => t.id === tabFromUrl)) {
      setActiveTabId(tabFromUrl);
    }
  }, [tabFromUrl]);

  const fetchUserProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ProductResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/products/listings`,
        {
          params: { role: 'USER' },
          headers: { Authorization: `Bearer ${session?.token}` },
        }
      );
      setProductsCount(response.data.products.length);
    } catch (error) {
      console.error('Error fetching user products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.token) fetchUserProducts();
  }, [session?.token]);

  if (!session) {
    return <p>Please log in to view your account listing products.</p>;
  }
  if (loading) {
    return <FullScreenLoader />;
  }

  const tabsWithBadges: AccountTab[] = USER_TABS.map(tab =>
    tab.id === 'listings' ? { ...tab, badge: productsCount } : tab,
  );

  return (
    <div className="charity-account-main-wrapper">
      <BannerSection />
      <div className="charity-storefront-wrapper-area">
        <div className="storefront-tabs-area">
          <div className="storefront-tabs-box">
            <div className="custom-container">
              <div className="custom-container pt-[51px] pb-[17px] sm:pb-0 sm:pt-8">
                <AccountTabNav
                  tabs={tabsWithBadges}
                  groups={USER_TAB_GROUPS}
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
                  <li className="tabs-cont-item"><AnalyticsPage /></li>
                )}
                {activeTabId === 'account' && (
                  <li className="tabs-cont-item"><UsersAccountInfoMain /></li>
                )}
                {activeTabId === 'listings' && (
                  <li className="tabs-cont-item"><UsersProductListingArea /></li>
                )}
                {activeTabId === 'affiliate' && (
                  <li className="tabs-cont-item"><AffiliateDashboard /></li>
                )}
                {activeTabId === 'gallery' && (
                  <li className="tabs-cont-item"><GalleryPanel /></li>
                )}
                {activeTabId === 'social' && (
                  <li className="tabs-cont-item"><SocialDashboard /></li>
                )}
                {activeTabId === 'sold' && (
                  <li className="tabs-cont-item"><SoldItemsPage /></li>
                )}
                {activeTabId === 'bought' && (
                  <li className="tabs-cont-item"><BoughtItemsPage /></li>
                )}
                {activeTabId === 'messages' && (
                  <li className="tabs-cont-item"><AccountMessagingPanel /></li>
                )}
                {activeTabId === 'notifications' && (
                  <li className="tabs-cont-item"><NotificationsCentre /></li>
                )}
                {activeTabId === 'earnings' && (
                  <li className="tabs-cont-item"><UserEarningsPanel /></li>
                )}
                {activeTabId === 'delete' && (
                  <li className="tabs-cont-item"><DeleteAccount /></li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersAccount;
