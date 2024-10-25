import React, { useState } from 'react';

interface AccountInfo {
  email: string;
  username: string;
  password: string;
  newPassword?: string; // Add newPassword here
}

const AccountInfoForm: React.FC = () => {
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    email: '',
    username: '',
    password: '',
    newPassword: '', // Initialize newPassword
  });
  
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => setIsEditing(!isEditing);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountInfo({ ...accountInfo, [e.target.name]: e.target.value });
  };

  return (
    <form>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={accountInfo.username}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={accountInfo.email}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
      <div>
        <label>Current Password:</label>
        <input
          type="password"
          name="password"
          value={accountInfo.password}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
      <div>
        <label>New Password:</label>
        <input
          type="password"
          name="newPassword"
          value={accountInfo.newPassword || ''} // Use newPassword
          onChange={handleChange}
          className="max-w-[257px] w-full h-10 body-small"
          disabled={!isEditing}
        />
      </div>
      <button type="button" onClick={handleEditClick}>
        {isEditing ? 'Save' : 'Edit'}
      </button>
    </form>
  );
};

export default AccountInfoForm;
