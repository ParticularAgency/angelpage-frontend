import React, { useState } from 'react';
import { EditIcon, SaveIcon } from '@/icons';
import { Input } from '@/components/elements';

const AccountInfoForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [accountInfo, setAccountInfo] = useState({
    Email: 'Salvation Army Trading Co Ltd',
    Username: '980980',
    currentPassword: '980980',
    newPassword: '',
  });

  const handleEditClick = () => setIsEditing(!isEditing);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountInfo({ ...accountInfo, [name]: value });
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
              <span className="inline-block">{accountInfo.Email}</span>
            </p>
            <p className="personal-info-item body-small">
              <span className="inline-block whitespace-nowrap text-right">
                Username
              </span>{' '}
              <span className="inline-block">{accountInfo.Username}</span>
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
                name="Email"
                value={accountInfo.Email}
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
                name="Username"
                value={accountInfo.Username}
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
