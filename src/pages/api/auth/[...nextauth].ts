
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
              role: credentials.role,
            }
          );

          if (res.data) {
            const { user, token } = res.data;
            return { ...user, token };
          }
          return null;
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.role = user.role;
        token.jwt = user.token; // Attach the JWT token to the session token
      }
      return token;
    },
    async session({ session, token }) {
      session.user = { ...session.user, id: token.id, role: token.role };
      session.token = token.jwt; // Attach the JWT token to the session for API requests
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 18 * 60, // 18 minutes in milliseconds
    // maxAge: 30 * 60, // 30 minutes in milliseconds
    // maxAge: 60 * 60, // 1 hour in milliseconds
    // maxAge: 24 * 60 * 60, // 1 day in milliseconds
  },
});
  