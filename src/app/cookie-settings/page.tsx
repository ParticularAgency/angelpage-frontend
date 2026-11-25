import type { Metadata } from 'next';
import Link from 'next/link';
import CookieSettingsForm from '@/components/cookies/CookieSettingsForm';
import { pageMetadata } from '@/lib/siteSeo';

export const metadata: Metadata = pageMetadata({
  title: 'Cookie settings',
  description:
    'Choose which Angelpage cookies to allow. Necessary cookies stay on. Analytics and marketing cookies are optional.',
  path: '/cookie-settings',
  keywords: ['Angelpage cookie settings', 'cookie consent'],
});

export default function CookieSettingsPage() {
  return (
    <div className="term-page-main-wrapper">
      <div className="custom-container">
        <div className="term-page-main-content">
          <div className="terms-page-banner pt-20 pb-10 sm:py-14">
            <h1 className="font-primary text-center text-[40px] font-normal text-[#0B0112] sm:text-[32px]">
              Cookie settings
            </h1>
            <p className="font-secondary mx-auto mt-4 max-w-2xl text-center text-base leading-7 text-[#3B055C]">
              Necessary cookies keep the shop working. Analytics and marketing
              cookies run only when you turn them on. The same choices are in
              the panel opened by the cookie button at the bottom left.
            </p>
          </div>
          <div className="pb-20">
            <CookieSettingsForm />
            <p className="font-secondary mx-auto mt-6 max-w-3xl text-sm text-[#3B055C]">
              Read the{' '}
              <Link href="/cookie-policy" className="text-[#611192] underline">
                cookie policy
              </Link>{' '}
              for the list of cookies and what each one does.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
