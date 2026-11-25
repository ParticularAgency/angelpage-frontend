'use client';

import { useEffect, useState } from 'react';
import { useLocale } from '@/i18n/LocaleProvider';
import {
  COOKIE_CONSENT_EVENT,
  readCookieConsent,
  writeCookieConsent,
  type CookieChoices,
} from '@/lib/cookieConsent';

export default function CookieSettingsForm() {
  const { t } = useLocale();
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const current = readCookieConsent();
    if (current) {
      setAnalytics(current.analytics);
      setMarketing(current.marketing);
    }
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<CookieChoices>).detail;
      if (!detail) return;
      setAnalytics(detail.analytics);
      setMarketing(detail.marketing);
    };
    window.addEventListener(COOKIE_CONSENT_EVENT, onChange);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onChange);
  }, []);

  return (
    <form
      className="mx-auto max-w-3xl rounded-3xl border border-[#E4D0F0] bg-white p-6 sm:p-4"
      onSubmit={event => {
        event.preventDefault();
        writeCookieConsent({ analytics, marketing });
        setSaved(true);
      }}
    >
      <Setting
        title={t('cookies.necessary')}
        body={t('cookies.necessaryBody')}
        badge={t('cookies.alwaysOn')}
        checked
        disabled
      />
      <Setting
        title={t('cookies.analytics')}
        body={t('cookies.analyticsBody')}
        checked={analytics}
        onChange={setAnalytics}
      />
      <Setting
        title={t('cookies.marketing')}
        body={t('cookies.marketingBody')}
        checked={marketing}
        onChange={setMarketing}
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" className="btn-styles primary-btn">
          {t('cookies.save')}
        </button>
        <button
          type="button"
          className="btn-styles secondary-btn"
          onClick={() => {
            setAnalytics(true);
            setMarketing(true);
            writeCookieConsent({ analytics: true, marketing: true });
            setSaved(true);
          }}
        >
          {t('cookies.accept')}
        </button>
        <button
          type="button"
          className="btn-styles accent-btn"
          onClick={() => {
            setAnalytics(false);
            setMarketing(false);
            writeCookieConsent({ analytics: false, marketing: false });
            setSaved(true);
          }}
        >
          {t('cookies.reject')}
        </button>
      </div>
      {saved ? (
        <p className="font-secondary mt-4 text-sm text-[#3B055C]">
          {t('cookies.saved')}
        </p>
      ) : null}
    </form>
  );
}

function Setting({
  title,
  body,
  badge,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  body: string;
  badge?: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (next: boolean) => void;
}) {
  return (
    <label className="mt-4 flex items-start justify-between gap-4 rounded-2xl bg-[#FCF2FF] px-4 py-4 first:mt-0">
      <span>
        <span className="font-secondary block text-base font-medium text-[#0B0112]">
          {title}
          {badge ? (
            <span className="ml-2 text-sm font-normal text-[#611192]">
              {badge}
            </span>
          ) : null}
        </span>
        <span className="font-secondary mt-1 block text-sm leading-6 text-[#3B055C]">
          {body}
        </span>
      </span>
      <input
        type="checkbox"
        className="mt-1 h-5 w-5 accent-[#611192]"
        checked={checked}
        disabled={disabled}
        onChange={event => onChange?.(event.target.checked)}
      />
    </label>
  );
}
