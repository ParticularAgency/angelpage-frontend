/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it } from 'vitest';
import {
  COOKIE_CONSENT_KEY,
  readCookieConsent,
  writeCookieConsent,
} from '@/lib/cookieConsent';

describe('cookie consent', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts with no saved choice', () => {
    expect(readCookieConsent()).toBeNull();
  });

  it('saves analytics and marketing separately from necessary cookies', () => {
    writeCookieConsent({ analytics: true, marketing: false });
    const saved = readCookieConsent();
    expect(saved).toMatchObject({
      necessary: true,
      analytics: true,
      marketing: false,
    });
    expect(window.localStorage.getItem(COOKIE_CONSENT_KEY)).toContain(
      '"analytics":true'
    );
  });
});
