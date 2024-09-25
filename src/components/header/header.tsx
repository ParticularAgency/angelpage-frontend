import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../elements'
import { UserIcon ,	FavoriteIcon, NotificationIcon, CartIcon,CloseIcon} from '@/icons'




const Header = () => {
  return (
    <header className='header-section'>
      <div className="header-top-cont">
        <div className="custom-container">
        <div className="header-top-wrapper py-4 grid grid-cols-12 sm:grid-cols-6 gap-6">
             <div className="header-left-cont col-span-7 sm:col-span-4 flex items-center gap-4">
               <ul className="top-nav-list mr-auto sm:hidden flex items-center gap-4 justify-between max-w-[349px] w-full">
                <li className="top-nav-item"><Link className='text-mono-90 text-body-eyebrow-small font-medium leading-[150%] uppercase tracking-[.5px] font-secondary' href="/">How it works</Link></li>
                <li className="top-nav-item"><Link className='text-mono-90 text-body-eyebrow-small font-medium leading-[150%] uppercase tracking-[.5px] font-secondary' href="/">Find a Charity</Link></li>
                <li className="top-nav-item"><Link className='text-mono-90 text-body-eyebrow-small font-medium leading-[150%] uppercase tracking-[.5px] font-secondary' href="/">Contact Us</Link></li>
               </ul>
               <div className="mobile-view-offcanvas hidden sm:block sm:mr-auto">
               <div className="drawer drawer-start">
                <input id="my-drawer-mobile-menu" type="checkbox" className="drawer-toggle" /> 
                <div className="drawer-content">
                  <label htmlFor="my-drawer-mobile-menu" className="drawer-button btn !bg-transparent !p-0 !border-none"><Image src="/images/header-trigger.svg" alt='header burger icon' width={24} height={24} /></label>
                </div>
                <div className="drawer-side">
                  <label htmlFor="my-drawer-mobile-menu" aria-label="close sidebar" className="drawer-overlay"></label>
                  <div className="menu offcanvas-main-wrapper bg-mono-0 text-base-content min-h-full w-80 px-6 pb-8 pt-4">
                    <div className="offcanvas-head flex justify-between pb-5 pt-4 text-right">
                      <div className=""></div>
                      <div className="site-brand-logo">
                <Link href="/"><Image src="/images/brand-logo-black.svg" alt="company brand logo" width={112} height={34} /></Link>
               </div>
                         <label htmlFor="my-drawer-mobile-menu" aria-label="close sidebar" className="close-btn w-8 h-8 flex items-center justify-center cursor-pointer"><CloseIcon /></label>
                    </div>
                   <div className="offcanvas-main min-h-full">
                       <div className="cart-canvas-area min-h-full">
                        <div className="empty-cart-massage">
                          <p className='font-secondary font-medium text-body-caption text-center text-mono-100'>navigation emty list</p>
                        </div>
                       </div>
                   </div>
                  </div>
                </div>
              </div>
             </div>
               <div className="site-brand-logo">
                <Link href="/"><Image src="/images/brand-logo-black.svg" alt="company brand logo" width={112} height={34} /></Link>
               </div>
             </div>
             <div className="header-right-cont sm:col-span-2 flex items-center gap-4 justify-end col-span-5">
               <div className="global-search-bar sm:hidden w-full  max-w-[244px]">
                <form action="get" className="global-search-form w-full">
                  <div className="global-search-group-field relative w-full">
                    <input id='searchid1' type="search" className="search-input-filed h-10 w-full placeholder:text-primary-color-100 !rounded-[24px] outline-none text-body-form font-normal bg-primary-color-70 pr-2 pl-8 py-[11.5px] text-primary-color-100 leading-[150%] font-secondary" placeholder='Search' />
                    <label htmlFor="searchid1" className='searchbtn absolute top-[14px] left-3'>
                        <Image src="/images/Search-primary.svg" alt='search icon' width={13} height={13} />
                    </label>
                  </div>
                </form>
               </div>
               <div className="post-product-btn sm:hidden hidden">
               <Button variant='primary'  onClick={() => console.log('Should not click')} className="w-full block  max-w-[105px]">Sell an item</Button>
               </div>
              <div className="user-account flex items-center sm:hidden">
                <Link href="/login"><UserIcon/></Link>
              </div>
              <div className="user-saveitem items-center sm:hidden hidden">
                <Link href="/favorite"><FavoriteIcon/></Link>
              </div>
                 <div className="notification-alart-box hidden items-center">
                <button className="alart-btn" onClick={() => console.log('Should not click')}><NotificationIcon/></button>
                <div className="alart-dropdown-screen"></div>
              </div>
              <div className="cart-box flex items-center"> 
                <div className="mini-cart-offcanvas">
                <div className="drawer drawer-end">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" /> 
                <div className="drawer-content">
                  <label htmlFor="my-drawer-4" className="drawer-button btn !bg-transparent !p-0 !border-none"><CartIcon/></label>
                </div>
                <div className="drawer-side">
                  <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                  <div className="menu offcanvas-main-wrapper bg-mono-0 text-base-content min-h-full w-80 px-6 pb-8 pt-0">
                    <div className="offcanvas-head flex justify-end pb-5 pt-4 text-right">
                         <label htmlFor="my-drawer-4" aria-label="close sidebar" className="close-btn w-8 h-8 flex items-center justify-center cursor-pointer"><CloseIcon /></label>
                    </div>
                   <div className="offcanvas-main min-h-full my-auto">
                       <div className="cart-canvas-area min-h-full">
                        <div className="empty-cart-massage">
                          <p className='font-secondary font-medium text-body-caption text-center text-mono-100'>Cart is empty</p>
                        </div>
                       </div>
                   </div>
                  </div>
                </div>
              </div> 
              </div>
              </div>
             </div>
        </div>
      </div>
      </div>
      <div className="header-bottom-cont pt-[19px] pb-[22px] sm:hidden">
        <div className="custom-container">
        <nav className="header-bottom-navbar">
          <ul className="navbar-nav-list flex items-center flex-wrap gap-10">
             <li className="navbar-nav-items"><Link className='text-mono-90 text-body-eyebrow-small font-normal leading-[150%] uppercase tracking-[.5px] font-secondary' href="/">Women</Link></li>
             <li className="navbar-nav-items"><Link className='text-mono-90 text-body-eyebrow-small font-normal leading-[150%] uppercase tracking-[.5px] font-secondary' href="/">Men</Link></li>
             <li className="navbar-nav-items"><Link className='text-mono-90 text-body-eyebrow-small font-normal leading-[150%] uppercase tracking-[.5px] font-secondary' href="/">Children</Link></li>
             <li className="navbar-nav-items"><Link className='text-mono-90 text-body-eyebrow-small font-normal leading-[150%] uppercase tracking-[.5px] font-secondary' href="/">Shoes</Link></li>
             <li className="navbar-nav-items"><Link className='text-mono-90 text-body-eyebrow-small font-normal leading-[150%] uppercase tracking-[.5px] font-secondary' href="/">Bags</Link></li>
             <li className="navbar-nav-items"><Link className='text-mono-90 text-body-eyebrow-small font-normal leading-[150%] uppercase tracking-[.5px] font-secondary' href="/">Accessories & Jewellery</Link></li>
             <li className="navbar-nav-items"><Link className='text-mono-90 text-body-eyebrow-small font-normal leading-[150%] uppercase tracking-[.5px] font-secondary' href="/">Homeware</Link></li>
             <li className="navbar-nav-items"><Link className='text-mono-90 text-body-eyebrow-small font-normal leading-[150%] uppercase tracking-[.5px] font-secondary' href="/">Books</Link></li>
             <li className="navbar-nav-items"><Link className='text-mono-90 text-body-eyebrow-small font-normal leading-[150%] uppercase tracking-[.5px] font-secondary' href="/">Electronics</Link></li>
          </ul>
        </nav>
      </div>
      </div>
      
    </header>
  )
}

export default Header
