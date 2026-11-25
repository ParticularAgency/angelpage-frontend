import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '@/lib/siteSeo';

export const metadata: Metadata = pageMetadata({
  title: 'Cookie policy',
  description:
    'How Angelpage uses necessary, analytics, and marketing cookies, and how to change your choice.',
  path: '/cookie-policy',
  keywords: ['Angelpage cookies', 'cookie policy', 'Google Analytics'],
});

export const revalidate = 86_400;

export default function CookiePolicyPage() {
  return (
    <div className="term-page-main-wrapper">
      <div className="custom-container">
        <div className="term-page-main-content">
          <div className="terms-page-banner pt-20 pb-[72px] sm:py-14">
            <h1 className="font-primary text-center text-[40px] font-normal text-[#0B0112] sm:text-[32px]">
              Cookie policy
            </h1>
            <p className="font-secondary mx-auto mt-4 max-w-2xl text-center text-base leading-7 text-[#3B055C]">
              Angelpage uses cookies to run the charity marketplace. Analytics
              and marketing cookies stay off until you allow them.
            </p>
          </div>
          <div className="terms-page-content-area pb-[66px]">
            <section className="term-info-item">
              <h2 className="font-primary text-[28px] text-[#0B0112]">
                What a cookie is
              </h2>
              <p className="font-secondary mt-3 text-base leading-7 text-[#3B055C]">
                A cookie is a small file stored in your browser. Angelpage also
                uses similar storage, such as local storage, for the same kinds
                of choices. This policy covers the website at angelpage.shop.
              </p>
            </section>

            <section className="term-info-item mt-10">
              <h2 className="font-primary text-[28px] text-[#0B0112]">
                The cookies we use
              </h2>
              <div className="mt-4 overflow-x-auto rounded-3xl border border-[#E4D0F0]">
                <table className="w-full min-w-[640px] border-collapse text-left">
                  <thead className="bg-[#FCF2FF]">
                    <tr>
                      <th className="font-secondary px-4 py-3 text-sm text-[#0B0112]">
                        Name
                      </th>
                      <th className="font-secondary px-4 py-3 text-sm text-[#0B0112]">
                        Type
                      </th>
                      <th className="font-secondary px-4 py-3 text-sm text-[#0B0112]">
                        Purpose
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-secondary text-sm text-[#3B055C]">
                    <tr className="border-t border-[#F2E8F8]">
                      <td className="px-4 py-3">angelpage-cookie-consent</td>
                      <td className="px-4 py-3">Necessary</td>
                      <td className="px-4 py-3">
                        Remembers the cookie choice you make.
                      </td>
                    </tr>
                    <tr className="border-t border-[#F2E8F8]">
                      <td className="px-4 py-3">angelpage-locale</td>
                      <td className="px-4 py-3">Necessary</td>
                      <td className="px-4 py-3">
                        Remembers English or French.
                      </td>
                    </tr>
                    <tr className="border-t border-[#F2E8F8]">
                      <td className="px-4 py-3">angelpage-country</td>
                      <td className="px-4 py-3">Necessary</td>
                      <td className="px-4 py-3">
                        Remembers the United States, Canada, or the United
                        Kingdom.
                      </td>
                    </tr>
                    <tr className="border-t border-[#F2E8F8]">
                      <td className="px-4 py-3">Sign-in session</td>
                      <td className="px-4 py-3">Necessary</td>
                      <td className="px-4 py-3">
                        Keeps you signed in and protects checkout.
                      </td>
                    </tr>
                    <tr className="border-t border-[#F2E8F8]">
                      <td className="px-4 py-3">_ga, _ga_*</td>
                      <td className="px-4 py-3">Analytics</td>
                      <td className="px-4 py-3">
                        Google Analytics 4, measurement ID G-Z789BPWQED, only
                        after you allow analytics.
                      </td>
                    </tr>
                    <tr className="border-t border-[#F2E8F8]">
                      <td className="px-4 py-3">Google Tag Manager</td>
                      <td className="px-4 py-3">Analytics</td>
                      <td className="px-4 py-3">
                        Container GTM-WP5JZ5K5. Tags that measure or advertise
                        follow your analytics and marketing choices.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="term-info-item mt-10">
              <h2 className="font-primary text-[28px] text-[#0B0112]">
                Your choice
              </h2>
              <p className="font-secondary mt-3 text-base leading-7 text-[#3B055C]">
                Necessary cookies are always on because the shop cannot run
                without them. Analytics and marketing cookies start off. Use
                Accept all, Reject optional, or Customize on the consent panel.
                You can reopen that panel from the cookie button at the bottom
                left of any page, or change the same choices on the cookie
                settings page.
              </p>
              <p className="font-secondary mt-4 flex flex-wrap gap-4 text-base">
                <Link
                  href="/cookie-settings"
                  className="text-[#611192] underline"
                >
                  Cookie settings
                </Link>
                <Link
                  href="/privacy-policy"
                  className="text-[#611192] underline"
                >
                  Privacy policy
                </Link>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
