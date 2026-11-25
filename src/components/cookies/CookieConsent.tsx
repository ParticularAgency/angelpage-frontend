'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocale } from '@/i18n/LocaleProvider';
import {
  COOKIE_CONSENT_EVENT,
  readCookieConsent,
  writeCookieConsent,
  type CookieChoices,
} from '@/lib/cookieConsent';

function CookieIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#ffffff"
        d="M12 2a1 1 0 0 1 .95.68 2.4 2.4 0 0 0 3.2 1.55 1 1 0 0 1 1.28.4 2.4 2.4 0 0 0 2.94 1.05 1 1 0 0 1 1.22.95A10 10 0 1 1 12 2Z"
      />
      <circle cx="9" cy="11" r="1.15" fill="#611192" />
      <circle cx="13" cy="15.2" r="1.15" fill="#611192" />
      <circle cx="15.3" cy="10.2" r="0.9" fill="#611192" />
    </svg>
  );
}

function Toggle({
  checked,
  disabled,
  label,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange?: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
        checked ? 'bg-[#611192]' : 'bg-[#E4D0F0]'
      } ${disabled ? 'cursor-default opacity-80' : ''}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function CookieConsent() {
  const { t } = useLocale();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [savedNote, setSavedNote] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const saved = readCookieConsent();
    if (saved) {
      setAnalytics(saved.analytics);
      setMarketing(saved.marketing);
      setOpen(false);
    } else {
      setOpen(true);
    }
    setReady(true);

    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<CookieChoices>).detail;
      if (!detail) return;
      setAnalytics(detail.analytics);
      setMarketing(detail.marketing);
      setCustomize(false);
      setOpen(false);
    };
    window.addEventListener(COOKIE_CONSENT_EVENT, onChange);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onChange);
  }, []);

  const save = (next: { analytics: boolean; marketing: boolean }) => {
    setAnalytics(next.analytics);
    setMarketing(next.marketing);
    writeCookieConsent(next);
    setSavedNote(true);
    setOpen(false);
    setCustomize(false);
  };

  return (
    <>
      <button
        type="button"
        aria-label={t('cookies.open')}
        aria-expanded={open}
        onClick={() => {
          setOpen(value => !value);
          setSavedNote(false);
        }}
        className="fixed bottom-20 left-5 z-[1000] flex h-14 w-14 items-center justify-center rounded-full bg-[#611192] text-white! shadow-[0_10px_24px_rgba(97,17,146,0.35)] hover:bg-[#3B055C] sm:bottom-24 sm:left-4"
      >
        <CookieIcon />
      </button>

      {ready && open ? (
        <aside
          role="dialog"
          aria-labelledby="cookie-consent-title"
          className="fixed z-[1000] right-5 top-1/2 w-[min(380px,calc(100vw-96px))] -translate-y-1/2 rounded-3xl border border-[#E4D0F0] bg-white p-5 shadow-[0_18px_50px_rgba(11,1,18,0.16)] sm:right-4 sm:bottom-44 sm:left-20 sm:top-auto sm:w-auto sm:max-h-[70vh] sm:translate-y-0 sm:overflow-y-auto"
        >
          <p className="font-secondary text-xs font-medium uppercase tracking-[0.14em] text-[#611192]">
            Angelpage
          </p>
          <h2
            id="cookie-consent-title"
            className="font-primary mt-1 text-[28px] leading-none text-[#0B0112]"
          >
            {t('cookies.title')}
          </h2>
          <p className="font-secondary mt-3 text-sm leading-6 text-[#3B055C]">
            {t('cookies.body')}
          </p>

          {customize ? (
            <div className="mt-4 flex flex-col gap-3">
              <Choice
                title={t('cookies.necessary')}
                body={t('cookies.necessaryBody')}
                badge={t('cookies.alwaysOn')}
                checked
                disabled
              />
              <Choice
                title={t('cookies.analytics')}
                body={t('cookies.analyticsBody')}
                checked={analytics}
                onChange={setAnalytics}
              />
              <Choice
                title={t('cookies.marketing')}
                body={t('cookies.marketingBody')}
                checked={marketing}
                onChange={setMarketing}
              />
            </div>
          ) : null}

          <div className="mt-5 flex flex-col gap-2">
            {customize ? (
              <button
                type="button"
                className="btn-styles primary-btn w-full"
                onClick={() => save({ analytics, marketing })}
              >
                {t('cookies.save')}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-styles primary-btn w-full"
                  onClick={() => save({ analytics: true, marketing: true })}
                >
                  {t('cookies.accept')}
                </button>
                <button
                  type="button"
                  className="btn-styles secondary-btn w-full"
                  onClick={() => save({ analytics: false, marketing: false })}
                >
                  {t('cookies.reject')}
                </button>
                <button
                  type="button"
                  className="btn-styles accent-btn w-full"
                  onClick={() => setCustomize(true)}
                >
                  {t('cookies.customize')}
                </button>
              </>
            )}
          </div>

          {savedNote ? (
            <p className="font-secondary mt-3 text-sm text-[#3B055C]">
              {t('cookies.saved')}
            </p>
          ) : null}

          <p className="font-secondary mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <Link href="/cookie-policy" className="text-[#611192] underline">
              {t('cookies.policy')}
            </Link>
            <Link href="/cookie-settings" className="text-[#611192] underline">
              {t('cookies.settings')}
            </Link>
          </p>
        </aside>
      ) : null}
    </>
  );
}

function Choice({
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
    <div className="flex items-start justify-between gap-3 rounded-2xl bg-[#FCF2FF] px-3 py-3">
      <div>
        <p className="font-secondary text-sm font-medium text-[#0B0112]">
          {title}
          {badge ? (
            <span className="ml-2 text-xs font-normal text-[#611192]">
              {badge}
            </span>
          ) : null}
        </p>
        <p className="font-secondary mt-1 text-xs leading-5 text-[#3B055C]">
          {body}
        </p>
      </div>
      <Toggle
        checked={checked}
        disabled={disabled}
        label={title}
        onChange={onChange}
      />
    </div>
  );
}
