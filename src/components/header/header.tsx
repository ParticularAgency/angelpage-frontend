'use client';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from '../elements';
import TopNavList from './topNavList';
import MobileViewOffcanvas from './mobileViewOffcanvas';
import MiniCart from '../cart/miniCart';
import FavoritesAlert from './favoritesAlert';
import GlobalSearch from '../elements/search/globalSearch';
import BottomNavMegamenu from './bottomNavMegamenu';
import StickyNavMenu from './stickyNavMenu';
import NotificationButton from './NotificationButton';
import NotificationDropdown from './NotificationDropdown';
import UserAccountMenu from './UserAccountMenu';
import { useSession } from 'next-auth/react';
import { getHomePathForRole } from '@/utils/navigationPaths';
import LanguageSwitch from './LanguageSwitch';
import { useLocale } from '@/i18n/LocaleProvider';

const Header = () => {
  const { data: session, status: _sessionStatus } = useSession();
  const { t } = useLocale();
  const homePath = getHomePathForRole(session?.user?.role);

  const pathname = usePathname();
  // Define paths where BottomNavMegamenu should not appear
  const hideBottomNavPaths = ['/auth/login', '/auth/register'];

  // Check if current pathname is in the array
  const shouldHideBottomNav = hideBottomNavPaths.includes(pathname || '');

  // Check if current page is '/product/post-product'
  const isPostProductPage = pathname === '/product/post-product';
  const isCheckoutPage =
    pathname === '/checkout' || pathname === '/checkout/confirmation/';

  const isTempLogin = pathname === '/internal-home';
  const showCategoryBar =
    !shouldHideBottomNav && !isPostProductPage && !isCheckoutPage;
  const isSellNowPage = pathname === '/product/post-product';
  const showEnvBanner = process.env.NEXT_PUBLIC_SHOW_ENV_BANNER === 'true';
  const envBannerLabel =
    process.env.NEXT_PUBLIC_ENV_BANNER_TEXT ||
    (isTempLogin ? 'Demo Mode, Launching soon!' : 'Test Mode');

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };
  return (
    <>
      {isTempLogin ? (
        <>
          <header
            className={`${isCheckoutPage ? 'bg-mono-100' : ''} header-section relative z-9999`}
          >
            {showEnvBanner && (
              <div className="notice-banner bg-mono-100 py-1">
                <p className="body-bold-small text-center text-mono-0">
                  {envBannerLabel}
                </p>
              </div>
            )}
            <div className="header-top-cont relative">
              <div className="custom-container">
                <div className="header-top-wrapper py-4 grid grid-cols-12 sm:grid-cols-6 gap-6">
                  <div
                    className={`header-left-cont col-span-7 sm:col-span-4 flex items-center gap-4 ${session ? 'md:col-span-2' : ''}`}
                  >
                    {!isTempLogin && <TopNavList />}
                    {!isCheckoutPage && <MobileViewOffcanvas />}

                    <div className="site-brand-logo mr-auto sm:mr-[-4px]">
                      <Link href={homePath}>
                        <Image
                          src={`${isCheckoutPage ? '/images/brand-logo-white.svg' : '/images/brand-logo-black.svg'}`}
                          alt="company brand logo"
                          width={112}
                          height={34}
                        />
                      </Link>
                    </div>
                  </div>
                  <div
                    className={`header-right-cont sm:col-span-2 flex items-center gap-4 justify-end col-span-5 ${session ? 'md:col-span-10' : ''}`}
                  >
                    {isTempLogin && (
                      <>
                        <GlobalSearch className="sm:hidden" />
                        {isTempLogin && (
                          <div className="post-product-btn sm:hidden">
                            <Link href="/product/post-product/">
                              <Button
                                variant="primary"
                                className="w-full block max-w-[105px]"
                              >
                                {t('nav.sell')}
                              </Button>
                            </Link>
                          </div>
                        )}
                        <UserAccountMenu className="sm:hidden" />
                        {isTempLogin && (
                          <>
                            <FavoritesAlert className="sm:hidden" />

                            <div className="notification-dropdown-area relative sm:static">
                              <NotificationButton
                                notificationBtnClass="sm:hidden!"
                                toggleDropdown={toggleDropdown}
                              />
                              {isDropdownOpen && (
                                <NotificationDropdown
                                  isDropdownOpen={isDropdownOpen}
                                  toggleDropdown={toggleDropdown}
                                />
                              )}
                            </div>
                          </>
                        )}
                        <MiniCart />
                      </>
                    )}
                    {showCategoryBar ? (
                      <div className="hidden sm:block">
                        <LanguageSwitch tone="light" />
                      </div>
                    ) : (
                      <LanguageSwitch
                        tone={
                          isCheckoutPage ? 'dark' : 'light'
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {!shouldHideBottomNav && !isPostProductPage && !isCheckoutPage && (
              <div className="header-bottom-cont pt-[15px] pb-[16px] sm:hidden">
                <BottomNavMegamenu />
              </div>
            )}
          </header>
        </>
      ) : (
        <>
          <header
            className={`${isCheckoutPage ? 'bg-mono-100' : ''} header-section`}
          >
            {showEnvBanner && (
              <div className="notice-banner bg-mono-100 py-1">
                <p className="body-bold-small text-center text-mono-0">
                  {envBannerLabel}
                </p>
              </div>
            )}
            <div className="header-top-cont relative">
              <div className="custom-container">
                <div className="header-top-wrapper py-4 grid grid-cols-12 sm:grid-cols-6 gap-6">
                  <div
                    className={`header-left-cont col-span-7 sm:col-span-4 flex items-center gap-4 ${session ? 'md:col-span-2' : ''}`}
                  >
                    {!(isCheckoutPage || session || isPostProductPage) && (
                      <TopNavList />
                    )}
                    {!isCheckoutPage && <MobileViewOffcanvas />}
                    <div className="site-brand-logo mr-auto sm:mr-[-4px]">
                      <Link href={homePath}>
                        <Image
                          src={`${isCheckoutPage ? '/images/brand-logo-white.svg' : '/images/brand-logo-black.svg'}`}
                          alt="company brand logo"
                          width={112}
                          height={34}
                        />
                      </Link>
                    </div>
                  </div>
                  <div
                    className={`header-right-cont sm:col-span-2 flex items-center gap-4 justify-end col-span-5 ${session ? 'md:col-span-10' : ''}`}
                  >
                    {!isPostProductPage && !isCheckoutPage && (
                      <>
                        <GlobalSearch className="sm:hidden" />
                        {!shouldHideBottomNav && session ? (
                          <div className="post-product-btn sm:hidden">
                            <Link href="/product/post-product/">
                              <Button
                                variant="primary"
                                className="w-full block max-w-[105px]"
                              >
                                {t('nav.sell')}
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          ''
                        )}
                        <UserAccountMenu className="sm:hidden" />
                        {!shouldHideBottomNav && session ? (
                          <>
                            <FavoritesAlert className="sm:hidden" />

                            <div className="notification-dropdown-area relative sm:static">
                              <NotificationButton
                                notificationBtnClass="sm:hidden!"
                                toggleDropdown={toggleDropdown}
                              />
                              {isDropdownOpen && (
                                <NotificationDropdown
                                  isDropdownOpen={isDropdownOpen}
                                  toggleDropdown={toggleDropdown}
                                />
                              )}
                            </div>
                          </>
                        ) : (
                          ''
                        )}
                        <MiniCart />
                      </>
                    )}
                    {isCheckoutPage && (
                      <>
                        <div className="checkout-header-right-cont flex items-center gap-4">
                          <Image
                            src="/images/icons/shield-one.svg"
                            alt="shield done icons image"
                            width={16}
                            height={18}
                          />
                          <p className="body-bold-small text-mono-0!">
                            {t('nav.secureCheckout')}
                          </p>
                        </div>
                      </>
                    )}
                    {showCategoryBar ? (
                      <div className="hidden sm:block">
                        <LanguageSwitch tone="light" />
                      </div>
                    ) : (
                      <LanguageSwitch
                        tone={
                          isCheckoutPage ? 'dark' : 'light'
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {!shouldHideBottomNav && !isPostProductPage && !isCheckoutPage && (
              <div className="header-bottom-cont pt-[15px] pb-[16px] sm:hidden">
                <BottomNavMegamenu />
              </div>
            )}
          </header>
        </>
      )}
      {isSellNowPage ? (
        ''
      ) : (
        <StickyNavMenu session={{ session }} toggleDropdown={toggleDropdown} />
      )}
    </>
  );
};

export default Header;
