'use client';
import React, { useState } from 'react';
import {
  Checkmark,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from '@/icons';
import Link from 'next/link';
import axios from 'axios';
import { Button, Input } from '../elements';

import { ToastService } from '@/components/elements/notifications/ToastService'; // Toast for notifications

const Footer = () => {
   const [email, setEmail] = useState('');
   const [loading, setLoading] = useState(false);
const [isSubscribed, setIsSubscribed] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email) {
        ToastService.error('Please enter an email address.');
        return;
      }

      setLoading(true);

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/email/subscribe`,
          { email }
        );
        console.log('email subscribed' , response)
        if (response.status === 200) {
          ToastService.success(`Subscription successful! Check your inbox.`);
          setIsSubscribed(true);
          setEmail(''); 
        } else {
          ToastService.error('Email already subscribed');
        }
       
      } catch (error) {
        console.error('Error subscribing:', error);
        ToastService.error('Email already subscribed');
      } finally {
        setLoading(false);
      }
    };

  return (
    <footer className="footer-section pt-[120px] pb-20 md:pt-20 sm:pb-[127px] sm:pt-[54px] bg-mono-0">
      <div className="custom-container">
        <div className="footer-wrapper">
          <div className="grid grid-cols-12 sm:grid-cols-6 gap-6 sm:gap-0">
            <div className="col-span-3 md:col-span-2 sm:col-span-6 sm:order-2">
              <ul className="quick-link-lists flex flex-col gap-6 sm:gap-0">
                <li className="quick-list-item sm:py-6 sm:text-center sm:font-bold  text-mono-100 font-secondary font-normal leading-[150%] uppercase text-body-caption">
                  <Link href="/">about us</Link>
                </li>
                <li className="quick-list-item sm:py-6 sm:text-center sm:font-bold  text-mono-100 font-secondary font-normal leading-[150%] uppercase text-body-caption">
                  <Link href="/how-it-works">HOW IT WORKS</Link>
                </li>
                {/* <li className="quick-list-item sm:py-6 sm:text-center sm:font-bold  text-mono-100 font-secondary font-normal leading-[150%] uppercase text-body-caption"><Link href="/find-a-charity">Find a charity</Link></li> */}
                <li className="quick-list-item sm:py-6 sm:text-center sm:font-bold  text-mono-100 font-secondary font-normal leading-[150%] uppercase text-body-caption">
                  <Link href="/blog">blog</Link>
                </li>
                <li className="quick-list-item sm:py-6 sm:text-center sm:font-bold  text-mono-100 font-secondary font-normal leading-[150%] uppercase text-body-caption">
                  <Link href="/product">PRODUCTs</Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-3 sm:col-span-6 sm:order-3">
              <ul className="quick-link-lists quick-link-area-two flex flex-col gap-6 sm:gap-0">
                {/* <li className="quick-list-item sm:py-6 sm:text-center sm:font-bold  text-mono-100 font-secondary font-normal leading-[150%] uppercase text-body-caption">
                  <Link href="/">FAQS</Link>
                </li> */}
                <li className="quick-list-item sm:py-6 sm:text-center sm:font-bold  text-mono-100 font-secondary font-normal leading-[150%] uppercase text-body-caption">
                  <Link href="/contact">CONTACT US</Link>
                </li>
                <li className="quick-list-item sm:py-6 sm:text-center sm:font-bold  text-mono-100 font-secondary font-normal leading-[150%] uppercase text-body-caption">
                  <Link href="/privacy-policy">PRIVACY POLICY</Link>
                </li>
                <li className="quick-list-item sm:py-6 sm:text-center sm:font-bold  text-mono-100 font-secondary font-normal leading-[150%] uppercase text-body-caption">
                  <Link href="/terms-of-service">TERMS OF USE</Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1 sm:col-span-6 sm:order-4">
              <ul className="quick-link-socials-lists sm:mt-10 flex flex-col sm:flex-row sm:gap-5 sm:justify-center gap-6">
                <li className="quick-socials-list-item facebook">
                  <Link href="/">
                    <FacebookIcon />
                  </Link>
                </li>
                <li className="quick-list-item twitter">
                  <Link href="/">
                    <TwitterIcon />
                  </Link>
                </li>
                <li className="quick-list-item instagrame">
                  <Link href="/">
                    <InstagramIcon />
                  </Link>
                </li>
                <li className="quick-list-item linkedin">
                  <Link href="/">
                    <LinkedinIcon />
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-5 md:col-span-6 sm:col-span-6 sm:order-1">
              <div className="footer-cta-info sm:mb-10">
                <h5 className="title text-mono-80 sm:text-center text-body-eyebrow-large font-normal leading-[150%] uppercase tracking-[.7px] font-secondary text-left mb-4">
                  Join the AngelPage Community
                </h5>
                <p className="desc-text text-mono-100 sm:text-center text-body-small font-normal  font-secondary leading-[150%]">
                  Be part of a community that values giving back. Sign up for
                  our newsletter to receive updates on our impact, exclusive
                  offers, and tips on how to make the most of your transactions.
                </p>
                <form
                  className="subscription-form mt-8 w-full"
                  onSubmit={handleSubmit}
                >
                  <div className="form-group-item flex sm:flex-wrap sm:gap-4 items-start gap-2 w-full">
                    <Input
                      type="email"
                      placeholder="Enter email"
                      label=""
                      name="email"
                      value={email}
                      id="email"
                      className="flex-col w-full"
                      onChange={e => setEmail(e.target.value)}
                      errorMessage="Input cannot be empty"
                    />
                    <Button
                      variant="primary"
                      className="max-w-[149px] w-full sm:max-w-full"
                      type="submit"
                      disabled={loading || isSubscribed}
                    >
                      {loading ? (
                        'Submitting...'
                      ) : isSubscribed ? (
                        <>
                          Subscribe <Checkmark />
                        </>
                      ) : (
                        'Subscribe'
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

