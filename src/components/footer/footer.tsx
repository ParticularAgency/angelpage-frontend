'use client';
import React, { useState } from 'react';
import {
  Checkmark,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from '@/icons';
import Link from 'next/link';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { getHomePathForRole } from '@/utils/navigationPaths';
import { Button, Input } from '../elements';

import { ToastService } from '@/components/elements/notifications/ToastService';
import { useLocale } from '@/i18n/LocaleProvider';

const Footer = () => {
  const { data: session } = useSession();
  const { t } = useLocale();
  const homePath = getHomePathForRole(session?.user?.role);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [storeNotice, setStoreNotice] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      ToastService.error(t('footer.emailRequired'));
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/email/subscribe`,
        { email }
      );
      console.log('email subscribed', response);
      if (response.status === 200) {
        ToastService.success(t('footer.subscribedOk'));
        setIsSubscribed(true);
        setEmail('');
      } else {
        ToastService.error(t('footer.already'));
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      ToastService.error(t('footer.already'));
    } finally {
      setLoading(false);
    }
  };

  const handleStoreClick = (store: 'Google Play' | 'the App Store') => {
    const message = `Coming soon. The Angelpage app for ${store} is on the way.`;
    setStoreNotice(message);
    ToastService.info(message);
  };

  return (
    <footer className="footer-section pt-[120px] pb-20 md:pt-20 sm:pb-[127px] sm:pt-[54px] bg-mono-0">
      <div className="custom-container">
        <div className="footer-wrapper">
          <div className="grid grid-cols-12 sm:grid-cols-6 gap-6 sm:gap-0">
            <div className="col-span-3 md:col-span-2 sm:col-span-6 sm:order-2">
              <ul className="quick-link-lists flex flex-col gap-6 sm:gap-0">
                {/* <li className="quick-list-item sm:py-6 sm:text-center sm:font-bold  text-mono-100 font-secondary font-normal leading-[150%] uppercase text-body-caption">
                  <Link href={homePath}>about us</Link>
                </li> */}
                <li className="quick-list-item sm:py-6 sm:text-center sm:font-bold  text-mono-100 font-secondary font-normal leading-[150%] uppercase text-body-caption">
                  <Link href="/how-it-works">{t('footer.howItWorks')}</Link>
                </li>
                {/* <li className="quick-list-item sm:py-6 sm:text-center sm:font-bold  text-mono-100 font-secondary font-normal leading-[150%] uppercase text-body-caption"><Link href="/find-a-charity">Find a charity</Link></li> */}
                <li className="quick-list-item sm:py-6 sm:text-center sm:font-bold  text-mono-100 font-secondary font-normal leading-[150%] uppercase text-body-caption">
                  <Link href="/blog">{t('footer.blog')}</Link>
                </li>
                <li className="quick-list-item sm:py-6 sm:text-center sm:font-bold  text-mono-100 font-secondary font-normal leading-[150%] uppercase text-body-caption">
                  <Link href="/events">{t('footer.events')}</Link>
                </li>
                <li className="quick-list-item sm:py-6 sm:text-center sm:font-bold  text-mono-100 font-secondary font-normal leading-[150%] uppercase text-body-caption">
                  <Link href="/product">{t('footer.products')}</Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-3 sm:col-span-6 sm:order-3">
              <ul className="quick-link-lists quick-link-area-two flex flex-col gap-6 sm:gap-0">
                <li className="quick-list-item sm:py-6 sm:text-center sm:font-bold  text-mono-100 font-secondary font-normal leading-[150%] uppercase text-body-caption">
                  <Link href="/faq">{t('footer.faq')}</Link>
                </li>
                <li className="quick-list-item sm:py-6 sm:text-center sm:font-bold  text-mono-100 font-secondary font-normal leading-[150%] uppercase text-body-caption">
                  <Link href="/privacy-policy">{t('footer.privacy')}</Link>
                </li>
                <li className="quick-list-item sm:py-6 sm:text-center sm:font-bold  text-mono-100 font-secondary font-normal leading-[150%] uppercase text-body-caption">
                  <Link href="/cookie-policy">{t('footer.cookies')}</Link>
                </li>
                <li className="quick-list-item sm:py-6 sm:text-center sm:font-bold  text-mono-100 font-secondary font-normal leading-[150%] uppercase text-body-caption">
                  <Link href="/terms-of-service">{t('footer.terms')}</Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1 sm:col-span-6 sm:order-4">
              <ul className="quick-link-socials-lists sm:mt-10 flex flex-col sm:flex-row sm:gap-5 sm:justify-center gap-6">
                <li className="quick-socials-list-item facebook">
                  <Link href="/">
                    <FacebookIcon />
                  </Link>
                </li>
                <li className="quick-list-item twitter">
                  <Link href="/">
                    <TwitterIcon />
                  </Link>
                </li>
                <li className="quick-list-item instagrame">
                  <Link href="/">
                    <InstagramIcon />
                  </Link>
                </li>
                <li className="quick-list-item linkedin">
                  <Link href="/">
                    <LinkedinIcon />
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-5 md:col-span-6 sm:col-span-6 sm:order-1">
              <div className="footer-cta-info sm:mb-10">
                <h5 className="title text-mono-80 sm:text-center text-body-eyebrow-large font-normal leading-[150%] uppercase tracking-[.7px] font-secondary text-left mb-4">
                  {t('footer.joinTitle')}
                </h5>
                <p className="desc-text text-mono-100 sm:text-center text-body-small font-normal  font-secondary leading-[150%]">
                  {t('footer.joinBody')}
                </p>
                <form
                  className="subscription-form mt-8 w-full"
                  onSubmit={handleSubmit}
                >
                  <div className="form-group-item flex sm:flex-wrap sm:gap-4 items-start gap-2 w-full">
                    <Input
                      type="email"
                      placeholder={t('footer.emailPlaceholder')}
                      label=""
                      name="email"
                      value={email}
                      id="email"
                      className="flex-col w-full"
                      onChange={e => setEmail(e.target.value)}
                      errorMessage="Input cannot be empty"
                    />
                    <Button
                      variant="primary"
                      className="max-w-[149px] w-full sm:max-w-full"
                      type="submit"
                      disabled={loading || isSubscribed}
                    >
                      {loading ? (
                        t('footer.submitting')
                      ) : isSubscribed ? (
                        <>
                          {t('footer.subscribed')} <Checkmark />
                        </>
                      ) : (
                        t('footer.subscribe')
                      )}
                    </Button>
                  </div>
                </form>
                <div className="mt-6 flex flex-wrap gap-3 sm:justify-center">
                  <button
                    type="button"
                    onClick={() => handleStoreClick('Google Play')}
                    className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#0B0112] px-3 text-left text-white!"
                    aria-label="Google Play, coming soon"
                  >
                    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                      <path fill="#34A853" d="M3 20.5 13.5 12 3 3.5v17z" />
                      <path
                        fill="#FBBC04"
                        d="M16.2 14.8 13.5 12l2.7-2.8 4.2 2.4c.8.5.8 1.3 0 1.8l-4.2 2.4z"
                      />
                      <path
                        fill="#4285F4"
                        d="M3 3.5 13.5 12l2.7-2.8L5.2 2.1A1.5 1.5 0 0 0 3 3.5z"
                      />
                      <path
                        fill="#EA4335"
                        d="M13.5 12 3 20.5a1.5 1.5 0 0 0 2.2 1.4l11-6.3L13.5 12z"
                      />
                    </svg>
                    <span className="leading-tight">
                      <span className="block text-[9px] uppercase tracking-wide text-white/80!">
                        Get it on
                      </span>
                      <span className="block text-sm font-medium text-white!">
                        Google Play
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStoreClick('the App Store')}
                    className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#0B0112] px-3 text-left text-white!"
                    aria-label="App Store, coming soon"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-6 w-6 fill-white"
                      aria-hidden
                    >
                      <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8s-1.9-0.8-3.1-.8c-1.6 0-3.1 1-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.7 2.5 3 2.4 1.2 0 1.6-.7 3-.7s1.8.7 3.1.7 2-.1 2.9-2.4c.7-1 1.2-2.1 1.5-3.2-3.9-1.5-3.8-5.4-1.8-6.5z" />
                      <path d="M14.2 6.2c.6-.8 1.1-1.9.9-3-1 .1-2.1.6-2.8 1.4-.6.7-1.2 1.8-.9 2.9 1.1.1 2.1-.5 2.8-1.3z" />
                    </svg>
                    <span className="leading-tight">
                      <span className="block text-[9px] uppercase tracking-wide text-white/80!">
                        Download on the
                      </span>
                      <span className="block text-sm font-medium text-white!">
                        App Store
                      </span>
                    </span>
                  </button>
                </div>
                {storeNotice ? (
                  <p className="mt-3 text-sm text-[#611192] sm:text-center">
                    {storeNotice}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <p className="text-mono-70 text-xs text-center mt-10 pt-6 border-t border-mono-40">
          {t('footer.support')}:{' '}
          <Link
            href="/contact"
            className="underline hover:text-primary-color-100"
          >
            {t('footer.contact')}
          </Link>
          {' · '}
          <Link
            href="/how-it-works"
            className="underline hover:text-primary-color-100"
          >
            {t('footer.howItWorks')}
          </Link>
          {' · '}
          <Link
            href="/admin/login"
            className="underline hover:text-primary-color-100"
          >
            {t('footer.admin')}
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
