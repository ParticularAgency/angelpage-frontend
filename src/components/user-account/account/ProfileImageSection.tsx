import React, { useState } from 'react';
import Image from 'next/image';
import { EditIcon, SaveIcon } from '@/icons';

const ProfileImageSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [image, setProfileImage] = useState(
    '/images/icons/elisp-profile-default-img.svg'
  );
  const [newImage, setNewImage] = useState<string | ArrayBuffer | null>(null);

 const handleEditClick = () => {
   if (isEditing) {
     // When saving, set the profile image to the new image if it exists and is a string
     if (typeof newImage === 'string') {
       setProfileImage(newImage);
       setNewImage(null); // Reset newImage state after saving
     }
   }
   setIsEditing(!isEditing); // Toggle editing state
 };
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
        <Image
          src={newImage ? (newImage as string) : image} // Show new image if it exists, otherwise show the current image
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
            className="mt-8" // Optional: add margin for spacing
          />
        )}
        {image === '/images/icons/elisp-profile-default-img.svg' &&
          !newImage &&
          !isEditing && (
            <p className="mt-6 body-small text-mono-100">No image uploaded</p>
          )}
      </div>
    </div>
  );
};

export default ProfileImageSection;
