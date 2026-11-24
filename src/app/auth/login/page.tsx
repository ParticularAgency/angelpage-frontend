'use client';
import { signIn, useSession } from 'next-auth/react';
import { Button, Input } from '@/components/elements';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProviders } from 'next-auth/react';
import  {
  ToastService,
} from '@/components/elements/notifications/ToastService';
import CaptchaWidget from '@/components/auth/CaptchaWidget';

const Login = () => {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeRole, setActiveRole] = useState('USER'); // State to manage selected role
  const [oauthProviders, setOauthProviders] = useState<string[]>([]);
  const [captchaToken, setCaptchaToken] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
 const callbackUrl = searchParams?.get('callbackUrl') || '/';

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
        `${provider === 'google' ? 'Google' : 'Facebook'} login is not set up yet. Please use email and password.`
      );
      return;
    }

    try {
      await fetch('/api/auth/oauth-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: activeRole }),
      });
    } catch {
      /* continue */
    }

    signIn(provider, { callbackUrl: callbackUrl || '/' });
  };

  useEffect(() => {
    const emailParam = searchParams?.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      role: activeRole,
      captchaToken,
      callbackUrl: callbackUrl || '/',
    });

    if (result?.error) {
      let errorMessage = result.error;

      if (result.error === 'CredentialsSignin') {
        errorMessage =
          activeRole === 'CHARITY'
            ? 'Invalid email or password. Charity owners and staff both use Charity/Brand login.'
            : 'Invalid email or password. Please try again.';
      }
      setError(errorMessage);
      ToastService.error(errorMessage);
      setIsSubmitting(false);
      return;
    }

    ToastService.success('Login successful! Redirecting...');
    router.push(callbackUrl || '/');
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (session?.user?.role && session?.user?.id) {
      const userRole = session.user.role;
      // ToastService.success('Login successful! Redirecting to account...');
      setTimeout(() => {
        if (userRole === 'USER' || userRole === 'CHARITY') {
          router.push(`/`);
        } else if (userRole === 'CHARITY_STAFF') {
          const charityId = (session?.user as { charityId?: string })?.charityId;
          router.push(
            charityId ? `/charity/account/${charityId}` : `/`
          );
        }
      }, 2000);
    }
  }, [session, router]);

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

      <div className="w-1/2 md:w-full md:flex sm:order-1 md:justify-center md:px-10 pt-[103px] sm:pt-14 sm:pb-20 pb-[260px] md:pb-[160px]">
        <div className="w-full max-w-md">
          <h4 className="text-center mb-[18px]">Login</h4>

          <div className="flex space-x-2 justify-center mb-[54px] sm:mb-9">
            <button
              className={`p-2 text-body-small rounded-3xl ${
                activeRole === 'USER'
                  ? 'bg-[#FAF2FF] text-primary-color-100 font-semibold'
                  : 'bg-transparent text-mono-100'
              }`}
              onClick={() => setActiveRole('USER')}
            >
              Individual
            </button>
            <button
              className={`text-body-small p-2 rounded-3xl ${
                activeRole === 'CHARITY'
                  ? 'bg-[#FAF2FF] text-primary-color-100 font-semibold'
                  : 'bg-transparent text-mono-100'
              }`}
              onClick={() => setActiveRole('CHARITY')}
            >
              Charity/Brand
            </button>
          </div>
          {activeRole === 'CHARITY' && (
            <p className="text-center body-caption text-mono-70 mb-4 -mt-6">
              Owners and staff use this same login. Staff access is set by your charity admin.
            </p>
          )}
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
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>

            {activeRole === 'USER' || activeRole === 'CHARITY' ? (
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
            ) : null}

            <p className="text-body-small mt-6">
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
    </div>
  );
};

export default Login;
