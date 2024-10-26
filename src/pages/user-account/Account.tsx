'use client';
import React from 'react';
import ProfileImageSection from '@/components/user-account/account/ProfileImageSection';
import ProfileInfoForm from '@/components/user-account/account/ProfileInfoForm';
import AddressForm from '@/components/user-account/account/AddressForm';
import PaymentInfoForm from '@/components/user-account/account/PaymentInfoForm';
import AccountInfoForm from '@/components/user-account/account/AccountInfoForm';
const UsersAccountInfoMain = () => {
  return (
    <div className="Users-account-info-wrapper max-w-[551px] w-full">
      <ProfileImageSection />
      <ProfileInfoForm />
      <AccountInfoForm />
      <AddressForm />
      <PaymentInfoForm />
    </div>
  );
};

export default UsersAccountInfoMain;
