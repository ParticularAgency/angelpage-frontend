"use client";
import React, { useState } from 'react';
import { requestPasswordReset } from '@/utils/api';
import { Button, Input } from '@/components/elements';
import Image from 'next/image';
import ToastNotification, {
  ToastService,
} from '@/components/elements/notifications/ToastService';

const roles = [
  { label: 'User', value: 'USER' },
  { label: 'Charity', value: 'CHARITY' },
  { label: 'Admin', value: 'ADMIN' },
];

const RequestPasswordReset = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('USER'); // Default role can be USER
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async () => {
    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage('');

    try {
      const response = await requestPasswordReset(email, role); // Pass both email and role
      const successMessage =
        response.message || 'Password reset email sent. Please check your inbox.';
      setMessage(successMessage);
      ToastService.success(successMessage); // Changed to success notification
      setEmail('');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Error requesting password reset. Please try again.';
      setError(errorMessage);
      ToastService.error(errorMessage);
      console.error(
        'Error requesting password reset:',
        error.response || error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex md:flex-col gap-[143px] lg:gap-14 md:gap-0">
        <div
          className="w-1/2 md:w-full bg-cover bg-center md:h-[510px]"
          style={{ backgroundImage: "url('/images/auth/hero.png')" }}
        >
          <div className="flex -mt-36 md:-mt-28 justify-center h-full">
            <Image
              src="/images/auth/logo.svg"
              alt="Logo"
              width={367}
              height={100}
              className="md:w-72"
            />
          </div>
        </div>

        <div className="w-1/2 md:w-full md:flex md:justify-center md:px-10 pt-[103px] pb-[260px] md:pb-[160px]">
          <div className="w-full max-w-md">
            <h4 className="text-center mb-[18px]">Reset password</h4>

            {message && (
              <p className="success-message text-green-600">{message}</p>
            )}
            {error && <p className="error-message text-red-600">{error}</p>}
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            />
            <div className="select-role-area px-2">
              <select
                id="RestPassRoleSelect"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-mono-0"
              >
                {roles.map((roleOption) => (
                  <option key={roleOption.value} value={roleOption.value}>
                    {roleOption.label}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="primary"
              className="ml-2"
              onClick={handleRequestReset}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Password Reset Email'}
            </Button>
          </div>
        </div>
        <ToastNotification />
      </div>
    </>
  );
};

export default RequestPasswordReset;
