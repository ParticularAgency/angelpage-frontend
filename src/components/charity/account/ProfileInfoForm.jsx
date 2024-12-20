import React, { useState, useEffect } from 'react';
import { EditIcon, SaveIcon } from '@/icons';
import { fetchCharityData } from '@utils/api';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/elements';


const AdminInfoForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [adminInfo, setAdminInfo] = useState({
    email: '',
    userName: '',
    currentPassword: '',
    newPassword: '',
  });

  const { data: session, status } = useSession() || {};

  // Fetch user data on mount if session is authenticated
  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated' && session?.token) {
        try {
          const data = await fetchCharityData(session.token);
          if (data) {
            setAdminInfo({
              email: data.email || '',
              userName: data?.userName || '',
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
        `${process.env.NEXT_PUBLIC_API_URL}/charity/profile`,
        {
          email: adminInfo.email,
          userName: adminInfo.userName,
          currentPassword: adminInfo.currentPassword,
          newPassword: adminInfo.newPassword,
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
        setAdminInfo(prev => ({
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
      if (error instanceof Error && (error).response) {
        console.error(
          'Response data:',
          (error).response?.data
        );
      } else {
        console.error('An unknown error occurred');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminInfo({ ...adminInfo, [name]: value });
  };

  const handleEditClick = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="admin-info-section pt-[23px] pb-8">
      <div className="title-line-area-section flex mb-[31px] pb-[13px] justify-between items-center gap-3 w-full">
        <p className="body-bold-regular">Admin Info</p>
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
        className={`admin-info-details flex flex-col items-start ${!isEditing ? 'gap-8' : 'gap-3'}`}
      >
        {!isEditing ? (
          <>
            <p className="admin-info-item w-full body-small">
              <span className="inline-block whitespace-nowrap text-right">
                Email
              </span>{' '}
              <span className="inline-block">
                {adminInfo ? (
                  adminInfo.email
                ) : (
                  <div className="skeleton bg-mono-40 h-3 w-20"></div>
                )}
              </span>
            </p>
            <p className="admin-info-item w-full body-small">
              <span className="inline-block whitespace-nowrap text-right">
                Username
              </span>{' '}
              <span className="inline-block">
                {adminInfo ? (
                  adminInfo.userName
                ) : (
                  <div className="skeleton bg-mono-40 h-3 w-20"></div>
                )}
              </span>
            </p>
            <p className="admin-info-item w-full body-small">
              <span className="inline-block whitespace-nowrap text-right">
                Password
              </span>{' '}
              <span className="inline-block">********</span>
            </p>
            {/* <Button
              variant="accend-link"
              className="underline !text-primary-color-100"
            >
              Forgot password
            </Button> */}
          </>
        ) : (
          <>
            <p
              className={`admin-info-item w-full body-small ${isEditing ? 'editing-view' : ''}`}
            >
              <span className="whitespace-nowrap text-right  flex items-center justify-end">
                Email
              </span>
              <Input
                type="text"
                name="email"
                value={adminInfo.email}
                onChange={handleChange}
                placeholder="Email"
                className="max-w-[257px] w-full h-10 body-small"
              />
            </p>
            <p
              className={`admin-info-item w-full body-small ${isEditing ? 'editing-view' : ''}`}
            >
              <span className="whitespace-nowrap text-right  flex items-center justify-end">
                Username
              </span>
              <Input
                disabled={true}
                type="text"
                name="userName"
                value={adminInfo.userName}
                onChange={handleChange}
                placeholder="Username"
                className="max-w-[257px] w-full h-10 body-small"
              />
            </p>
            <p
              className={`admin-info-item w-full body-small ${isEditing ? 'editing-view' : ''}`}
            >
              <span className="whitespace-nowrap text-right  flex items-center justify-end">
                Current Password
              </span>
              <Input
                type="password"
                name="currentPassword"
                value={adminInfo.currentPassword}
                onChange={handleChange}
                placeholder="Current Password"
                className="max-w-[257px] w-full h-10 body-small"
              />
            </p>
            <p
              className={`admin-info-item w-full body-small ${isEditing ? 'editing-view' : ''}`}
            >
              <span className="whitespace-nowrap text-right  flex items-center justify-end">
                New Password
              </span>
              <Input
                type="password"
                name="newPassword"
                value={adminInfo.newPassword}
                onChange={handleChange}
                placeholder="New Password"
                className="max-w-[257px] w-full h-10 body-small"
              />
            </p>
            {/* <Button
              variant="accend-link"
              className="underline !text-primary-color-100"
            >
              Forgot password
            </Button> */}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminInfoForm;
