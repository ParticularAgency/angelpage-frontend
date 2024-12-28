import React, { useState, useEffect } from 'react';
import { EditIcon, SaveIcon } from '@/icons';
import { Input, Textarea} from '@/components/elements';
import { fetchAdminInfo } from '@utils/api';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import  { ToastService } from '@/components/elements/notifications/ToastService';

const ProfileInfoForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [charityInfo, setCharityInfo] = useState({
    charityName: '',
    charityNumber: '',
    charityID: '',
    description: '',
  });
  const { data: session, status } = useSession() || {};

  // Fetch user data on mount if session is authenticated
  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated' && session?.token) {
        const data = await fetchAdminInfo(session.token);
        if (data) {
          setCharityInfo({
            charityName: data.charityName || '',
            charityNumber: data.charityNumber || '',
            charityID: data.charityID || '',
            description: data.description || '',
            phoneNumber: data.phoneNumber || '',
            websiteLink: data.websiteLink || '',
          });
        } else {
          console.error('Failed to fetch user data');
        }
      }
    };
    fetchData();
  }, [session, status]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCharityInfo({ ...charityInfo, [name]: value });
  };
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setCharityInfo({ ...charityInfo, [name]: value });
  };
  const handleSave = async () => {
    console.log('Saving user data:', charityInfo); // Log the data to be sent

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/charity/profile/adminInfo`,
        {
          charityName: charityInfo.charityName,
          charityNumber: charityInfo.charityNumber,
          charityID: charityInfo.charityID,
          description: charityInfo.description,
          websiteLink: charityInfo.websiteLink,
          phoneNumber: charityInfo.phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        ToastService.success('charity info updated successfully');
        setIsEditing(false);
      } else {
        console.error('Failed to update charity info:', response.data);
      }
    } catch (error) {
      console.error('Error updating charity info:', error);
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
    <div className="charity-info-section pt-[23px] pb-8">
      <div className="title-line-area-section flex mb-[31px] pb-[13px] justify-between items-center gap-3 w-full">
        <p className="body-bold-regular">Charity Info</p>
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
        className={`charity-info-details flex flex-col  ${!isEditing ? 'gap-8' : 'gap-3'}`}
      >
        {!isEditing ? (
          <>
            <p className="charity-info-item body-small">
              <span className="inline-block whitespace-nowrap text-right">
                Charity name
              </span>{' '}
              <span className="inline-block">
                {charityInfo ? (
                  charityInfo.charityName
                ) : (
                  <div className="skeleton bg-mono-50 h-3 w-20"></div>
                )}
              </span>
            </p>
            <p className="charity-info-item body-small">
              <span className="inline-block whitespace-nowrap text-right">
                Charity number
              </span>{' '}
              <span className="inline-block">
                {charityInfo ? (
                  charityInfo.charityNumber
                ) : (
                  <div className="skeleton bg-mono-50 h-3 w-20"></div>
                )}
              </span>
            </p>
            <p className="charity-info-item body-small">
              <span className="inline-block whitespace-nowrap text-right">
                Charity ID
              </span>{' '}
              <span className="inline-block">
                {charityInfo ? (
                  charityInfo.charityID
                ) : (
                  <div className="skeleton bg-mono-50 h-3 w-20"></div>
                )}
              </span>
            </p>
            <p className="charity-info-item body-small">
              <span className="inline-block whitespace-nowrap text-right">
                Charity description
              </span>{' '}
              <span className="inline-block">
                {charityInfo ? (
                  charityInfo.description
                ) : (
                  <div className="skeleton bg-mono-50 h-3 w-20"></div>
                )}
              </span>
            </p>
            <p className="charity-info-item body-small">
              <span className="inline-block whitespace-nowrap text-right">
                Phone number
              </span>{' '}
              <span className="inline-block">
                {charityInfo ? (
                  charityInfo.phoneNumber
                ) : (
                  <div className="skeleton bg-mono-50 h-3 w-20"></div>
                )}
              </span>
            </p>
            <p className="charity-info-item body-small">
              <span className="inline-block whitespace-nowrap text-right">
                Charity website
              </span>{' '}
              <span className="inline-block">
                {charityInfo ? (
                  charityInfo.websiteLink
                ) : (
                  <div className="skeleton bg-mono-50 h-3 w-20"></div>
                )}
              </span>
            </p>
          </>
        ) : (
          <>
            <p className="charity-info-item body-small h-full">
              <span className="whitespace-nowrap w-full text-right flex items-center justify-end">
                Charity name
              </span>{' '}
              <Input
                type="text"
                name="charityName"
                value={charityInfo.charityName}
                onChange={handleChange}
                placeholder="charity name"
                className="max-w-[257px] w-full h-10 body-small"
              />
            </p>
            <p className="charity-info-item body-small h-full">
              <span className="whitespace-nowrap w-full text-right flex items-center justify-end">
                Charity number
              </span>
              <Input
                type="text"
                name="charityNumber"
                value={charityInfo.charityNumber}
                onChange={handleChange}
                placeholder="charity number"
                className="max-w-[257px] w-full h-10 body-small"
              />
            </p>
            <p className="charity-info-item body-small h-full">
              <span className="whitespace-nowrap w-full text-right flex items-center justify-end">
                CharityID
              </span>
              <Input
                type="text"
                name="charityID"
                value={charityInfo.charityID}
                onChange={handleChange}
                placeholder="charity id"
                className="max-w-[257px] w-full h-10 body-small"
              />
            </p>
            <p className="charity-info-item flex items-start body-small h-full">
              <span className="whitespace-nowrap w-full text-right flex items-center justify-end">
                Charity description
              </span>

              <Textarea
                name="description"
                value={charityInfo.description}
                onChange={handleTextChange}
                placeholder="Write about you..."
                maxLength={200}
                className="max-w-[257px] w-full h-auto body-small"
              />
            </p>
            <p className="charity-info-item body-small h-full">
              <span className="whitespace-nowrap w-full text-right flex items-center justify-end">
                Phone number
              </span>
              <Input
                type="text"
                name="phoneNumber"
                value={charityInfo.phoneNumber}
                onChange={handleChange}
                placeholder="charity phone number"
                className="max-w-[257px] w-full h-10 body-small"
              />
            </p>
            <p className="charity-info-item body-small h-full">
              <span className="whitespace-nowrap w-full text-right flex items-center justify-end">
                Website link
              </span>
              <Input
                type="text"
                name="websiteLink"
                value={charityInfo.websiteLink}
                onChange={handleChange}
                placeholder="charity website link"
                className="max-w-[257px] w-full h-10 body-small"
              />
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileInfoForm;
