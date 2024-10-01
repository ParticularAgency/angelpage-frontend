import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FavoriteIcon, NotificationIcon, UserIcon} from '@/icons'
const StickyNavMenu = () => {
  return (
    <div className="sticky-mobilenav-elements hidden sm:block z-[999]  px-4 pt-[13px] pb-3 fixed bottom-0 w-full bg-mono-0">
      <ul className="sticky-mobilenav-items flex items-end justify-between gap-4">
        <li className="sticky-mobilenav-list">
          <Link href="/how-it-works" className='text-center flex items-center justify-center flex-col gap-[13px]'>
            <div className="icons-box"><Image src="/images/Search-default-icon.svg" alt="search icon" width={24} height={24} /></div>
            <p className="link-title font-secondary font-normal text-center text-mono-100 text-body-small leading-[150%]">How it works</p>
          </Link>
        </li>
         <li className="sticky-mobilenav-list">
          <Link href="/find-charities" className='text-center flex items-center justify-center flex-col gap-[13px]'>
            <div className="icons-box"><Image src="/images/group-user-icon.svg" alt="search icon" width={24} height={24} /></div>
            <p className="link-title font-secondary font-normal text-center text-mono-100 text-body-small leading-[150%]">Charities</p>
          </Link>
        </li>
                 <li className="sticky-mobilenav-list hidden">
          <Link href="/" className='text-center flex items-center justify-center flex-col gap-[13px]'>
            <div className="icons-box"><NotificationIcon /></div>
            <p className="link-title font-secondary font-normal text-center text-mono-100 text-body-small leading-[150%]">Notification</p>
          </Link>
        </li>
                 <li className="sticky-mobilenav-list hidden">
          <Link href="/" className='text-center flex items-center justify-center flex-col gap-[13px]'>
            <div className="icons-box"><FavoriteIcon /></div>
            <p className="link-title font-secondary font-normal text-center text-mono-100 text-body-small leading-[150%]">Favourites</p>
          </Link>
        </li>
         <li className="sticky-mobilenav-list">
          <Link href="/post-product" className='text-center flex items-center justify-center flex-col gap-[13px]'>
            <div className="icons-box"><Image src="/images/plus-post-product-icon.svg" alt="search icon" width={24} height={24} /></div>
            <p className="link-title font-secondary font-normal text-center text-mono-100 text-body-small leading-[150%]">Sell now</p>
          </Link>
        </li>
         <li className="sticky-mobilenav-list">
          <Link href="/login" className='text-center flex items-center justify-center flex-col gap-[13px]'>
            <div className="icons-box"><UserIcon /></div>
            <p className="link-title font-secondary font-normal text-center text-mono-100 text-body-small leading-[150%]">Account</p>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default StickyNavMenu
