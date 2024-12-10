'use client';

import { useSession, signOut, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * ProtectedRoute Component
 * @param {Object} props
 * @param {ReactNode} props.children - The child components to render when authorized.
 * @param {string[]} props.allowedRoles - An array of roles that are authorized to access the route.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { data: session, status } = useSession() || {};
  const router = useRouter();

  // Function to refresh the session
  const refreshSession = async () => {
    const refreshedSession = await getSession();
    if (!refreshedSession) {
      signOut({ callbackUrl: '/auth/login' });
    }
  };

  useEffect(() => {
    if (status === 'loading') return;

    // Redirect to login if the user is not authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    // Redirect to 403 page if the user does not have an allowed role
    if (session && !allowedRoles.includes(session.user.role)) {
      router.push('/403');
      return;
    }

    // Refresh session 1 minute before expiration
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

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [status, session, router, allowedRoles]);

  // Show loading state while the session is being determined
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  // Render children if session is active and user has an allowed role
  return session && allowedRoles.includes(session.user.role) ? children : null;
};

export default ProtectedRoute;
