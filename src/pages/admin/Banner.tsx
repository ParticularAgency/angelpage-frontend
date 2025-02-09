'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchAdminData, fetchLiveProducts } from '@utils/api';
import { useSession } from 'next-auth/react';

interface AdminProfile {
  verified: boolean;
  profileCompleted: boolean;
  firstName?: string;
  userName?: string;
  profileImage?: string;
}
interface BannerSectionProps {
  soldItemsCount: number;
  loading: boolean;
}
const BannerSection: React.FC<BannerSectionProps> = ({
  soldItemsCount,
  loading,
}) => {
  const { data: session, status } = useSession() || {};
  const [adminData, setAdminData] = useState<AdminProfile | null>(null);
  const [liveProductsCount, setLiveProductsCount] = useState<number>(0);

  // Fetch admin data
  const fetchData = async () => {
    if (status === 'authenticated' && session?.token) {
      try {
        const data = await fetchAdminData(session.token);
        setAdminData(data as AdminProfile);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      }
    }
  };

  // Fetch live products count
  const fetchLiveProductsData = async () => {
    if (session?.token) {
      try {
        const response = await fetchLiveProducts(session.token);
        if (response && response.products) {
          const liveProducts = response.products.filter(
            (product: { status: string }) => product.status === 'LIVE'
          );
          setLiveProductsCount(liveProducts.length);
        }
      } catch (error) {
        console.error('Failed to fetch live products:', error);
      }
    }
  };

  useEffect(() => {
    fetchLiveProductsData();
    fetchData();
  }, [session, status]);

  return (
    <section className="users-account-banner-section relative pt-0 pb-[50px] sm:pb-9">
      <div className="custom-container">
        <div className="users-account-banner-wrapper pt-10 flex flex-col gap-2 items-start gap-8">
          <div className="users-account-left-cont flex items-center gap-4">
            {!loading && adminData ? (
              <Image
                src={
                  adminData.profileImage ||
                  '/images/icons/elisp-profile-default-img.svg'
                }
                alt="user profile image"
                className="rounded-full w-10 h-10 object-cover"
                width={40}
                height={40}
              />
            ) : (
              <div className="skeleton bg-mono-40 h-10 w-10 shrink-0 rounded-full"></div>
            )}
            <div className="users-info-cont">
              <h1 className="h5 font-primary user-profile-name whitespace-nowrap text-mono-100 mb-[2px]">
                {!loading && adminData ? (
                  <>{adminData?.firstName || 'Unknown'}</>
                ) : (
                  <div className="skeleton bg-mono-40 h-3 w-[120px] shrink-0 rounded-full"></div>
                )}
              </h1>
              <p className="user-username body-small">
                {!loading && adminData ? (
                  <> {adminData?.userName || 'Unknown'}</>
                ) : (
                  <span className="skeleton bg-mono-40 h-3 w-[120px] block rounded-full"></span>
                )}
              </p>
            </div>
          </div>
          <div className="users-account-right-cont flex flex-col">
            <ul className="list-off-site-info flex items-center gap-3">
              <li className="body-small text-mono-80 font-secondary font-normal leading-[150%]">
                <span className="body-small text-mono-80 font-secondary leading-[150%] font-bold">
                  {liveProductsCount}
                </span>{' '}
                total items for sale on platform
              </li>
              <li className="body-small text-mono-80 font-secondary font-normal leading-[150%]">
                <span className="body-small text-mono-80 font-secondary leading-[150%] font-bold">
                  {soldItemsCount}
                </span>{' '}
                items sold on platform
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
