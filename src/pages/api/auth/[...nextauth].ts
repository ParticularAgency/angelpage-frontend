import NextAuth, { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

interface Credentials {
  email: string;
  password: string;
  role: string;
}

// Define the expected structure of the response from the API
interface LoginResponse {
  user: {
    _id: string;
    role: string;
    name?: string; // Add other user properties if necessary
  };
  token: string;
}

// Extend the NextAuth User type
interface ExtendedUser extends NextAuthUser {
  _id: string;
  role: string;
  token: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials: Partial<Credentials> | undefined) {
        if (!credentials?.email || !credentials.password || !credentials.role) {
          throw new Error('Email, password, and role are required');
        }

        try {
          // Make the axios request and type the response as LoginResponse
          const res = await axios.post<LoginResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
              role: credentials.role,
            }
          );

          // Destructure and return the user and token
          if (res.data) {
            const { user, token } = res.data;
            return { ...user, token }; // Spread user and attach token
          }
          return null;
        } catch (error) {
          console.error('Login error:', error);
          throw new Error('Invalid credentials');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Extend the default token inline
        token.id = (user as ExtendedUser)._id;
        token.role = (user as ExtendedUser).role;
        token.jwt = (user as ExtendedUser).token;
      }
      return token; // TypeScript infers type correctly here
    },
    async session({ session, token }) {
      // Extend session.user to include id and role
      session.user = {
        ...session.user,
        id: token.id as string,
        role: token.role as string,
      };
      session.token = token.jwt as string; // Attach JWT token to session
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60, // 18 minutes
  },
};

export default NextAuth(authOptions);
