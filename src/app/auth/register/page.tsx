'use client';
import { Button, Input } from '@/components/elements';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { signIn, getProviders } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ToastService,
} from '@/components/elements/notifications/ToastService';
import { UK_DEFAULT_COUNTRY } from '@/utils/ukValidation';
import CaptchaWidget from '@/components/auth/CaptchaWidget';

const Register = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromGuestCheckout = searchParams?.get('from') === 'guest-checkout';
  const [activeTab, setActiveTab] = useState<'individual' | 'charity'>(
    'individual'
  );
  const [formData, setFormData] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    charityNumber: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [oauthProviders, setOauthProviders] = useState<string[]>([]);

  useEffect(() => {
    getProviders().then(providers => {
      if (!providers) return;
      setOauthProviders(
        Object.keys(providers).filter(p => p !== 'credentials')
      );
    });
  }, []);

  const handleOAuthSignIn = async (provider: 'google' | 'facebook') => {
    if (!oauthProviders.includes(provider)) {
      ToastService.error(
        `${provider === 'google' ? 'Google' : 'Facebook'} sign-up is not set up yet. Please register with email and password.`
      );
      return;
    }

    try {
      await fetch('/api/auth/oauth-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: activeTab === 'charity' ? 'CHARITY' : 'USER',
        }),
      });
    } catch {
      /* continue */
    }

    signIn(provider, { callbackUrl: '/product/post-product' });
  };

  useEffect(() => {
    const emailParam = searchParams?.get('email');
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const endpoint = `${process.env.NEXT_PUBLIC_API_URL || ''}/auth/register`;
    const userRole = activeTab === 'individual' ? 'USER' : 'CHARITY';

    const payload = {
      ...formData,
      role: userRole,
      country: UK_DEFAULT_COUNTRY,
      ...(activeTab === 'charity' && { userName: formData.userName }),
      ...(captchaToken ? { captchaToken } : {}),
    };

    try {
const response = await fetch(endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});

// Read JSON once
const data = await response.json();

if (!response.ok) {
  ToastService.error(data.message || 'Registration failed');
  setIsSubmitting(false);
  return; // ⛔ Stop execution here
}

// Success path — log in immediately
ToastService.success('Welcome to Angelpage! Setting up your account...');

const signInResult = await signIn('credentials', {
  redirect: false,
  email: formData.email,
  password: formData.password,
  role: userRole,
});

if (signInResult?.ok) {
  const destination =
    userRole === 'CHARITY'
      ? '/charity/complete-registrations'
      : '/product/post-product';
  router.push(destination);
} else {
  setTimeout(() => {
    window.location.href = '/auth/login';
  }, 1500);
}

    } catch (err) {
      if (err instanceof Error) {
        ToastService.error(err.message);
        setError(err.message);
      } else {
        ToastService.error('An unknown error occurred');
        setError('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex md:flex-col gap-[143px] lg:gap-14 md:gap-0">
      <div
        className="w-1/2 md:w-full sm:order-2 bg-cover bg-center md:h-[510px] sm:h-[250px]"
        style={{ backgroundImage: "url('/images/auth/hero.png')" }}
      >
        <div className="flex -mt-36 sm:-mt-16 md:-mt-28 justify-center h-full">
          <Image
            src="/images/auth/logo.svg"
            alt="Logo"
            width={367}
            height={100}
            className="md:w-72 sm:w-56"
          />
        </div>
      </div>

      <div className="w-1/2 sm:order-1 sm:pt-14 sm:pb-20 md:w-full md:flex md:justify-center md:px-10 pt-[103px] pb-[260px] md:pb-[160px]">
        <div className="w-full max-w-md">
          <h4 className="text-center mb-[18px]">Register</h4>

          {fromGuestCheckout && (
            <p className="text-body-small text-mono-80 text-center mb-6 rounded-xl border border-[#611192]/20 bg-[#FCF2FF] p-4">
              Create an account with the same email you used at checkout to save
              your order and manage it from your account.
            </p>
          )}

          <div className="flex space-x-2 justify-center mb-[54px] sm:mb-9">
            <button
              className={`p-2 text-body-small rounded-3xl ${activeTab === 'individual' ? 'bg-[#FAF2FF] text-primary-color-100 font-semibold' : 'bg-transparent text-mono-100'}`}
              onClick={() => setActiveTab('individual')}
            >
              Individual
            </button>
            <button
              className={`text-body-small p-2 rounded-3xl ${activeTab === 'charity' ? 'bg-[#FAF2FF] text-primary-color-100 font-semibold' : 'bg-transparent text-mono-100'}`}
              onClick={() => setActiveTab('charity')}
            >
              Charity/Brand
            </button>
          </div>

          {error && <p className="text-error text-body-small  mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            {activeTab === 'individual' ? (
              <>
                <div className="w-full my-2">
                  <Input
                    label="User name"
                    name="userName"
                    placeholder="@angelpage"
                    id="userName"
                    className="flex-col"
                    value={formData.userName}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex space-x-5 md:flex-col md:space-x-0 md:space-y-2">
                  <div className="w-1/2 md:w-full">
                    <Input
                      label="First name"
                      name="firstName"
                      placeholder="Jane"
                      id="firstName"
                      className="flex-col"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-1/2 md:w-full">
                    <Input
                      label="Last name"
                      name="lastName"
                      placeholder="Doe"
                      id="lastName"
                      className="flex-col"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-full my-2">
                  <Input
                    label="User name"
                    name="userName"
                    placeholder="@angelpage"
                    id="userName"
                    className="flex-col"
                    value={formData.userName}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex space-x-5 md:flex-col md:space-x-0 md:space-y-2">
                  <div className="w-1/2 md:w-full">
                    <Input
                      label="First name"
                      name="firstName"
                      placeholder="Jane"
                      id="firstName"
                      className="flex-col"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-1/2 md:w-full">
                    <Input
                      label="Last name"
                      name="lastName"
                      placeholder="Doe"
                      id="lastName"
                      className="flex-col"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="w-full my-2">
              <Input
                label="Email address"
                name="email"
                placeholder="janed@angelpage.org"
                type="email"
                id="email"
                className="flex-col"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="w-full my-2">
              <Input
                label="Password"
                name="password"
                placeholder="•••••••••"
                type="password"
                id="password"
                className="flex-col"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
              {activeTab === 'individual' ? '' : (
            <div className="w-full">
              <Input
                label="Charity Number"
                name="charityNumber"
                placeholder="000 000 00"
                id="charityNumber"
                className="flex-col"
                value={formData.charityNumber}
                onChange={handleChange}
              />
            </div>
              ) }
            <p className="text-body-small text-mono-70 mb-4">
              Angelpage starts in the United States. We also sell in Canada and
              the United Kingdom.
            </p>
            <CaptchaWidget
              onVerify={setCaptchaToken}
              onExpire={() => setCaptchaToken('')}
            />
            <Button
              type="submit"
              variant="tertiary"
              className="w-full my-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>

            {activeTab === 'individual' && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-mono-40" />
                  </div>
                  <p className="relative flex justify-center text-body-small text-mono-70 bg-white px-3">
                    Or continue with
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => handleOAuthSignIn('google')}
                  >
                    Continue with Google
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => handleOAuthSignIn('facebook')}
                  >
                    Continue with Facebook
                  </Button>
                </div>
              </>
            )}

            <p className="text-body-small">
              Already have an account?{' '}
              <a
                href="/auth/login"
                className="text-primary-color-100 underline"
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
