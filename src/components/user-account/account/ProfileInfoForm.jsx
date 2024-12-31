'use client';
import React, { useState, useEffect } from 'react';
import { EditIcon, SaveIcon } from '@/icons';
import { Input } from '@/components/elements';
import { fetchUserData } from '@utils/api';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const ProfileInfoForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    dateBirth: '',
  });

  const { data: session, status } = useSession() || {};

  // Fetch user data on mount if session is authenticated
  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated' && session?.token) {
        const data = await fetchUserData(session.token);
        if (data) {
          setPersonalInfo({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            dateBirth: data.dateBirth || '',
          });
        } else {
          console.error('Failed to fetch user data');
        }
      }
    };
    fetchData();
  }, [session, status]);

  // Handle input changes
  const handleChange = e => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const handleSave = async () => {
    console.log('Saving user data:', personalInfo);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
        {
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          dateBirth: personalInfo.dateBirth,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        console.log('User info updated successfully');
        setIsEditing(false);
      } else {
        console.error('Failed to update user info:', response.data);
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      console.error('Response data:', error); // Log the server's response
    }
  };

  // Toggle between edit and save
  const handleEditClick = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="personal-info-section pt-[23px] pb-8">
      <div className="title-line-area-section flex mb-[18px] pb-[13px] justify-between items-center gap-3 w-full">
        <p className="body-bold-regular">Personal info</p>
        <div className="btn-states-box">
          <button
            onClick={handleEditClick}
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
      <div
        className={`personal-info-details flex flex-col ${!isEditing ? 'gap-8' : 'gap-3'}`}
      >
        {!isEditing ? (
          <>
            <p className="personal-info-item body-small">
              <span className="inline-block whitespace-nowrap text-right">
                First name
              </span>{' '}
              <span className="inline-block">
                {personalInfo ? personalInfo.firstName : 'Loading...'}
              </span>
            </p>
            <p className="personal-info-item body-small">
              <span className="inline-block whitespace-nowrap text-right">
                Last name
              </span>{' '}
              <span className="inline-block">
                {personalInfo ? personalInfo.lastName : 'Loading...'}
              </span>
            </p>
            <p className="personal-info-item body-small">
              <span className="inline-block whitespace-nowrap text-right">
                Date of birth
              </span>{' '}
              <span className="inline-block">
                {personalInfo ? personalInfo.dateBirth : 'Loading...'}
              </span>
            </p>
          </>
        ) : (
          <>
            <div className="personal-info-item body-small h-full">
              <span className="whitespace-nowrap w-full text-right flex items-center justify-end">
                First name
              </span>
              <Input
                type="text"
                name="firstName"
                value={personalInfo.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="max-w-[257px] w-full h-10 body-small"
              />
            </div>
            <div className="personal-info-item body-small h-full">
              <span className="whitespace-nowrap w-full text-right flex items-center justify-end">
                Last name
              </span>
              <Input
                type="text"
                name="lastName"
                value={personalInfo.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="max-w-[257px] w-full h-10 body-small"
              />
            </div>
            <div className="personal-info-item body-small h-full">
              <span className="whitespace-nowrap w-full text-right flex items-center justify-end">
                Date of birth
              </span>
              <Input
                type="date"
                name="dateBirth"
                value={personalInfo.dateBirth}
                onChange={handleChange}
                placeholder="Date of birth"
                className="max-w-[257px] w-full h-10 body-small"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileInfoForm;
