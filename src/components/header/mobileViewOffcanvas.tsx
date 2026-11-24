'use client';
import { CloseIcon } from '@/icons';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import GlobalSearchSecondary from '../elements/search/globalSearchSecondary';
import { MobileCatalogMenu } from './bottomNavMegamenu';

const MobileViewOffcanvas = () => {
  return (
    <div className="mobile-view-offcanvas hidden sm:block sm:mr-auto">
      <div className="drawer drawer-start">
        <input
          id="my-drawer-mobile-menu"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content">
          <label
            htmlFor="my-drawer-mobile-menu"
            className="drawer-button btn bg-transparent! p-0! border-none!"
          >
            <Image
              src="/images/header-trigger.svg"
              alt="header burger icon"
              width={24}
              height={24}
            />
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-mobile-menu"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="menu offcanvas-main-wrapper bg-mono-0 text-base-content min-h-full w-full px-0 pb-8 pt-0">
            <div className="offcanvas-head flex justify-between items-center pb-5 pt-4 px-4 text-right">
              <div className="divider w-8"></div>
              <div className="site-brand-logo flex items-center">
                <Link href="/">
                  <Image
                    src="/images/brand-logo-black.svg"
                    alt="company brand logo"
                    width={112}
                    height={34}
                  />
                </Link>
              </div>
              <label
                htmlFor="my-drawer-mobile-menu"
                aria-label="close sidebar"
                className="close-btn w-8 h-8 flex items-center justify-center cursor-pointer"
              >
                <CloseIcon />
              </label>
            </div>
            <div className="offcanvas-main min-h-full">
              <GlobalSearchSecondary />
              <MobileCatalogMenu />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileViewOffcanvas;
