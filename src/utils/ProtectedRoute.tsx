'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, ReactNode } from 'react';
import axios from 'axios';
import FullScreenLoader from '@/components/common/loading/FullScreenLoader';
import {
  isAccessTokenExpired,
  refreshBackendTokens,
} from '@/lib/authTokens';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const getLoginPath = (allowedRoles: string[]) => {
  const adminRoles = [
    'ADMIN',
    'OPS_ADMIN',
    'CONTENT_ADMIN',
    'FINANCE_ADMIN',
  ];
  if (allowedRoles.some(role => adminRoles.includes(role))) {
    return '/admin/login';
  }
  return '/auth/login';
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { data: session, status, update } = useSession() || {};
  const router = useRouter();
  const loginPath = getLoginPath(allowedRoles);
  const refreshInFlight = useRef(false);

  useEffect(() => {
    if (status === 'loading') return;

    const handleAuthFailure = () => {
      signOut({ callbackUrl: loginPath });
      router.push(loginPath);
    };

    const tryRefreshSession = async (): Promise<boolean> => {
      if (!session?.refreshToken || refreshInFlight.current) {
        return false;
      }

      refreshInFlight.current = true;
      try {
        const refreshed = await refreshBackendTokens(session.refreshToken);
        await update({
          token: refreshed.accessToken,
          refreshToken: refreshed.refreshToken,
        });
        return true;
      } catch {
        return false;
      } finally {
        refreshInFlight.current = false;
      }
    };

    const checkBackendToken = async () => {
      const accessToken = session?.token;
      const refreshToken = session?.refreshToken;

      if (!accessToken && !refreshToken) {
        handleAuthFailure();
        return;
      }

      if (!accessToken || isAccessTokenExpired(accessToken)) {
        const refreshed = await tryRefreshSession();
        if (!refreshed) {
          handleAuthFailure();
        }
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/check-token`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const tokenRole = response.data?.role;
        if (tokenRole && !allowedRoles.includes(tokenRole)) {
          handleAuthFailure();
        }
      } catch {
        const refreshed = await tryRefreshSession();
        if (!refreshed) {
          handleAuthFailure();
        }
      }
    };

    if (status === 'unauthenticated') {
      router.push(loginPath);
      return;
    }

    if (status === 'authenticated' && !session?.user?.role) {
      return;
    }

    if (
      status === 'authenticated' &&
      session?.user?.role &&
      !allowedRoles.includes(session.user.role)
    ) {
      handleAuthFailure();
      return;
    }

    if (status !== 'authenticated' || !session?.user?.role) {
      return;
    }

    if (!session?.token && !session?.refreshToken) {
      return;
    }

    checkBackendToken();
    const interval = setInterval(checkBackendToken, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [status, session, router, allowedRoles, loginPath, update]);

  if (status === 'loading') {
    return <FullScreenLoader />;
  }

  if (status === 'unauthenticated') {
    return <FullScreenLoader />;
  }

  if (!session?.user?.role || !allowedRoles.includes(session.user.role)) {
    return <FullScreenLoader />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
