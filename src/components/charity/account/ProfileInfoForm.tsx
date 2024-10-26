import React, { useState } from 'react';
import { EditIcon, SaveIcon } from '@/icons';
import { Input } from '@/components/elements';

const ProfileInfoForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [charityInfo, setCharityInfo] = useState({
    charityName: 'Salvation Army Trading Co Ltd',
    charityNumber: '980980',
    charityID: '980980',
  });

  const handleEditClick = () => setIsEditing(!isEditing);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCharityInfo({ ...charityInfo, [e.target.name]: e.target.value });
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
              <span className="inline-block">{charityInfo.charityName}</span>
            </p>
            <p className="charity-info-item body-small">
              <span className="inline-block whitespace-nowrap text-right">
                Charity number
              </span>{' '}
              <span className="inline-block">{charityInfo.charityNumber}</span>
            </p>
            <p className="charity-info-item body-small">
              <span className="inline-block whitespace-nowrap text-right">
                Charity ID
              </span>{' '}
              <span className="inline-block">{charityInfo.charityID}</span>
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
                name="name"
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
                name="number"
                value={charityInfo.charityNumber}
                onChange={handleChange}
                placeholder="charity number"
                className="max-w-[257px] w-full h-10 body-small"
              />
            </p>
            <p className="charity-info-item body-small h-full">
              <span className="whitespace-nowrap w-full text-right flex items-center justify-end">
                Charity number
              </span>
              <Input
                type="text"
                name="number"
                value={charityInfo.charityID}
                onChange={handleChange}
                placeholder="charity id"
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
