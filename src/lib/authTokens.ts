import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** Refresh access token when within this window of expiry (ms). */
export const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;

export type RefreshedTokens = {
  accessToken: string;
  refreshToken: string;
};

export const decodeJwtExpiry = (token: string): number | null => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf8')
    );
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    try {
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString('utf8')
      );
      return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }
};

export const isAccessTokenExpiringSoon = (
  accessToken: string | undefined,
  bufferMs = TOKEN_REFRESH_BUFFER_MS
): boolean => {
  if (!accessToken) return true;
  const expiresAt = decodeJwtExpiry(accessToken);
  if (!expiresAt) return false;
  return Date.now() >= expiresAt - bufferMs;
};

export const isAccessTokenExpired = (accessToken: string | undefined): boolean => {
  if (!accessToken) return true;
  const expiresAt = decodeJwtExpiry(accessToken);
  if (!expiresAt) return false;
  return Date.now() >= expiresAt;
};

export const refreshBackendTokens = async (
  refreshToken: string
): Promise<RefreshedTokens> => {
  const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
  return {
    accessToken: res.data.token as string,
    refreshToken: (res.data.refreshToken as string) || refreshToken,
  };
};
