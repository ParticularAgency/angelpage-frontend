"use client"
import { usePathname } from "next/navigation";
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from '../elements'
import { UserIcon } from '@/icons'
import TopNavList from './topNavList'
import MobileViewOffcanvas from './mobileViewOffcanvas'
import MiniCart from '../cart/miniCart'
import NotificationAlert from './notificationAlert'
import FavoritesAlert from './favoritesAlert'
import GlobalSearch from '../elements/search/globalSearch'
import BottomNavMegamenu from './bottomNavMegamenu'
import StickyNavMenu from './stickyNavMenu'

const Header = () => {
   const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname(); 

  // Define paths where BottomNavMegamenu should not appear
  const hideBottomNavPaths = ['/auth/login', '/auth/register'];

  // Check if current pathname is in the array
  const shouldHideBottomNav = hideBottomNavPaths.includes(pathname || "");
  
  // Check if current page is '/product/post-product'
  const isPostProductPage = pathname === '/product/post-product';
  const isCheckoutPage = pathname === '/checkout';
  const isTempLogin = pathname === '/internal-home';
  const toggleLogin = () => {
    setIsLoggedIn(prevState => !prevState);
  };
  return (
    <>
    <button className="empty:hidden" onClick={toggleLogin}>
        {isLoggedIn ? '' : ''}
      </button>
      {isTempLogin ? 
      (
      <>
      <header className={`${isPostProductPage || isCheckoutPage ? ("bg-mono-100") : "" } header-section`}>
        <div className="header-top-cont">
          <div className="custom-container">
            <div className="header-top-wrapper py-4 grid grid-cols-12 sm:grid-cols-6 gap-6">
              <div className={`header-left-cont col-span-7 sm:col-span-4 flex items-center gap-4 ${isLoggedIn ? "md:col-span-2" : ""}`}> 
              {!isTempLogin &&  <TopNavList />}
                <MobileViewOffcanvas />
                <div className="site-brand-logo mr-auto">
                  <Link href="/"><Image src={`${isPostProductPage || isCheckoutPage ? ("/images/brand-logo-white.svg") : ("/images/brand-logo-black.svg")}`} alt="company brand logo" width={112} height={34} /></Link>
                </div>
              </div>
              <div className={`header-right-cont sm:col-span-2 flex items-center gap-4 justify-end col-span-5 ${isLoggedIn ? "md:col-span-10" : ""}`}>
                {isTempLogin && (
                <>
                <GlobalSearch />
                {isTempLogin && (
                <div className="post-product-btn sm:hidden">
                  <Button variant='primary' className="w-full block max-w-[105px]">Sell an item</Button>
                </div>
                ) }
                <div className="user-account flex items-center sm:hidden">
                  <Link href={`${shouldHideBottomNav && isLoggedIn ? '/user/account/1' : '/auth/login'}`}><UserIcon /></Link>
                </div>
                {isTempLogin && (
                  <>
                <FavoritesAlert />
               
                <NotificationAlert />
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
      ) : 
      (
      <>
      <header className={`${isPostProductPage || isCheckoutPage ? ("bg-mono-100") : "" } header-section`}>
        <div className="header-top-cont">
          <div className="custom-container">
            <div className="header-top-wrapper py-4 grid grid-cols-12 sm:grid-cols-6 gap-6">
              <div className={`header-left-cont col-span-7 sm:col-span-4 flex items-center gap-4 ${isLoggedIn ? "md:col-span-2" : ""}`}> 
              {!(isCheckoutPage  || isLoggedIn || isPostProductPage) && <TopNavList />}
                <MobileViewOffcanvas />
                <div className="site-brand-logo mr-auto">
                  <Link href="/"><Image src={`${isPostProductPage || isCheckoutPage ? ("/images/brand-logo-white.svg") : ("/images/brand-logo-black.svg")}`} alt="company brand logo" width={112} height={34} /></Link>
                </div>
              </div>
              <div className={`header-right-cont sm:col-span-2 flex items-center gap-4 justify-end col-span-5 ${isLoggedIn ? "md:col-span-10" : ""}`}>
                {!isPostProductPage && !isCheckoutPage &&(
                <>
                <GlobalSearch />
                {!shouldHideBottomNav && isLoggedIn ? (
                <div className="post-product-btn sm:hidden">
                  <Button variant='primary' className="w-full block max-w-[105px]">Sell an item</Button>
                </div>
                ) : ""}
                <div className="user-account flex items-center sm:hidden">
                  <Link href={`${shouldHideBottomNav && isLoggedIn ? '/user/account/1' : '/auth/login'}`}><UserIcon /></Link>
                </div>
                {!shouldHideBottomNav && isLoggedIn ? (
                  <>
                <FavoritesAlert />
               
                <NotificationAlert />
                </>
                 ) : ""}
                <MiniCart />
                
                </>
                )}
                {isCheckoutPage && (
                 <>
                 <div className="checkout-header-right-cont flex items-center gap-4">
                 <Image src="/images/icons/shield-one.svg" alt="shield done icons image" width={16} height={18} />
                  <p className="body-bold-small !text-mono-0">Secure checkout</p>
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
      )
      }
     
      <StickyNavMenu />
    </>
  );
};

export default Header;
