'use client';
import { useSession, signOut, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Function to refresh session
  const refreshSession = async () => {
    const refreshedSession = await getSession();
    if (!refreshedSession) {
      signOut({ callbackUrl: '/auth/login' });
    }
  };

  useEffect(() => {
    if (status === 'loading') return;

    // If the user is not authenticated, redirect to login
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    // Check if the user has an allowed role
    if (session && !allowedRoles.includes(session.user.role)) {
      router.push('/403');
      return;
    }

    // Set an interval to refresh the session 1 minute before it expires
    const intervalId = setInterval(() => {
      if (session?.expires) {
        const sessionExpiry = new Date(session.expires).getTime();
        const currentTime = new Date().getTime();
        const timeLeft = sessionExpiry - currentTime;

        if (timeLeft < 60 * 1000) {
          refreshSession();
        }
      }
    }, 30 * 1000); // Check every 30 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [status, session, router, allowedRoles]);

  // Loading state
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  // Check if session is active and user has an allowed role
  return session && allowedRoles.includes(session.user.role) ? (
    <>{children}</>
  ) : null;
};

export default ProtectedRoute;
