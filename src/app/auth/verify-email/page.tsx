'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyEmail, resendVerificationEmail } from '@/utils/api'; // Import both verify and resend functions
import { Button, Input } from '@/components/elements';
import Image from 'next/image';
import ToastNotification, {
  ToastService,
} from '@/components/elements/notifications/ToastService';

const VerifyEmail: React.FC = () => {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);

  // Function to handle email verification
  const handleVerify = async () => {
    if (!email || !verificationCode) {
      setError('Please fill in both your email and the verification code.');
      return;
    }

    console.log(
      `Sending email: ${email}, Verification code: ${verificationCode}`
    );

    setLoading(true);
    setError(null);

    try {
      // Assuming verifyEmail is an API function that sends request to your backend
      const response = await verifyEmail({ email, verificationCode });
      ToastService.success(response.message || 'Email verified successfully.');
      router.push('/auth/login');
    } catch (error) {
      console.error('Verification Error:', error);

      if (error?.message === 'Invalid verification code.') {
        setError('Invalid verification code. Please check and try again.');
      } else if (error?.message === 'Verification code has expired.') {
        setError('Verification code has expired. Please request a new code.');
      } else {
        setError('Failed to verify email. Please try again.');
      }
      ToastService.error('Failed to verify email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle resending the verification code
  const handleResendVerification = async () => {
    if (!email) {
      setError('Please provide your email to resend the verification code.');
      return;
    }

    setResending(true);
    setError(null);

    try {
      // Assuming resendVerificationEmail is an API function that sends request to your backend
      const response = await resendVerificationEmail({ email });
      ToastService.success(
        response.message || 'Verification code has been resent successfully.'
      );
    } catch (error) {
      console.error('Resend Verification Error:', error);
      setError('Failed to resend verification code. Please try again.');
      ToastService.error(
        'Failed to resend verification code. Please try again.'
      );
    } finally {
      setResending(false);
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
          <h4 className="text-center mb-[18px]">Email Verification</h4>
          <p className="body-small text-mono-100 text-left mb-10">
            Pleas check your email, we have sent you a verification code{' '}
          </p>
          {error && (
            <p className="error-message body-small text-red-600 mb-4 text-left">
              {error}
            </p>
          )}

          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md mb-4"
          />

          <Input
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={e => setVerificationCode(e.target.value)}
            className="w-full border border-gray-300 rounded-md mb-4"
          />

          <Button
            variant="primary"
            onClick={handleVerify}
            disabled={loading}
            className="w-full py-3"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </Button>
          <Button
            variant="accent-link"
            onClick={handleResendVerification}
            disabled={resending}
            className="w-full py-3 mt-4"
          >
            {resending ? 'Resending...' : 'Resend Verification Code'}
          </Button>
        </div>
      </div>
      <ToastNotification />
    </div>
  );
};

export default VerifyEmail;
