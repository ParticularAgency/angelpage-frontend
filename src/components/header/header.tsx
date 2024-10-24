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
   const [isLoggedIn, setIsLoggedIn] = useState(true);
  const pathname = usePathname(); // Get current pathname

  // Define paths where BottomNavMegamenu should not appear
  const hideBottomNavPaths = ['/auth/login', '/auth/register'];

  // Check if current pathname is in the array
  const shouldHideBottomNav = hideBottomNavPaths.includes(pathname || "");
  const toggleLogin = () => {
    setIsLoggedIn(prevState => !prevState);
  };
  return (
    <>
    <button className="empty:hidden" onClick={toggleLogin}>
        {isLoggedIn ? '' : ''}
      </button>
      <header className='header-section'>
        <div className="header-top-cont">
          <div className="custom-container">
            <div className="header-top-wrapper py-4 grid grid-cols-12 sm:grid-cols-6 gap-6">
              <div className={`header-left-cont col-span-7 sm:col-span-4 flex items-center gap-4 ${isLoggedIn ? "md:col-span-2" : ""}`}> 
                {!isLoggedIn ? (
                <TopNavList />
                ) : ""}
                <MobileViewOffcanvas />
                <div className="site-brand-logo">
                  <Link href="/"><Image src="/images/brand-logo-black.svg" alt="company brand logo" width={112} height={34} /></Link>
                </div>
              </div>
              <div className={`header-right-cont sm:col-span-2 flex items-center gap-4 justify-end col-span-5 ${isLoggedIn ? "md:col-span-10" : ""}`}>  
                <GlobalSearch />
                {isLoggedIn ? (
                <div className="post-product-btn sm:hidden">
                  <Button variant='primary' className="w-full block max-w-[105px]">Sell an item</Button>
                </div>
                ) : ""}
                <div className="user-account flex items-center sm:hidden">
                  <Link href="/login"><UserIcon /></Link>
                </div>
                {isLoggedIn ? (
                  <>
                <FavoritesAlert />
               
                <NotificationAlert />
                </>
                 ) : ""}
                <MiniCart />
              </div>
            </div>
          </div>
        </div>
        {/* Conditionally render BottomNavMegamenu based on the pathname */}
        {!shouldHideBottomNav && (
          <div className="header-bottom-cont pt-[19px] pb-[22px] sm:hidden">
            <BottomNavMegamenu />
          </div>
        )}
      </header>
      <StickyNavMenu />
    </>
  );
};

export default Header;
