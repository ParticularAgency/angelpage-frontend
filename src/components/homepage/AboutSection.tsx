'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../elements';

const AboutSection = () => {
  return (
    <section className="about-section pt-[100px] md:pt-16">
      <div className="custom-container sm:px-0!">
        <div className="about-sec-wrapper grid grid-cols-12 gap-6 sm:gap-12 sm:grid-cols-6">
          <div className="about-sec-info-cont sm:px-4 col-span-6 sm:col-span-full">
            <h3 className="h3 about-sec-title max-w-[540px] mb-5">
              Where sellers are donors and buyers are givers
            </h3>
            <p className="about-sec-desc body-regular">
              Angelpage is reshaping charitable giving through an innovative
              online marketplace. Sell pre-loved items and send most of the
              proceeds to your chosen charity — or share the sale. You decide
              the split after a small platform fee.
              <br />
              <br />
              Driven by sustainability and philanthropy, we make everyday
              transactions meaningful acts of giving. Join a movement that turns
              clutter into charity and shopping into support for worthy causes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth/register?intent=sell">
                <Button variant="primary">Start selling</Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="secondary">How it works</Button>
              </Link>
            </div>
          </div>
          <div className="about-sec-modal-img col-span-6 sm:col-span-full pl-[54px] laptop-m:pl-0">
            <Image
              src="/images/home/about-sec-modal-img.jpeg"
              className="w-full h-full object-cover"
              alt="about section modal image"
              width={635}
              height={385}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
