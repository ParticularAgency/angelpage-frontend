import React, { useState } from "react";
import { EditIcon,SaveIcon } from "@/icons";
import { Input } from "@/components/elements";
import { Label } from "recharts";

const ProfileInfoForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [charityInfo, setCharityInfo] = useState({
    firstName: "Salvation Army Trading Co Ltd",
    lastName: "980980",
    dateBirth: "980980",
  });

  const handleEditClick = () => setIsEditing(!isEditing);
  const handleChange = (e) => {
    setCharityInfo({ ...charityInfo, [e.target.name]: e.target.value });
  };

  return (
    <div className="personal-info-section pt-[23px] pb-8">
      <div className="title-line-area-section flex mb-[31px] pb-[13px] justify-between items-center gap-3 w-full">
           <p className="body-bold-regular">Personal info</p> 
           <div className="btn-states-box">
          <button onClick={handleEditClick}  className="states-btn body-small flex items-center gap-2 text-primary-color-100">
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
      <div className={`personal-info-details flex flex-col  ${!isEditing ? "gap-8" : "gap-3"}`}>
        {!isEditing ? (
          <>
            <p className="personal-info-item body-small"><span className="inline-block whitespace-nowrap text-right">First name</span> <span className="inline-block">{charityInfo.firstName}</span></p>
            <p className="personal-info-item body-small"><span className="inline-block whitespace-nowrap text-right">Last name</span> <span className="inline-block">{charityInfo.lastName}</span></p>
            <p className="personal-info-item body-small"><span className="inline-block whitespace-nowrap text-right">Date of birth</span> <span className="inline-block">{charityInfo.dateBirth}</span></p>
          </>
        ) : (
          <> 
           <p className="personal-info-item body-small h-full"><span className="whitespace-nowrap w-full text-right flex items-center justify-end">First name</span> <Input type="text"
              name="name"
              value={charityInfo.firstName}
              onChange={handleChange}
              placeholder="charity name" className="max-w-[257px] w-full h-10 body-small" /></p>
               <p className="personal-info-item body-small h-full"><span className="whitespace-nowrap w-full text-right flex items-center justify-end">Last name</span> 
               <Input 
               type="text"
              name="number"
              value={charityInfo.lastName}
              onChange={handleChange}
              placeholder="charity number"
              className="max-w-[257px] w-full h-10 body-small" /></p>
               <p className="personal-info-item body-small h-full"><span className="whitespace-nowrap w-full text-right flex items-center justify-end">Date of birth</span> 
               <Input 
               type="text"
              name="number"
              value={charityInfo.dateBirth}
              onChange={handleChange}
              placeholder="charity id"
              className="max-w-[257px] w-full h-10 body-small" /></p>
           
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileInfoForm;

