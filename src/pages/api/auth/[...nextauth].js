import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../../lib/prisma";
import fetch from "node-fetch";

const options = {
  //adapter: PrismaAdapter(prisma),
  debug: true,
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      id: "credentials",
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      async authorize(credentials, req) {
        try {
          const user = await fetch(
            `${process.env.NEXT_PUBLIC_WEBURL}/api/user/checkCredentials`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(credentials),
            }
          ).then((res) => res.json());
          if (user) {
            return user;
          } else {
            return null;
          }
        } catch (e) {
          console.log(e);
          return null;
        }
      },
    }),
  ],
  secret: process.env.JWT_TOKEN_SECRET,
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid;
        session.user.roles = token.uroles;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        console.log(user);
        token.uid = user.id;
        token.uroles = user.userRoles;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
};

export { options };

export default (req, res) => NextAuth(req, res, options);
