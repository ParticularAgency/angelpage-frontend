'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from '@/i18n/LocaleProvider';
import type { Locale } from '@/i18n/messages';
import {
  detectBrowserLocale,
  detectIpCountry,
  detectTimezoneCountry,
  hasPrefs,
  markPrefsSeen,
  readCountryCode,
  writeCountry,
  type MarketCountry,
} from '@/lib/marketPreference';

export default function MarketPreferenceDialog() {
  const { setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState<'' | MarketCountry>('');
  const [language, setLanguage] = useState<'' | Locale>('');

  useEffect(() => {
    if (hasPrefs()) return;

    const existingLang = document.cookie.match(
      /(?:^|; )angelpage-locale=(en|fr)/,
    )?.[1] as Locale | undefined;
    const existingCountry = readCountryCode();
    const lang = existingLang || detectBrowserLocale();
    const tzCountry = existingCountry || detectTimezoneCountry();

    if (lang && tzCountry) {
      if (!existingLang) setLocale(lang);
      if (!existingCountry) writeCountry(tzCountry);
      markPrefsSeen();
      return;
    }

    setLanguage(lang || '');
    setCountry(tzCountry || '');
    setOpen(true);

    let cancelled = false;
    detectIpCountry().then(ipCountry => {
      if (cancelled || !ipCountry) return;
      setCountry(current => current || ipCountry);
    });

    return () => {
      cancelled = true;
    };
  }, [setLocale]);

  const close = () => {
    if (language) setLocale(language);
    if (country) writeCountry(country);
    markPrefsSeen();
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10050] flex items-center justify-center bg-[#0B0112]/45 px-4"
      onMouseDown={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="market-pref-title"
        className="w-full max-w-[440px] rounded-3xl bg-white p-6 shadow-[0_24px_60px_rgba(97,17,146,0.18)]"
        onMouseDown={event => event.stopPropagation()}
      >
        <p className="text-[11px] font-semibold tracking-[0.16em] text-[#611192] uppercase">
          Angelpage
        </p>
        <h2
          id="market-pref-title"
          className="mt-2 font-primary text-[28px] leading-tight text-[#0B0112]"
        >
          {t('prefs.title')}
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-[#6B686E]">
          {t('prefs.body')}
        </p>

        <label className="mt-5 block text-[12px] font-medium text-[#3B055C]">
          {t('prefs.country')}
          <span className="ml-1 font-normal text-[#8A888C]">
            {t('prefs.optional')}
          </span>
          <select
            value={country}
            onChange={event =>
              setCountry(event.target.value as '' | MarketCountry)
            }
            className="mt-2 w-full rounded-xl border border-[#E6E3E7] bg-[#FCF2FF] px-3 py-3 text-[14px] text-[#0B0112] outline-none"
          >
            <option value="">{t('prefs.choose')}</option>
            <option value="US">{t('market.unitedStates')}</option>
            <option value="CA">{t('market.canada')}</option>
            <option value="GB">{t('market.unitedKingdom')}</option>
          </select>
        </label>

        <label className="mt-4 block text-[12px] font-medium text-[#3B055C]">
          {t('prefs.language')}
          <span className="ml-1 font-normal text-[#8A888C]">
            {t('prefs.optional')}
          </span>
          <select
            value={language}
            onChange={event =>
              setLanguage(event.target.value as '' | Locale)
            }
            className="mt-2 w-full rounded-xl border border-[#E6E3E7] bg-[#FCF2FF] px-3 py-3 text-[14px] text-[#0B0112] outline-none"
          >
            <option value="">{t('prefs.choose')}</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </label>

        <button
          type="button"
          onClick={close}
          className="mt-6 h-12 w-full rounded-full bg-[#611192] text-[14px] font-semibold text-white"
        >
          {t('prefs.continue')}
        </button>
      </div>
    </div>
  );
}
