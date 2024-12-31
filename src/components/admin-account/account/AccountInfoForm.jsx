'use client';
import React, { useState, useEffect } from 'react';
import { EditIcon, SaveIcon } from '@/icons';
import { Input } from '@/components/elements';
import { fetchAdminData } from '@utils/api';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const AccountInfoForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [accountInfo, setAccountInfo] = useState({
    email: '',
    AdminName: '',
    currentPassword: '',
    newPassword: '',
  });

  const { data: session, status } = useSession() || {};

  // Fetch user data on mount if session is authenticated
  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated' && session?.token) {
        try {
          const data = await fetchAdminData(session.token);
          if (data) {
            setAccountInfo({
              email: data.email || '',
              userName: data.userName || '',
              currentPassword: '',
              newPassword: '',
            });
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

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/profile`,
        {
          email: accountInfo.email,
          userName: accountInfo.userName,
          currentPassword: accountInfo.currentPassword,
          newPassword: accountInfo.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        console.log('Account info updated successfully');
        setAccountInfo(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
        }));
        setIsEditing(false);
      } else {
        console.error('Failed to update account info:', response.data);
      }
    } catch (error) {
      console.error('Error updating account info:', error);

      // Check if the error matches the structure of ErrorWithResponse
      if (error instanceof Error && error.response) {
        console.error('Response data:', error.response?.data);
      } else {
        console.error('An unknown error occurred');
      }
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setAccountInfo({ ...accountInfo, [name]: value });
  };

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
        <p className="body-bold-regular">Account info</p>
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
                Email
              </span>{' '}
              <span className="inline-block">
                {accountInfo ? accountInfo.email : 'Loading...'}
              </span>
            </p>
            <p className="personal-info-item body-small">
              <span className="inline-block whitespace-nowrap text-right">
                Username
              </span>{' '}
              <span className="inline-block">
                {accountInfo ? accountInfo.userName : 'Loading...'}
              </span>
            </p>
            <p className="personal-info-item body-small">
              <span className="inline-block whitespace-nowrap text-right">
                Password
              </span>{' '}
              <span className="inline-block">********</span>
            </p>
          </>
        ) : (
          <>
            <div className="personal-info-item body-small h-full">
              <span className="whitespace-nowrap w-full text-right flex items-center justify-end">
                Email
              </span>{' '}
              <Input
                type="text"
                name="email"
                value={accountInfo.email}
                onChange={handleChange}
                placeholder="Email"
                className="max-w-[257px] w-full h-10 body-small"
              />
            </div>
            <div className="personal-info-item body-small h-full">
              <span className="whitespace-nowrap w-full text-right flex items-center justify-end">
                Username
              </span>
              <Input
                type="text"
                name="userName"
                value={accountInfo.userName}
                onChange={handleChange}
                placeholder="Username"
                className="max-w-[257px] w-full h-10 body-small"
              />
            </div>
            <div className="personal-info-item body-small h-full">
              <span className="whitespace-nowrap w-full text-right flex items-center justify-end">
                Current Password
              </span>
              <Input
                type="password"
                name="currentPassword"
                value={accountInfo.currentPassword}
                onChange={handleChange}
                placeholder="Current Password"
                className="max-w-[257px] w-full h-10 body-small"
              />
            </div>
            <div className="personal-info-item body-small h-full">
              <span className="whitespace-nowrap w-full text-right flex items-center justify-end">
                New Password
              </span>
              <Input
                type="password"
                name="newPassword"
                value={accountInfo.newPassword}
                onChange={handleChange}
                placeholder="New Password"
                className="max-w-[257px] w-full h-10 body-small"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountInfoForm;
