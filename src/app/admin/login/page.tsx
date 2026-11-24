'use client';
import { signIn, useSession, getProviders, getSession } from 'next-auth/react';
import { Button, Input } from '@/components/elements';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastService } from '@/components/elements/notifications/ToastService';
import { isAdminRole } from '@/constants/adminPanels';
import CaptchaWidget from '@/components/auth/CaptchaWidget';
import FullScreenLoader from '@/components/common/loading/FullScreenLoader';

const waitForAdminSession = async (maxAttempts = 8) => {
  for (let i = 0; i < maxAttempts; i += 1) {
    const session = await getSession();
    if (session?.user?.id && isAdminRole(session.user.role)) {
      return session;
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  return null;
};

const Login = () => {
  const { data: session, status } = useSession() || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeRole, setActiveRole] = useState('ADMIN');
  const [oauthProviders, setOauthProviders] = useState<string[]>([]);
  const [captchaToken, setCaptchaToken] = useState('');
  const router = useRouter();

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
        `${provider === 'google' ? 'Google' : 'Facebook'} login is not set up yet.`
      );
      return;
    }
    try {
      await fetch('/api/auth/oauth-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'ADMIN' }),
      });
    } catch {
      /* continue */
    }
    signIn(provider, { callbackUrl: '/admin' });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        role: activeRole,
        ...(captchaToken ? { captchaToken } : {}),
      });

      if (result?.error) {
        let errorMessage = result.error;

        if (result.error === 'CredentialsSignin') {
          errorMessage = 'Invalid email or password. Please try again.';
        }
        setError(errorMessage);
        ToastService.error(errorMessage);
        return;
      }

      const updatedSession = await waitForAdminSession();

      if (updatedSession?.user?.role && updatedSession.user.id) {
        ToastService.success('Login successful! Redirecting...');
        router.push('/admin');
        return;
      }

      const message =
        'Login succeeded but the admin session could not be loaded. Please try again.';
      setError(message);
      ToastService.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role && session?.user?.id && isAdminRole(session.user.role)) {
      router.replace('/admin');
    }
  }, [session, router]);

  if (status === 'loading') {
    return <FullScreenLoader />;
  }
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
          <h4 className="text-center mb-[18px]">Admin team login</h4>
          <p className="text-center body-caption text-mono-70 mb-6 max-w-sm mx-auto">
            Super Admin, Operations, Content, and Finance roles all use this
            page. Sub-admins are created by Super Admin under the Team tab.
          </p>

          <div className="flex space-x-2 justify-center mb-[54px] sm:mb-9">
            <button
              type="button"
              className={`p-2 text-body-small rounded-3xl ${
                activeRole === 'ADMIN'
                  ? 'bg-[#FAF2FF] text-primary-color-100 font-semibold'
                  : 'bg-transparent text-mono-100'
              }`}
              onClick={() => setActiveRole('ADMIN')}
            >
              Admin team
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

            {oauthProviders.length > 0 && (
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

            <p className="text-body-small mt-6 text-mono-80">
              Admin accounts are provisioned by a Super Admin (Team panel) or
              bootstrap seed — public registration is disabled.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
