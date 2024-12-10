'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import axios from 'axios';
import { fetchCharityData, fetchCharityProfileData } from '@utils/api';
import { useRouter } from 'next/navigation';
import { Button, ProgressBar } from '@/components/elements';
import ToastNotification, {
  ToastService,
} from '@/components/elements/notifications/ToastService'; 

// Define the structure of the expected API response
interface UserProfileResponse {
  user: {
    charityBannerImage: string;
  };
}

// interface UserData {
//   charityBannerImage?: string; 
// }
const BannerSection = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [image, setImage] = useState<string>(
    '/images/charity-storefront/charity-banner-img1.png'
  );
  const [file, setFile] = useState<File | null>(null);
  // Log session details for debugging
  console.log('Session:', session);
  console.log('Session Status:', status);
  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated' && session?.token) {
        try {
          const data = await fetchCharityData(session.token);
          if (data) {
            setUserData(data);
            setImage(
              data.charityBannerImage ||
                '/images/charity-storefront/charity-banner-img1.png'
            );
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchData();
  }, [session, status]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async () => {
    if (!file) {
      alert('Please select an image to upload');
      return;
    }

    const formData = new FormData();
    formData.append('charityBannerImage', file);

    try {
      const response = await axios.put<UserProfileResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/charity/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Update the displayed image with the new profile image URL
      setImage(response.data.user.charityBannerImage);
      setIsEditing(false);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (status === 'authenticated' && session?.user?.email) {
        try {
          setLoading(true);
          const response = await fetchCharityProfileData(session.user.email);
          if (!response) {
            ToastService.error('Failed to load profile data.');
            return;
          }
          const { user, profileCompletionPercentage } = response;
          setProfileData(user);
          setProgress(profileCompletionPercentage);
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
  }, [session, status]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!profileData) {
    return <p>Failed to load profile data.</p>;
  }
  return (
    <section className="charity-account-banner-section bg-mono-100 sm:bg-transparent sm:mt-2">
      <div className="custom-container-full laptop-m:pl-6 sm:px-3">
        {!profileData.verified || !profileData.profileCompleted && (
          <div className="profile-status-area bg-mono-0 pb-2">
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
                <p className="text-success text-center pt-3 mb-2 body-small">
                  Your profile is 100% complete!
                </p>
              ) : (
                <div className="mb-6 pt-4">
                  <p className="text-mono-100 mb-2 text-center body-small">
                    Complete your profile to 100%.
                  </p>
                  <p className="w-full py-0 mb-3 mt-0 body-small text-center">
                    Pleas select account tab and complete your profile
                  </p>
                  <ProgressBar
                    progress={progress}
                    className="max-w-[650px] mx-auto w-full h-2 rounded-full"
                  />
                </div>
              )}
            </div>
          </div>
        )}
        <div className="charity-account-banner-wrapper grid grid-cols-12 gap-2 sm:block sm:h-[320px] sm:relative sm:bg-mono-100">
          <div className="col-span-5 w-full pr-[57px] laptop-x:pr-[103px] laptop-m:pr-14 py-[42px] flex flex-col justify-end  sm:absolute sm:z-[999] bottom-0 left-0 sm:bg-mono-100 sm:pb-6 sm:pt-5 sm:px-6">
            <div className="charity-account-banner-cont max-w-[385px] ml-auto">
              {userData ? (
                <Image
                  src={userData.profileImage || '/images/icons/charity-img.png'}
                  className="w-10 h-10 object-cover mb-2 sm:mb-1 sm:w-8 sm:h-8"
                  alt="charity-account charity logo image"
                  width={40}
                  height={40}
                />
              ) : (
                <span className="skeleton bg-mono-40 h-10 w-10 rounded-full"></span>
              )}
              <h1 className="h3 charity-account-banner-tittle !text-mono-0">
                {userData ? (
                  userData.charityName || 'Pleas add your charity name'
                ) : (
                  <span className="skeleton bg-mono-40 h-2 w-20"></span>
                )}
              </h1>
              <div className="charity-insight-info flex items-center gap-4 mt-2 sm:mt-1">
                <p className="available-product-total-number body-small !text-mono-0">
                  24 items for sale
                </p>
                <p className="available-product-total-number body-small !text-mono-0">
                  24 items sold
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-7 w-full">
            <div className="charity-account-banner-modal-img bg-mono-40 w-full h-[387px] sm:h-[320px] relative">
              <div className="chang-image-btn-box absolute flex items-center gap-2  left-4 bottom-4 sm:top-4">
                {isEditing && (
                  <Button
                    variant="primary"
                    className="change-storefront-img relative"
                  >
                    Upload image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mt-0 w-full opacity-0 cursor-pointer !h-10 absolute left-0 bottom-0"
                    />
                  </Button>
                )}
                <Button
                  onClick={
                    isEditing ? handleSave : () => setIsEditing(!isEditing)
                  }
                  variant="primary"
                  className="change-storefront-img relative"
                >
                  {isEditing ? 'Confirmed save' : 'Change storefront image'}
                </Button>
              </div>
              <Image
                src={image}
                className="w-full h-full object-cover object-top"
                alt="charity-account charity model image"
                width={831}
                height={387}
              />
            </div>
          </div>
        </div>
        <ToastNotification />
      </div>
    </section>
  );
};

export default BannerSection;