'use client';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from '../elements';
import { UserIcon } from '@/icons';
import TopNavList from './topNavList';
import MobileViewOffcanvas from './mobileViewOffcanvas';
import MiniCart from '../cart/miniCart';
import FavoritesAlert from './favoritesAlert';
import GlobalSearch from '../elements/search/globalSearch';
import BottomNavMegamenu from './bottomNavMegamenu';
import StickyNavMenu from './stickyNavMenu';
import NotificationButton from './NotificationButton';
import NotificationDropdown from './NotificationDropdown';
import { useSession} from 'next-auth/react';

const Header = () => {
  const { data: session, status } = useSession() || {};

  // Log session details for debugging
  console.log('Session:', session);
  console.log('Session Status:', status);


  const pathname = usePathname();
const userId = session?.user?.id;
const userRole = session?.user?.role;
  // Define paths where BottomNavMegamenu should not appear
  const hideBottomNavPaths = ['/auth/login', '/auth/register'];

  // Check if current pathname is in the array
  const shouldHideBottomNav = hideBottomNavPaths.includes(pathname || '');

  // Check if current page is '/product/post-product'
  const isPostProductPage = pathname === '/product/post-product';
  const isCheckoutPage = pathname === '/checkout';
  const isTempLogin = pathname === '/internal-home';

   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };
   const accountPath = session
     ? `/${userRole?.toLowerCase()}/account/${userId}`
     : '/auth/login';
  return (
    <>
      {isTempLogin ? (
        <>
          <header
            className={`${isPostProductPage || isCheckoutPage ? 'bg-mono-100' : ''} header-section relative z-[9999]`}
          >
            <div className="header-top-cont relative">
              <div className="custom-container">
                <div className="header-top-wrapper py-4 grid grid-cols-12 sm:grid-cols-6 gap-6">
                  <div
                    className={`header-left-cont col-span-7 sm:col-span-4 flex items-center gap-4 ${session ? 'md:col-span-2' : ''}`}
                  >
                    {!isTempLogin && <TopNavList />}
                    {!isCheckoutPage && <MobileViewOffcanvas />}

                    <div className="site-brand-logo mr-auto sm:mr-[-4px]">
                      <Link href="/">
                        <Image
                          src={`${isPostProductPage || isCheckoutPage ? '/images/brand-logo-white.svg' : '/images/brand-logo-black.svg'}`}
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
                        <GlobalSearch />
                        {isTempLogin && (
                          <div className="post-product-btn sm:hidden">
                            <Link href="/product/post-product/">
                              <Button
                                variant="primary"
                                className="w-full block max-w-[105px]"
                              >
                                Sell an item
                              </Button>
                            </Link>
                          </div>
                        )}
                        <div className="user-account flex items-center sm:hidden">
                          <Link href={accountPath}>
                            <UserIcon />
                          </Link>
                        </div>
                        {isTempLogin && (
                          <>
                            <FavoritesAlert />

                            <div className="notification-dropdown-area relative sm:static">
                              <NotificationButton
                                notificationBtnClass="sm:!hidden"
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
                  </div>
                </div>
              </div>
            </div>

            {!shouldHideBottomNav && !isPostProductPage && !isCheckoutPage && (
              <div className="header-bottom-cont pt-[19px] pb-[22px] sm:hidden">
                <BottomNavMegamenu />
              </div>
            )}
          </header>
        </>
      ) : (
        <>
          <header
            className={`${isPostProductPage || isCheckoutPage ? 'bg-mono-100' : ''} header-section`}
          >
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
                      <Link href="/">
                        <Image
                          src={`${isPostProductPage || isCheckoutPage ? '/images/brand-logo-white.svg' : '/images/brand-logo-black.svg'}`}
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
                        <GlobalSearch />
                        {!shouldHideBottomNav && session ? (
                          <div className="post-product-btn sm:hidden">
                            <Button
                              variant="primary"
                              className="w-full block max-w-[105px]"
                            >
                              Sell an item
                            </Button>
                          </div>
                        ) : (
                          ''
                        )}
                        <div className="user-account flex items-center sm:hidden">
                          <Link href={accountPath}>
                            <UserIcon />
                          </Link>
                        </div>
                        {!shouldHideBottomNav && session ? (
                          <>
                            <FavoritesAlert />

                            <div className="notification-dropdown-area relative sm:static">
                              <NotificationButton
                                notificationBtnClass="sm:!hidden"
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
                          <p className="body-bold-small !text-mono-0">
                            Secure checkout
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {!shouldHideBottomNav && !isPostProductPage && !isCheckoutPage && (
              <div className="header-bottom-cont pt-[19px] pb-[22px] sm:hidden">
                <BottomNavMegamenu />
              </div>
            )}
          </header>
        </>
      )}

      <StickyNavMenu session={{ session }} toggleDropdown={toggleDropdown} />
    </>
  );
};

export default Header;
