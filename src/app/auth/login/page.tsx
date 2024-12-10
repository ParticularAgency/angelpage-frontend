'use client';
import { signIn, useSession } from 'next-auth/react';
import { Button, Input } from '@/components/elements';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ToastNotification, { ToastService } from '@/components/elements/notifications/ToastService';

type SignInResult = {
  error?: string;
  user?: {
    id: string;
    role: 'USER' | 'CHARITY' | 'ADMIN';
  };
};

const Login = () => {
  const { data: session } = useSession() ;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeRole, setActiveRole] = useState('USER');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Sign in request
    const result = (await signIn('credentials', {
      redirect: false,
      email,
      password,
      role: activeRole,
    })) as SignInResult;

    if (result?.error) {
      let errorMessage = result.error;
      if (result.error === 'CredentialsSignin') {
        errorMessage = 'Invalid email or password. Please try again.';
      }
      setError(errorMessage);
      ToastService.error(errorMessage);
      setIsSubmitting(false);
      return;
    }

    // Check if user is in result
    const userRole = result?.user?.role || session?.user?.role;
    const userId = result?.user?.id || session?.user?.id;

    if (userRole && userId) {
      if (userRole === activeRole) {
        ToastService.success('Login successful! Redirecting...');
        setTimeout(() => {
          if (userRole === 'USER') {
            router.push(`/`);
          } else if (userRole === 'CHARITY') {
            router.push(`/`);
          }
          setIsSubmitting(false);
        }, 2000);
      } else {
        setError(`Only ${activeRole === 'USER' ? 'User' : 'Charity'} accounts can log in here.`);
        ToastService.error(`Only ${activeRole === 'USER' ? 'User' : 'Charity'} accounts can log in here.`);
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    if (session?.user?.role && session?.user?.id) {
      const userRole = session.user.role;
      const userId = session.user.id;
      ToastService.success('Login successful! Redirecting to account...');
      setTimeout(() => {
        if (userRole === 'USER') {
          router.push(`/user/account/${userId}`);
        } else if (userRole === 'CHARITY') {
          router.push(`/charity/account/${userId}`);
        }
      }, 2000);
    }
  }, [session, router]);

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
          <h4 className="text-center mb-[18px]">Login</h4>

          <div className="flex space-x-2 justify-center mb-[54px]">
            <button
              className={`p-2 text-body-small rounded-3xl ${activeRole === 'USER' ? 'bg-[#FAF2FF] text-primary-color-100 font-semibold' : 'bg-transparent text-mono-100'}`}
              onClick={() => setActiveRole('USER')}
            >
              Individual
            </button>
            <button
              className={`text-body-small p-2 rounded-3xl ${activeRole === 'CHARITY' ? 'bg-[#FAF2FF] text-primary-color-100 font-semibold' : 'bg-transparent text-mono-100'}`}
              onClick={() => setActiveRole('CHARITY')}
            >
              Charity/Brand
            </button>
          </div>
          {error && <p className="text-error text-body-small mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="w-full my-2">
              <Input
                label="Email address"
                name="email"
                placeholder="janed@angelpage.org"
                type="email"
                id="email"
                className="flex-col"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="text-right">
              <a
                href="/auth/request-reset-password"
                className="text-sm text-primary-color-100"
              >
                Forgot Password?
              </a>
            </div>
            <Button
              type="submit"
              variant="tertiary"
              className="w-full my-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
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
        </div>
      </div>
      <ToastNotification />
    </div>
  );
};

export default Login;
