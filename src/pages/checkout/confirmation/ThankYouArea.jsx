import { Button } from '@/components/elements';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const ThankYouArea = ({orderAddressinfo}) => {
  return (
    <div className="order-confirmed-screen-thankyou-wrapper">
      <h2 className="h4 confirmation-title mb-4 font-primary text-mono-100 font-normal tracking-[.24px] leading-[125%]">
        Thank you for your purchase!
      </h2>
      <p className="desc body-small max-w-[511px] font-secondary font-normal leading-[150%] text-mono-100 mb-[10px]">
        Your items will be delivered in the time frame given by the seller. You
        will receive a notification when the items are dispatched.
      </p>
      <div className="modal-area-image mb-9 relative max-w-[237px] w-full">
        <Image
          className="signeture-image w-[237px] h-[137px] object-cover"
          src="/images/signeture-image.svg"
          alt="signeture image"
          width={1200}
          height={892}
        />
        <div className="charity-for-section-product flex items-center gap-1  absolute bottom-1 right-[14px]">
          {orderAddressinfo?.products.map((item, index) => {
             return (
               <Image
                 className="charity-image w-14 h-14 object-cover bg-red"
                 key={index}
                 src={
                   item.charity.profileImage ||
                   '/images/products/card-placeholder-image.webp'
                 }
                 alt="charity image"
                 width={868}
                 height={1024}
               />
             );
          })}
        </div>
        ;
      </div>
      <div className="shipping-address-info-area mb-6">
        <p className="forms-bold mb-2 font-secondary text-mono-80">
          Shipping to
        </p>
        <p className="body-bold-small font-secondary text-mono-100 mb-1">
          {orderAddressinfo?.shippingAddress.name}
        </p>
        <p className="body-small font-secondary text-mono-100 mb-1">
          {orderAddressinfo?.shippingAddress.city}
        </p>
        <p className="body-small font-secondary text-mono-100 mb-1">
          {orderAddressinfo?.shippingAddress.country}
        </p>
        <p className="body-small font-secondary text-mono-100 mb-1">
          {orderAddressinfo?.shippingAddress.postcode}
        </p>
      </div>
      <Link className="back-to-home block" href="/">
        <Button 
          variant="accend-link"
          className="!text-primary-color-100 !px-0 font-secondary font-normal leading-[150%] underline"
        >
          Back to home
        </Button>
      </Link>
    </div>
  );
}

export default ThankYouArea
