import React, { useState } from "react";
import { EditIcon,SaveIcon } from "@/icons";
import { Button, Input } from "@/components/elements";

const AccountInfoForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [accountInfo, setaccountInfo] = useState({
    email: "account@salvationarmy.org",
    username: "accountuser1",
    password: "********",
  });

  const handleEditClick = () => setIsEditing(!isEditing);
  const handleChange = (e) => {
    setaccountInfo({ ...accountInfo, [e.target.name]: e.target.value });
  };

  return (
    <div className="account-info-section pt-[23px] pb-8">
       <div className="title-line-area-section flex mb-[31px] pb-[13px] justify-between items-center gap-3 w-full">
           <p className="body-bold-regular">account Info</p> 
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
      <div className={`account-info-details flex flex-col items-start ${!isEditing ? "gap-8" : "gap-3"}`}>
        {!isEditing ? (
          <>
            <p className="account-info-item w-full body-small"><span className="inline-block whitespace-nowrap text-right">Email</span> <span className="inline-block">{accountInfo.email}</span></p>
            <p className="account-info-item w-full body-small"><span className="inline-block whitespace-nowrap text-right">Username</span> <span className="inline-block">{accountInfo.username}</span></p>
            <p className="account-info-item w-full body-small"><span className="inline-block whitespace-nowrap text-right">Password</span> <span className="inline-block">{accountInfo.password}</span></p>
            <Button variant="accend-link" className="underline !text-primary-color-100" >Forgot password</Button>
          </>
        ) : (
          <>
            <p className={`account-info-item w-full body-small ${isEditing ? "editing-view" : ""}`}><span className="whitespace-nowrap text-right  flex items-center justify-end">Email</span> 
            <Input 
             type="email"
              name="email"
              value={accountInfo.email}
              onChange={handleChange}
              className="max-w-[257px] w-full h-10 body-small"
              disabled={true}
            />
            </p>
            <p className={`account-info-item w-full body-small ${isEditing ? "editing-view" : ""}`}><span className="whitespace-nowrap text-right  flex items-center justify-end">Username</span> 
            <Input 
             type="text"
              name="username"
              value={accountInfo.username}
              onChange={handleChange}
              className="max-w-[257px] w-full h-10 body-small"
            />
            </p>
            <p className={`account-info-item w-full body-small ${isEditing ? "editing-view" : ""}`}><span className="whitespace-nowrap text-right  flex items-center justify-end">Current Password</span> 
             <Input 
             type="password"
              name="password"
              value={accountInfo.password}
              onChange={handleChange}
              className="max-w-[257px] w-full h-10 body-small"
            />
            </p>
               <p className={`account-info-item w-full body-small ${isEditing ? "editing-view" : ""}`}><span className="whitespace-nowrap text-right  flex items-center justify-end">New Password</span> 
             <Input 
             type="password"
              name="password"
              value={accountInfo.newPassword}
              onChange={handleChange}
              className="max-w-[257px] w-full h-10 body-small"
            />
            </p>
            <Button variant="accend-link" className="underline !text-primary-color-100" >Forgot password</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountInfoForm;