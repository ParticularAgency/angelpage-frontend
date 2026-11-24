import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    token?: string;
    refreshToken?: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string;
      role?: string;
      charityId?: string;
      staffRole?: string;
      permissions?: string[];
    };
  }

  interface User {
    role?: string;
    id?: string;
    token?: string;
    refreshToken?: string;
    charityId?: string;
    staffRole?: string;
    permissions?: string[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    jwt?: string;
    refreshToken?: string;
    charityId?: string;
    staffRole?: string;
    permissions?: string[];
  }
}
