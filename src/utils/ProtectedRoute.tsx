'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import axios from 'axios';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { data: session, status } = useSession() || {};
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    const checkBackendToken = async () => {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-token`, {
          headers: { Authorization: `Bearer ${session?.token}` },
        });
      } catch {
        signOut({ callbackUrl: '/' });
      }
    };

    if (
      status === 'unauthenticated' ||
      !allowedRoles.includes(session?.user?.role || '')
    ) {
      signOut({ callbackUrl: '/' });
      return;
    }

    const interval = setInterval(checkBackendToken, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [status, session, router, allowedRoles]);

  if (status === 'loading') return <p>Loading...</p>;

  return <>{children}</>;
};

 export default ProtectedRoute;
// 'use client';

// import { useSession, signOut } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { useEffect, ReactNode } from 'react';
// import axios from 'axios';

// interface ProtectedRouteProps {
//   children: ReactNode;
//   allowedRoles: string[];
// }

// const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (status === 'loading') return;

//     const handleLogout = () => {
//       signOut({ callbackUrl: '/' }); // Redirects to homepage
//       router.push('/'); // Ensures the frontend navigates to the homepage
//     };

//     const checkBackendToken = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/auth/check-token`,
//           {
//             headers: { Authorization: `Bearer ${session?.token}` },
//           }
//         );

//         if (!response.data?.valid) {
//           handleLogout();
//         }
//       } catch {
//         handleLogout();
//       }
//     };

//     if (
//       status === 'unauthenticated' ||
//       !allowedRoles.includes(session?.user?.role || '')
//     ) {
//       handleLogout();
//       return;
//     }

//     const interval = setInterval(checkBackendToken, 30000); // Check every 30 seconds
//     return () => clearInterval(interval);
//   }, [status, session, router, allowedRoles]);

//   if (status === 'loading') return <p>Loading...</p>;

//   return <>{children}</>;
// };

// export default ProtectedRoute;
