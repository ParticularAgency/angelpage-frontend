'use client';
import { Button, Input } from '@/components/elements';
import Image from 'next/image';
import { useState } from 'react';

const Login = () => {
  const [activeTab, setActiveTab] = useState<'individual' | 'charity'>(
    'individual'
  );

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
          <h4 className=" text-center mb-[18px]">Login</h4>
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

          {activeTab === 'individual' && (
            <form>
              <div className="flex space-x-5 md:flex-col md:space-x-0 md:space-y-2 mb-[18px]">
                <div className="w-1/2 md:w-full">
                  <Input
                    label="Email address"
                    name="email"
                    placeholder="janed@angelpage.org"
                    type="email"
                    id="email"
                    className="flex-col"
                  />
                </div>

                <div className="w-1/2 md:w-full">
                  <Input
                    label="Password"
                    name="password"
                    placeholder="•••••••••"
                    type="password"
                    id="password"
                    className="flex-col"
                  />
                </div>
              </div>
              <div className="text-right">
                <a href="#" className="text-sm text-primary-color-100">
                  Forgot Password?
                </a>
              </div>
              <Button type="submit" variant="tertiary" className="w-full my-6">
                Login
              </Button>
              <p className="text-body-small">
                New here?{' '}
                <a
                  href="/auth/register"
                  className="text-primary-color-100 underline"
                >
                  Create an account
                </a>
              </p>
            </form>
          )}

          {activeTab === 'charity' && (
            <form>
              <div className="flex space-x-5 md:flex-col md:space-x-0 md:space-y-2 mb-[18px]">
                <div className="w-1/2">
                  <Input
                    label="Email address"
                    name="email"
                    placeholder="janed@angelpage.org"
                    type="email"
                    id="email"
                    className="flex-col"
                  />
                </div>

                <div className="w-1/2">
                  <Input
                    label="Password"
                    name="password"
                    placeholder="•••••••••"
                    type="password"
                    id="password"
                    className="flex-col"
                  />
                </div>
              </div>
              <div className="text-right">
                <a href="#" className="text-sm text-primary-color-100">
                  Forgot password
                </a>
              </div>
              <Button type="submit" variant="tertiary" className="w-full my-6">
                Login
              </Button>
              <p className="text-body-small">
                New here?{' '}
                <a
                  href="/auth/register"
                  className="text-primary-color-100 underline"
                >
                  Create an account
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
