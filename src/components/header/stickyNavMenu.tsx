'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import {
  // FavoriteIcon,
  // NotificationIcon,
  UserIcon,
} from '@/icons';
// import NotificationAlert from './notificationAlert';
import NotificationButton from './NotificationButton';
import FavoritesAlert from './favoritesAlert';

interface StickyNavbar {
  toggleDropdown: () => void;
  session: object;
}
const StickyNavMenu: React.FC<StickyNavbar> = ({ toggleDropdown}) => {
  const { data: session, status } = useSession();
  // Log session details for debugging
  console.log('Session:', session);
  console.log('Session Status:', status);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  const handleScroll = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY) {
        // Scrolling down
        setShowNavbar(false);
      } else {
        // Scrolling up
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY); // Update scroll position
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);
  return (
    <motion.div
      className="sticky-mobilenav-elements hidden sm:block z-[999] h-[87px]   px-4 pt-[13px] pb-3 fixed bottom-0 w-full bg-mono-0"
      initial={{ y: 100 }}
      animate={{ y: showNavbar ? 0 : 100 }}
      transition={{ type: 'spring', stiffness: 200, damping: 30 }} // Smooth transition
    >
      <ul className="sticky-mobilenav-items flex items-end justify-between gap-4">
        {!session ? (
          <>
            <li className="sticky-mobilenav-list">
              <Link
                href="/how-it-works"
                className="text-center flex items-center justify-center flex-col gap-[13px]"
              >
                <div className="icons-box">
                  <Image
                    src="/images/Search-default-icon.svg"
                    alt="search icon"
                    width={24}
                    height={24}
                  />
                </div>
                <p className="link-title font-secondary font-normal text-center text-mono-100 text-body-small xxs:text-[13px] leading-[150%]">
                  How it works
                </p>
              </Link>
            </li>
            <li className="sticky-mobilenav-list">
              <Link
                href="/find-a-charity"
                className="text-center flex items-center justify-center flex-col gap-[13px]"
              >
                <div className="icons-box">
                  <Image
                    src="/images/group-user-icon.svg"
                    alt="search icon"
                    width={24}
                    height={24}
                  />
                </div>
                <p className="link-title font-secondary font-normal text-center text-mono-100 text-body-small xxs:text-[13px] leading-[150%]">
                  Charities
                </p>
              </Link>
            </li>
            <li className="sticky-mobilenav-list">
              <Link
                href="/login"
                className="text-center flex items-center justify-center flex-col gap-[13px]"
              >
                <div className="icons-box">
                  <Image
                    src="/images/plus-post-product-icon.svg"
                    alt="search icon"
                    width={24}
                    height={24}
                  />
                </div>
                <p className="link-title font-secondary font-normal text-center text-mono-100 text-body-small xxs:text-[13px] leading-[150%]">
                  Sell now
                </p>
              </Link>
            </li>
            <li className="sticky-mobilenav-list">
              <Link
                href="/auth/register"
                className="text-center flex items-center justify-center flex-col gap-[13px]"
              >
                <div className="icons-box">
                  <UserIcon />
                </div>
                <p className="link-title font-secondary font-normal text-center text-mono-100 text-body-small xxs:text-[13px] leading-[150%]">
                  Register
                </p>
              </Link>
            </li>
          </>
        ) : (
          ''
        )}

        {session ? (
          <>
            <li className="sticky-mobilenav-list">
              <div className="text-center flex items-center justify-center flex-col gap-[13px]">
                <div className="icons-box">
                  <NotificationButton toggleDropdown={toggleDropdown} />
                </div>
                <p className="link-title font-secondary font-normal text-center text-mono-100 text-body-small xxs:text-[13px] leading-[150%]">
                  Notification
                </p>
              </div>
            </li>
            <li className="sticky-mobilenav-list">
              <div className="text-center flex items-center justify-center flex-col gap-[13px]">
                <div className="icons-box">
                  <FavoritesAlert className="sm:block" />
                </div>
                <p className="link-title font-secondary font-normal text-center text-mono-100 text-body-small xxs:text-[13px] leading-[150%]">
                  Favourites
                </p>
              </div>
            </li>
            <li className="sticky-mobilenav-list">
              <Link
                href="/product/post-product"
                className="text-center flex items-center justify-center flex-col gap-[13px]"
              >
                <div className="icons-box">
                  <Image
                    src="/images/plus-post-product-icon.svg"
                    alt="search icon"
                    width={24}
                    height={24}
                  />
                </div>
                <p className="link-title font-secondary font-normal text-center text-mono-100 text-body-small xxs:text-[13px] leading-[150%]">
                  Sell now
                </p>
              </Link>
            </li>
            <li className="sticky-mobilenav-list">
              <Link
                href={`/${userRole?.toLowerCase()}/account/${userId}`}
                className="text-center flex items-center justify-center flex-col gap-[13px]"
              >
                <div className="icons-box">
                  <UserIcon />
                </div>
                <p className="link-title font-secondary font-normal text-center text-mono-100 text-body-small xxs:text-[13px] leading-[150%]">
                  Account
                </p>
              </Link>
            </li>
          </>
        ) : (
          ''
        )}
      </ul>
    </motion.div>
  );
};

export default StickyNavMenu;
