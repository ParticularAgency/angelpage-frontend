import { SessionProvider } from 'next-auth/react';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => (
  <SessionProvider refetchInterval={4 * 60} refetchOnWindowFocus>
    {children}
  </SessionProvider>
);

export default AuthProvider;
