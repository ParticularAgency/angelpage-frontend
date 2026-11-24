/** Wilson-approved Angelpage brand tokens — do not change without stakeholder sign-off */

export const BRAND_PRIMARY = '#611192';
export const BRAND_PRIMARY_LIGHT = '#FCF2FF';

/** Share of sale proceeds allocated to charity (confirmed: 90%) */
export const CHARITY_SHARE_PERCENT = 90;
export const CHARITY_SHARE_RATE = CHARITY_SHARE_PERCENT / 100;
export const PLATFORM_FEE_PERCENT = 100 - CHARITY_SHARE_PERCENT;
export const PLATFORM_FEE_RATE = PLATFORM_FEE_PERCENT / 100;

export const formatCharityProfit = (price: number) =>
  (price * CHARITY_SHARE_RATE).toFixed(2);
