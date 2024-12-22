'use client';
import React, { useState } from 'react';
import { Button, Input } from '@/components/elements';
import axios from 'axios';
import { ToastService } from '@/components/elements/notifications/ToastService';

const Contact = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      setLoading(true);

      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/email/contact`, {
          firstName,
          lastName,
          email,
          phone,
          message,
        });

        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setMessage('');
         if (response.status === 200) {
           ToastService.success(
             `Mail send successfully! Check your ${email} inbox.`
           );
           setEmail(''); // Clear the input field
         } else {
           ToastService.error('Something went wrong. Please try again.');
         }
      } catch (err) {
         ToastService.error(
           'Failed to send your message. Please try again later.'
         );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex custom-container gap-[139px] md:gap-5 md:flex-col pt-[73px] pb-[49px] md:pb-20">
      {/* Left Section */}
      <div className="w-1/2 md:w-full flex flex-col justify-center pr-8">
        <h6 className="mb-2 font-primary text-[18px] text-left font-normal leading-[135%] tracking-[.18px] text-mono-100">
          Contact AngelPage
        </h6>
        <p className="body-regular max-w-[433px] w-full">
          Reach out for information on how to sign up, how the platform works,
          and potential partnerships.
        </p>
        <div className="flex justify-between mt-[60px]">
          <div className="mb-2">
            <p className="text-body-caption font-medium">Contact number</p>
            <p>0000000000</p>
          </div>
          <div className="mb-2">
            <p className="text-body-caption font-medium">Email</p>
            <p>info@angelpage.org</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 md:w-full flex">
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex space-x-6 md:flex-col md:space-x-0 md:space-y-[13px] xl:mt-[13px]">
            <div className="w-1/2 md:w-full">
              <Input
                label="First name"
                name="firstName"
                value={firstName}
                placeholder="Jane"
                id="firstName"
                className="flex-col"
                onChange={e => setFirstName(e.target.value)}
              />
            </div>

            <div className="w-1/2 md:w-full">
              <Input
                label="Last name"
                name="lastName"
                value={lastName}
                placeholder="Doe"
                id="lastName"
                className="flex-col"
                onChange={e => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="flex space-x-6 md:flex-col md:space-x-0 md:space-y-[13px] xl:mt-[13px]">
            <div className="w-1/2 md:w-full">
              <Input
                label="Email address"
                name="email"
                value={email}
                placeholder="janed@angelpage.org"
                type="email"
                id="email"
                className="flex-col"
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="w-1/2 md:w-full">
              <Input
                label="Phone number"
                name="phone"
                value={phone}
                placeholder="00000000000"
                id="phone"
                className="flex-col"
                onChange={e => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full mt-[19px]">
            <Input
              label="Message"
              name="message"
              value={message}
              placeholder="Type message here"
              id="message"
              className="flex-col"
              onChange={e => setMessage(e.target.value)}
            />
          </div>
          
          <Button
            type="submit"
            variant="primary"
            className="mt-[27px]"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
