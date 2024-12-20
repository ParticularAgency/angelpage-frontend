'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { resetPassword } from '@/utils/api'; // Import the API utility function for resetting the password
import { Button, Input } from '@/components/elements';
import Image from 'next/image';
import {
  ToastService,
} from '@/components/elements/notifications/ToastService';

const ResetPassword = () => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Extract the token from the URL query parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tokenFromQuery = params.get('token');
      if (!tokenFromQuery) {
        setError('Invalid or missing reset token.');
      } else {
        setToken(tokenFromQuery);
      }
    }
  }, []);

  // Handle the password reset submission
  const handleResetPassword = async () => {
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await resetPassword(token, newPassword);
      const successMessage =
        response.message || 'Password reset successful. You can now log in.';
      setMessage(successMessage);
      ToastService.success(successMessage);
      setNewPassword('');
      setConfirmPassword('');
      router.push('/auth/login'); // Redirect to login page after successful reset
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Error resetting password. Please try again.';
      setError(errorMessage);
      ToastService.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
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

          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}

          <Input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />

          <Button
            variant="primary"
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </div>
      </div>
     
    </div>
  );
};

export default ResetPassword;
