"use client";
import React from "react";
import ProfileImageSection from "@/components/charity/account/ProfileImageSection";
import ProfileInfoForm from "@/components/charity/account/ProfileInfoForm";
import AddressForm from "@/components/charity/account/AddressForm";
import PaymentInfoForm from '@/components/charity/account/PaymentInfoForm';
import AdminInfoForm from "@/components/charity/account/AdminInfoForm";
const CharityAccountInfoMain = () => {
  return (
        <div className="charity-account-info-wrapper max-w-[551px] w-full">
                    <ProfileImageSection />
                    <ProfileInfoForm />
                    <AdminInfoForm />
                    <AddressForm />
                   <PaymentInfoForm />
                  </div>
  )
}

export default CharityAccountInfoMain