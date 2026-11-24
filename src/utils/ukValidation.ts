const LAUNCH_ALIASES = new Set([
  'us',
  'usa',
  'united states',
  'united states of america',
  'canada',
  'ca',
  'united kingdom',
  'uk',
  'great britain',
  'gb',
  'england',
  'scotland',
  'wales',
  'northern ireland',
]);

export const isLaunchCountry = (country?: string) => {
  if (!country) return false;
  return LAUNCH_ALIASES.has(country.trim().toLowerCase());
};

/** Kept name so existing checkout and account forms keep compiling. */
export const isUkCountry = isLaunchCountry;

export const DEFAULT_COUNTRY = 'United States';
export const UK_DEFAULT_COUNTRY = DEFAULT_COUNTRY;

export const toStripeCountryCode = (country?: string): string => {
  if (!country) return 'US';
  const normalized = country.trim().toLowerCase();
  if (normalized === 'canada' || normalized === 'ca') return 'CA';
  if (
    normalized === 'united kingdom' ||
    normalized === 'uk' ||
    normalized === 'great britain' ||
    normalized === 'gb' ||
    normalized === 'england' ||
    normalized === 'scotland' ||
    normalized === 'wales' ||
    normalized === 'northern ireland'
  ) {
    return 'GB';
  }
  if (
    normalized === 'us' ||
    normalized === 'usa' ||
    normalized === 'united states' ||
    normalized === 'united states of america'
  ) {
    return 'US';
  }
  if (country.trim().length === 2) {
    return country.trim().toUpperCase();
  }
  return 'US';
};

export const checkoutCurrency = (country?: string) => {
  const code = toStripeCountryCode(country);
  if (code === 'CA') return 'cad';
  if (code === 'GB') return 'gbp';
  return 'usd';
};

export const getAddressPostcode = (address?: {
  postcode?: string;
  postCode?: string;
}) => (address?.postcode || address?.postCode || '').trim();
