export const COUNTRY_COOKIE = 'angelpage-country';
export const PREFS_COOKIE = 'angelpage-market-prefs';

export type MarketCountry = 'US' | 'CA' | 'GB';

const US_ZONES = new Set([
  'America/New_York',
  'America/Detroit',
  'America/Kentucky/Louisville',
  'America/Kentucky/Monticello',
  'America/Indiana/Indianapolis',
  'America/Indiana/Vincennes',
  'America/Indiana/Winamac',
  'America/Indiana/Marengo',
  'America/Indiana/Petersburg',
  'America/Indiana/Vevay',
  'America/Chicago',
  'America/Indiana/Knox',
  'America/Indiana/Tell_City',
  'America/Menominee',
  'America/Denver',
  'America/Boise',
  'America/Phoenix',
  'America/Los_Angeles',
  'America/Anchorage',
  'America/Juneau',
  'America/Sitka',
  'America/Metlakatla',
  'America/Yakutat',
  'America/Nome',
  'America/Adak',
  'Pacific/Honolulu',
]);

const CA_ZONES = new Set([
  'America/Toronto',
  'America/Vancouver',
  'America/Edmonton',
  'America/Winnipeg',
  'America/Halifax',
  'America/St_Johns',
  'America/Regina',
  'America/Moncton',
  'America/Goose_Bay',
  'America/Blanc-Sablon',
  'America/Glace_Bay',
  'America/Iqaluit',
  'America/Rankin_Inlet',
  'America/Resolute',
  'America/Cambridge_Bay',
  'America/Yellowknife',
  'America/Inuvik',
  'America/Dawson',
  'America/Dawson_Creek',
  'America/Fort_Nelson',
  'America/Whitehorse',
  'America/Atikokan',
  'America/Thunder_Bay',
  'America/Nipigon',
  'America/Rainy_River',
  'America/Swift_Current',
  'America/Creston',
]);

export function countryName(code: MarketCountry) {
  if (code === 'CA') return 'Canada';
  if (code === 'GB') return 'United Kingdom';
  return 'United States';
}

export function readCountryCode(): MarketCountry | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COUNTRY_COOKIE}=(US|CA|GB)`),
  );
  if (match?.[1] === 'CA') return 'CA';
  if (match?.[1] === 'GB') return 'GB';
  if (match?.[1] === 'US') return 'US';
  return null;
}

export function preferredCountryName() {
  const code = readCountryCode();
  return code ? countryName(code) : 'United States';
}

export function preferredCurrency() {
  const code = readCountryCode();
  if (code === 'CA') return 'CAD';
  if (code === 'GB') return 'GBP';
  return 'USD';
}

export function formatMarketMoney(amount: number, locale: 'en' | 'fr' = 'en') {
  const currency = preferredCurrency();
  const numberLocale =
    currency === 'GBP' ? 'en-GB' : locale === 'fr' ? 'fr-CA' : 'en-US';
  return new Intl.NumberFormat(numberLocale, {
    style: 'currency',
    currency: preferredCurrency(),
  }).format(amount || 0);
}

export function writeCountry(code: MarketCountry) {
  document.cookie = `${COUNTRY_COOKIE}=${code}; path=/; max-age=31536000; samesite=lax`;
}

export function markPrefsSeen() {
  document.cookie = `${PREFS_COOKIE}=1; path=/; max-age=31536000; samesite=lax`;
}

export function hasPrefs() {
  if (typeof document === 'undefined') return true;
  return document.cookie.includes(`${PREFS_COOKIE}=1`);
}

export function detectBrowserLocale(): 'en' | 'fr' | null {
  const list =
    typeof navigator !== 'undefined' && navigator.languages?.length
      ? navigator.languages
      : [typeof navigator !== 'undefined' ? navigator.language : ''];
  for (const code of list) {
    const base = (code || '').toLowerCase().split('-')[0];
    if (base === 'fr') return 'fr';
    if (base === 'en') return 'en';
  }
  return null;
}

export function detectTimezoneCountry(): MarketCountry | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (CA_ZONES.has(tz)) return 'CA';
    if (tz === 'Europe/London') return 'GB';
    if (US_ZONES.has(tz)) return 'US';
  } catch {
    return null;
  }
  return null;
}

export async function detectIpCountry(): Promise<MarketCountry | null> {
  try {
    const res = await Promise.race([
      fetch('https://ipwho.is/'),
      new Promise<Response>((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), 2500);
      }),
    ]);
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.country_code === 'CA') return 'CA';
    if (data?.country_code === 'GB') return 'GB';
    if (data?.country_code === 'US') return 'US';
    return null;
  } catch {
    return null;
  }
}
