'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import axios from 'axios';
import { EditIcon, SaveIcon } from '@/icons';
import { fetchCharityData } from '@utils/api';



const ProfileImageSection  = () => {
  const { data: session, status } = useSession() || {};
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [image, setImage] = useState(
    '/images/icons/elisp-profile-default-img.svg'
  );
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated' && session?.token) {
        try {
          const data = await fetchCharityData(session.token);
          if (data) {
            setUserData(data);
            setImage(
              data.profileImage || '/images/icons/elisp-profile-default-img.svg'
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

  const handleImageChange = (e) => {
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
    formData.append('profileImage', file);

    try {
      const response = await axios.put(
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
      setImage(response.data.user.profileImage);
      setIsEditing(false);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="profile-img-section pt-[23px] pb-8">
      <div className="title-line-area-section flex mb-[31px] pb-[13px] justify-between items-center gap-3 w-full">
        <p className="body-bold-regular">Profile image</p>
        <div className="btn-states-box">
          <button
            onClick={isEditing ? handleSave : () => setIsEditing(!isEditing)}
            className="states-btn body-small flex items-center gap-2 text-primary-color-100"
          >
            {isEditing ? (
              <>
                Save <SaveIcon />
              </>
            ) : (
              <>
                Edit <EditIcon />
              </>
            )}
          </button>
        </div>
      </div>
      <div className="image-display">
        <Image
          src={image}
          alt="Profile"
          className="w-10 h-10 object-cover rounded-full object-center"
          width={40}
          height={40}
        />
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-8"
          />
        )}
        {!isEditing && !userData?.profileImage && (
          <p className="mt-6 body-small text-mono-100">No image uploaded</p>
        )}
      </div>
    </div>
  );
};

export default ProfileImageSection;
