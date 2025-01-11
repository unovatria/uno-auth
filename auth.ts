import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "@/auth.config";

import { db } from "./lib/db";

import { getUserById } from "./data/user";

export const { 
  handlers, 
  auth, 
  signIn, 
  signOut 
} = NextAuth({
  callbacks: {

    // 0 - Önce burada token ile başlıyoruz //* (bu kısımda "user, profile" girdileri undefined dönüyor??)
    async jwt({ token }) {

      // 0.5 istenmeyen elemanları kaldırma:
      if (token) {
        // Example: remove email property
        const { name, picture, ...restToken } = token;
        token = restToken;
      }

      // 1 - token içerisinde "sub" yok ise direk tokeni dönüyoruz.
      if (!token.sub) return token;

      // 2 - token içerisinde "sub" var ise sub içerisindeki id ile kullanıcı buluyoruz
      const existingUser = await getUserById(token.sub);

      // 3 - kullanıcı yok ise direk tokeni dönüyoruz.
      if (!existingUser) return token;
      
      // 4 - kullanıcı var ise token içerisine username ekliyoruz.
      token.username = existingUser.username;

      // 5 - özelleştirilmiş tokeni dönüyoruz.
      return token;
    },

    // 0 - token ve session ile başlıyoruz.
    async session({ token, session }) {

      // 0.5 istenmeyen elemanları kaldırma:
      if (session.user) {
        // Remove unwanted properties from session.user
        const { name, image, ...rest } = session.user;
        session.user = rest;
      }

      // 1 - token içerisinde "sub" (id) var ise ve session user var ise session user id'sini token içerisindeki ile set ediyoruz.
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      // 2 - token içerisinde "username" var ise ve session user var ise session user username'ini token içerisindeki ile set ediyoruz.
      if (token.username && session.user) {
        session.user.username = token.username as string;
      }

      return session;
    },


    /*
    // custom callback:
    async signIn({ user }) {
      // Todo bu kısımda "user.id" sonuna gelen ünlem zorunluluğu gözden geçirilecek.
      const existingUser = await getUserById(user.id!);
      if (!existingUser || !existingUser.emailVerified) {
        return false;
      }
      return true;
    }
    */

  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});


/*
if (user.id) {
  getUserById(user.id)
} else {
  // Handle the case where id is undefined
}
*/