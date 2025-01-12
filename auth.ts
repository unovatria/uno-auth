import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "@/auth.config";

import { db } from "./lib/db";

import { getUserById } from "./data/user";
import { DEFAULT_ERROR_ADRESS, DEFAULT_LOGIN_ADRESS } from "./routes";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";

export const { 
  handlers, 
  auth, 
  signIn, 
  signOut 
} = NextAuth({

  // * rrr
  pages: {
    signIn: DEFAULT_LOGIN_ADRESS,
    error: DEFAULT_ERROR_ADRESS,
    //signOut: "/auth/logout"
  },

  // * Bu kısımdaki event, google / github ile giriş yapanlar için çalışacak.
  // * Oauth ile giriş yapanların "email-verified" otomatik onaylı olmasını sağlayacak.
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },

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

    // custom callback:
    async signIn({ user, account }) {

      console.log({ user, account });

      // Todo bu kısımda "user.id" sonuna gelen ünlem zorunluluğu gözden geçirilecek.

      // * Eposta doğrulamasını diğer providerların hiçbirine eklemiyoruz şimdilik.
      // Allow OAuth without email verification.
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);
      // Prevent sign-in without email verification.
      if (!existingUser || !existingUser.emailVerified) return false;

      if (existingUser.twoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if (!twoFactorConfirmation) return false;

        // Todo Delete two factor confirmation for next sign-in.
        // * Kullanıcının her girişinde 2FA onayını silerek bir sonraki girişinde tekrar isteyecek şekilde çalışıyor.
        // * Bunu değiştirerek (TwoFactorConfirmation Schema) içerisinde expires ekleyerek belli bir sürede silinmesini
        // *    sağlayabiliriz. (Örneğin 1 gün sonra silinmesi gibi)

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        });

      }

      return true;
    }
    

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