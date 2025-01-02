'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button, ProgressBar } from '@/components/elements';
import { fetchUserData, fetchUserProfileData } from '@utils/api';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ToastService,
} from '@/components/elements/notifications/ToastService';

interface UserProfile {
  verified: boolean;
  profileCompleted: boolean;
  firstName?: string;
  userName?: string;
  profileImage?: string;
}

const BannerSection = () => {
  const router = useRouter();
  const { data: session, status } = useSession() || {};
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [userData, setUserData] = useState<UserProfile | null>(null);

  // Log session details for debugging
  console.log('Session:', session);
  console.log('Session Status:', status);

  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated' && session?.token) {
        const data = await fetchUserData(session.token);
        if (data) {
          setUserData(data as UserProfile);
        } else {
          console.error('Failed to fetch user data');
        }
      }
    };

    fetchData();
  }, [session, status]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (status === 'authenticated' && session?.user?.email) {
        try {
          setLoading(true);
          const response = await fetchUserProfileData(session.user.email);
          if (!response?.user) {
            ToastService.error('Failed to load profile data.');
            return;
          }
          const { user, profileCompletionPercentage } = response;
          setProfileData(user);
          setProgress(profileCompletionPercentage || 0);
        } catch (error) {
          console.error('Error fetching profile data:', error);
          ToastService.error('Failed to load profile data.');
        } finally {
          setLoading(false);
        }
      } else if (status === 'unauthenticated') {
        router.push('/auth/login');
      }
    };

    fetchProfile();
  }, [session, status, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!profileData) {
    return <p>Failed to load profile data.</p>;
  }

  return (
    <section className="users-account-banner-section relative pt-0 pb-[50px] sm:pb-9">
      <div className="profile-status-area">
        <div className="custom-container">
          {!profileData.verified && (
            <div className="email-verify-area py-2 text-center flex items-center justify-center gap-2">
              <p className="text-error body-small">
                Your email is not verified. Please verify your email.
              </p>
              <Button
                variant="accend-link"
                onClick={() => router.push('/auth/verify-email')}
                className="!underline"
              >
                Verify Email
              </Button>
            </div>
          )}

          {/* Profile Completion Progress */}
          {profileData.profileCompleted ? (
            <p className="text-success text-center pt-10 mb-0 body-small">
              Your profile is 100% complete!
            </p>
          ) : (
            <div className="mb-0 pt-10">
              <p className="text-mono-100 mb-2 text-center body-small">
                Complete your profile to 100%.
              </p>
              <p className="w-full py-0 mb-3 mt-0 body-small text-center">
                Please select the account tab and complete your profile
              </p>
              <ProgressBar
                progress={progress}
                className="max-w-[650px] mx-auto w-full h-2 rounded-full"
              />
            </div>
          )}
        </div>
      </div>
      <div className="custom-container">
        <div className="users-account-banner-wrapper pt-10 flex items-center justify-between sm:flex-col sm:items-start sm:gap-8">
          <div className="users-account-left-cont flex items-center gap-4">
            {userData ? (
              <Image
                src={
                  userData.profileImage ||
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
              <h1 className="h5 sm:text-[17px]  font-primary user-profile-name whitespace-nowrap text-mono-100 mb-[2px]">
                {userData?.firstName || 'Unknown'}
              </h1>
              <p className="user-username body-small">
                {userData?.userName || 'Unknown'}
              </p>
            </div>
          </div>
          <div className="users-account-right-cont hidden  flex-col items-end sm:items-start">
            <Button variant="primary" className="body-small ">
              Turn on holiday mode
            </Button>
            <p className="forms text-mono-100 mt-2 md:max-w-[375px]">
              In Holiday Mode, your active listings will be temporarily hidden
              in the database.
            </p>
          </div>
        </div>
       
      </div>
    </section>
  );
};

export default BannerSection;
