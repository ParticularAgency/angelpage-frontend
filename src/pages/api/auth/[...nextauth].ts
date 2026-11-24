import type { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import axios from 'axios';
import {
  isAccessTokenExpiringSoon,
  refreshBackendTokens,
} from '@/lib/authTokens';

interface Credentials {
  email: string;
  password: string;
  role: string;
  captchaToken?: string;
}

interface LoginResponse {
  user: {
    _id: string;
    role: string;
    name?: string;
    email?: string;
    charityId?: string;
    staffRole?: string;
    permissions?: string[];
  };
  token: string;
  refreshToken: string;
}

interface ExtendedUser extends NextAuthUser {
  _id: string;
  role: string;
  token: string;
  refreshToken: string;
  charityId?: string;
  staffRole?: string;
  permissions?: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const parseCookieHeader = (cookieHeader?: string): Record<string, string> => {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map(part => part.trim())
      .filter(Boolean)
      .map(part => {
        const eq = part.indexOf('=');
        if (eq === -1) return [part, ''];
        const key = part.slice(0, eq);
        const value = part.slice(eq + 1);
        try {
          return [key, decodeURIComponent(value)];
        } catch {
          return [key, value];
        }
      })
  );
};

const buildAuthOptions = (req?: NextApiRequest): NextAuthOptions => ({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
        captchaToken: { label: 'Captcha', type: 'text' },
      },
      async authorize(credentials: Partial<Credentials> | undefined) {
        if (!credentials?.email || !credentials.password || !credentials.role) {
          throw new Error('Email, password, and role are required');
        }

        try {
          const res = await axios.post<LoginResponse>(
            `${API_URL}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
              role: credentials.role,
              ...(credentials.captchaToken
                ? { captchaToken: credentials.captchaToken }
                : {}),
            }
          );

          if (res.data) {
            const { user, token, refreshToken } = res.data;
            return {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              charityId: user.charityId,
              staffRole: user.staffRole,
              permissions: user.permissions,
              token,
              refreshToken,
            };
          }
          return null;
        } catch (error) {
          console.error('Login error:', error);
          if (axios.isAxiosError(error) && error.response?.data?.message) {
            throw new Error(String(error.response.data.message));
          }
          throw new Error('Invalid email or password');
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
      ? [
          FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            authorization: { params: { scope: 'email public_profile' } },
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (
        account?.provider === 'google' ||
        account?.provider === 'facebook'
      ) {
        try {
          const cookieMap = parseCookieHeader(req?.headers?.cookie);
          const intendedRole = cookieMap.oauth_intent || 'USER';

          const res = await axios.post(`${API_URL}/auth/oauth`, {
            email: user.email,
            name: user.name,
            image: user.image,
            provider: account.provider,
            providerId: account.providerAccountId,
            intendedRole,
          });
          const extended = user as ExtendedUser;
          user.id = res.data.user._id;
          extended.id = res.data.user._id;
          extended._id = res.data.user._id;
          extended.token = res.data.token;
          extended.refreshToken = res.data.refreshToken;
          extended.role = res.data.user.role;
          extended.charityId = res.data.user.charityId;
          extended.staffRole = res.data.user.staffRole;
          extended.permissions = res.data.user.permissions;
          return true;
        } catch (error: unknown) {
          console.error('OAuth backend error:', error);
          if (axios.isAxiosError(error) && error.response?.data?.message) {
            throw new Error(String(error.response.data.message));
          }
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const extendedUser = user as ExtendedUser;
        token.id = extendedUser._id || extendedUser.id;
        token.role = extendedUser.role;
        token.charityId = extendedUser.charityId;
        token.staffRole = extendedUser.staffRole;
        token.permissions = extendedUser.permissions;
        token.jwt = extendedUser.token;
        token.refreshToken = extendedUser.refreshToken;
        return token;
      }

      if (trigger === 'update' && session) {
        const updatedSession = session as {
          token?: string;
          refreshToken?: string;
        };
        if (updatedSession.token) token.jwt = updatedSession.token;
        if (updatedSession.refreshToken) {
          token.refreshToken = updatedSession.refreshToken;
        }
        return token;
      }

      const accessToken = token.jwt as string | undefined;
      const refreshToken = token.refreshToken as string | undefined;

      if (!refreshToken) {
        return token;
      }

      const shouldRefresh =
        !accessToken || isAccessTokenExpiringSoon(accessToken);

      if (shouldRefresh) {
        try {
          const refreshed = await refreshBackendTokens(refreshToken);
          token.jwt = refreshed.accessToken;
          token.refreshToken = refreshed.refreshToken;
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        role: token.role as string,
        charityId: token.charityId as string | undefined,
        staffRole: token.staffRole as string | undefined,
        permissions: token.permissions as string[] | undefined,
      };
      session.token = token.jwt as string;
      session.refreshToken = token.refreshToken as string;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
});

/** Pages Router handler — req gives access to oauth_intent cookie on OAuth callback */
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, buildAuthOptions(req));
}

export const authOptions = buildAuthOptions();
