import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "@/auth.config";

import { db } from "./lib/db";

import { getUserById } from "./data/user";
import { DEFAULT_ERROR_ADRESS, DEFAULT_LOGIN_ADRESS } from "./routes";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";

export const { 
  handlers, 
  auth, 
  signIn, 
  signOut,
  unstable_update
} = NextAuth({

  // * 
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
        //gn* Bu kısımda token ve session içerisinde taşınmasını istemedğimiz kısımları kaldırıyoruz.
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

      // 4.5 - Ek Özellik: İki adımlı doğrulama durumunu token içerisine ekleme:
      token.isTwoFactorEnabled = existingUser.twoFactorEnabled;

      // 4.7 - 
      token.name = existingUser.name;
      token.email = existingUser.email;

      // 4.8 - Ek özellik: Kullanıcıya ait hesap bilgilerini token içerisine ekleme:
      const existingAccount = await getAccountByUserId(existingUser.id);
      token.isOAuth = !!existingAccount;
      /*
      if (existingAccount) {
        token.provider = existingAccount.provider;
        token.type = existingAccount.type;
      }
      */

      // 5 - özelleştirilmiş tokeni dönüyoruz.
      return token;
    },

    // 0 - token ve session ile başlıyoruz.
    async session({ token, session }) {

      // 0.5 istenmeyen elemanları kaldırma:
      if (session.user) {
        //gn* Bu kısımda token ve session içerisinde taşınmasını istemedğimiz kısımları kaldırıyoruz.
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

      // 2.5 - Ek Özellik: İki adımlı doğrulama durumunu tokenden alıp session içerisine ekleme: 
      if (session.user) {
        session.user.twoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      // 2.7 - 
      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }

      // 2.8 -
      if (session.user) session.user.isOAuth = token.isOAuth as boolean;

      return session;
    },

    // custom callback:
    async signIn({ user, account }) {

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