export const COOKIE_CONSENT_KEY = 'angelpage-cookie-consent';
export const COOKIE_CONSENT_EVENT = 'angelpage-cookie-consent';

export type CookieChoices = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

type ConsentUpdate = {
  analytics: boolean;
  marketing: boolean;
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function readCookieConsent(): CookieChoices | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieChoices>;
    if (typeof parsed.analytics !== 'boolean') return null;
    return {
      necessary: true,
      analytics: parsed.analytics,
      marketing: Boolean(parsed.marketing),
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function applyGoogleConsent(choices: ConsentUpdate) {
  if (typeof window === 'undefined') return;
  const analytics = choices.analytics ? 'granted' : 'denied';
  const ads = choices.marketing ? 'granted' : 'denied';
  window.dataLayer = window.dataLayer || [];
  window.gtag?.('consent', 'update', {
    analytics_storage: analytics,
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  });
}

export function writeCookieConsent(choices: ConsentUpdate) {
  const value: CookieChoices = {
    necessary: true,
    analytics: choices.analytics,
    marketing: choices.marketing,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(value));
  applyGoogleConsent(value);
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_EVENT, { detail: value })
  );
  return value;
}
