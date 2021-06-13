import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { Login, UpdateSessionUser } from '../../../api/public/auth';

const options = {
  providers: [
    Providers.Credentials({
      id: 'inventory-login',
      name: 'Credentials',
      credentials: {},
      authorize: async (credentials) => {
        const res = await Login(credentials.email, credentials.password);
        return res.success ? res.data : null;
      },
    }),
  ],
  session: {
    jwt: true,
    maxAge: Number(process.env.NEXTAUTH_JWT_LIFESPAN), //60 * 60 * 24 * 30, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
    encryption: true, // Set to true to use encryption. Defaults to false (signing only).
  },
  callbacks: {
    signIn: async (user: any, account: any, profile: any): Promise<boolean> => {
      // runs the authorize function of provider
      return true;
    },

    session: async (session: any, user: any): Promise<object> => {
      if (user) {
        session.user = {
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email,
          warehouses: user.warehouses,
        };
      }
      if (user?.accessToken) {
        session.accessToken = user.accessToken;
      }
      return Promise.resolve(session);
    },

    jwt: async (token: any, user: any): Promise<object> => {
      // user exist only after initial login
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.warehouses = user.warehouses;
      } else if (token?.accessToken) {
        const res = await UpdateSessionUser(token.accessToken, token.id);
        if (res.success) {
          token = {
            id: res.data.id,
            accessToken: res.data.accessToken,
            role: res.data.role,
            name: res.data.name,
            email: res.data.email,
            warehouses: res.data.warehouses,
          };
        }
      }
      return Promise.resolve(token);
    },
  },

  pages: {
    signIn: '/login',
  },
  debug: true, // Use this option to enable debug messages in the console
};

const Auth = (req: any, res: any) => NextAuth(req, res, options);

export default Auth;
