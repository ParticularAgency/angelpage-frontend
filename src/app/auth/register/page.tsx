'use client';
import { Button, Input } from '@/components/elements';
import Image from 'next/image';
import { useState } from 'react';
import ToastNotification, {
  ToastService,
} from '@/components/elements/notifications/ToastService';

const Register = () => {
  const [activeTab, setActiveTab] = useState<'individual' | 'charity'>(
    'individual'
  );
  const [formData, setFormData] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      ...(activeTab === 'charity' && { userName: formData.userName }),
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // throw new Error(errorData.message || 'Registration failed');
        ToastService.error(errorData.message || 'Registration failed');
      }

      const responseData = await response.json();
      // console.log('Registration successful:', responseData);
      ToastService.success(
        'Registration successful! Redirecting to login...',
        responseData
      );
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 2000);
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
          <h4 className="text-center mb-[18px]">Register</h4>

          <div className="flex space-x-2 justify-center mb-[54px]">
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

            <div className="w-full">
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

            <Button
              type="submit"
              variant="tertiary"
              className="w-full my-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>

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
      <ToastNotification />
    </div>
  );
};

export default Register;
