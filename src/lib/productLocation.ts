import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enLocale);

type AddressLike =
  | {
      city?: string;
      country?: string;
    }
  | null
  | undefined;

function pickAddress(
  seller?: { address?: AddressLike; addresses?: AddressLike[] } | null,
  charity?: { address?: AddressLike; addresses?: AddressLike[] } | null,
): AddressLike {
  const sellerAddr =
    seller?.address ||
    (Array.isArray(seller?.addresses) ? seller.addresses[0] : null);
  const charityAddr =
    charity?.address ||
    (Array.isArray(charity?.addresses) ? charity.addresses[0] : null);
  return sellerAddr || charityAddr || null;
}

/** Build a display location string; returns empty when nothing useful exists. */
export function formatProductLocation(
  seller?: { address?: AddressLike; addresses?: AddressLike[] } | null,
  charity?: { address?: AddressLike; addresses?: AddressLike[] } | null,
): string {
  const address = pickAddress(seller, charity);
  if (!address) return '';

  const parts: string[] = [];
  const city = address.city?.trim();
  if (city) parts.push(city);

  const country = address.country?.trim();
  if (country) {
    const code = countries.getAlpha2Code(country, 'en');
    if (code) parts.push(code);
    else parts.push(country);
  }

  return parts.join(', ');
}

export function hasProductLocation(
  seller?: { address?: AddressLike; addresses?: AddressLike[] } | null,
  charity?: { address?: AddressLike; addresses?: AddressLike[] } | null,
): boolean {
  return formatProductLocation(seller, charity).length > 0;
}
