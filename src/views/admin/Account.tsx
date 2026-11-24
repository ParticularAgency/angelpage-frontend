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
      <div className="rounded-xl border border-[#E6E3E7] bg-[#FAFAFB] p-5 mt-6">
        <h4 className="forms-bold text-mono-100">Two-factor authentication</h4>
        <p className="body-small text-mono-70 mt-2">
          2FA for admin accounts is planned. Email + password and OAuth are active today.
          Contact Super Admin to enforce team password policies.
        </p>
      </div>
      <LogoutButton />
    </div>
  );
};

export default UsersAccountInfoMain;
