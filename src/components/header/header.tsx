import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../elements'
import {UserIcon} from '@/icons'
import TopNavList from './topNavList'
import MobileViewOffcanvas from './mobileViewOffcanvas'
import MiniCart from '../cart/miniCart'
// import NotificationAlart from './notificationAlart'
// import FavoritesAlart from './favoritesAlart'
import GlobalSearch from '../elements/search/globalSearch'
import BottomNavMegmenu from './bottomNavMegmenu'
import StickyNavMenu from './stickyNavMenu'



const Header = () => {
  return (
    <>
    <header className='header-section'>
      <div className="header-top-cont"> 
        <div className="custom-container">
        <div className="header-top-wrapper py-4 grid grid-cols-12 sm:grid-cols-6 gap-6">
             <div className="header-left-cont col-span-7 sm:col-span-4 flex items-center gap-4">
              <TopNavList />
               <MobileViewOffcanvas />
               <div className="site-brand-logo">
                <Link href="/"><Image src="/images/brand-logo-black.svg" alt="company brand logo" width={112} height={34} /></Link>
               </div>
             </div>
             <div className="header-right-cont sm:col-span-2 flex items-center gap-4 justify-end col-span-5">
               <GlobalSearch />
               <div className="post-product-btn hidden sm:hidden">
               <Button variant='primary'  onClick={() => console.log('Should not click')} className="w-full block  max-w-[105px]">Sell an item</Button>
               </div>
              <div className="user-account flex items-center sm:hidden">
                <Link href="/login"><UserIcon/></Link>
              </div>
              {/* <FavoritesAlart /> */}
              {/* <NotificationAlart /> */}
             <MiniCart />
             </div>
        </div>
      </div>
      </div>
      <div className="header-bottom-cont pt-[19px] pb-[22px] sm:hidden">
          <BottomNavMegmenu />
      </div> 
    </header>
    <StickyNavMenu />
    </>
  )
}

export default Header;
