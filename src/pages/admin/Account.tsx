'use client';
import React from 'react';
import ProfileImageSection from '@/components/admin-account/account/ProfileImageSection';
import ProfileInfoForm from '@/components/admin-account/account/ProfileInfoForm';
import AddressForm from '@/components/admin-account/account/AddressForm';
import PaymentInfoForm from '@/components/admin-account/account/PaymentInfoForm';
import AccountInfoForm from '@/components/admin-account/account/AccountInfoForm';
import LogoutButton from '@/components/elements/button/LogoutButton';
const UsersAccountInfoMain = () => {
  return (
    <div className="Users-account-info-wrapper max-w-[551px] w-full">
      <ProfileImageSection />
      <ProfileInfoForm />
      <AccountInfoForm />
      <AddressForm />
      <PaymentInfoForm />
      <LogoutButton />
    </div>
  );
};

export default UsersAccountInfoMain;
