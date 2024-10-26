import React, { useState } from 'react';
import Image from 'next/image';
import { EditIcon, SaveIcon } from '@/icons';

const ProfileImageSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [image, setProfileImage] = useState(
    '/images/icons/elisp-profile-default-img.svg'
  );

  const handleEditClick = () => setIsEditing(!isEditing);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; // Get the FileList from the input
    if (files && files.length > 0) {
      // Check if files is not null and has at least one file
      const file = files[0];
      const reader = new FileReader();
      reader.onload = event => {
        setProfileImage(event.target?.result as string); // Set the profile image state
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  return (
    <div className="profile-img-section pt-[23px] pb-8">
      <div className="title-line-area-section flex mb-[31px] pb-[13px] justify-between items-center gap-3 w-full">
        <p className="body-bold-regular">Profile image</p>
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
      <div className="image-display">
        {!isEditing ? (
          <Image
            src={image}
            alt="Profile"
            className="w-10 h-10 object-cover rounded-full object-center"
            width={40}
            height={40}
          />
        ) : (
          <input type="file" accept="image/*" onChange={handleImageChange} />
        )}
      </div>
    </div>
  );
};

export default ProfileImageSection;
