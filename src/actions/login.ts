"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";

import { signIn } from "@/lib/auth/auth";
import { DEFAULT_AFTERLOGIN_REDIRECT } from "@/lib/routes";

import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { 
  sendVerificationEmail, 
  sendTwoFactorTokenEmail 
} from "@/lib/mail";
import { 
  generateVerificationToken, 
  generateTwoFactorToken 
} from "@/lib/tokens";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

// ! NOT: (TODO)
// *0 Kullanıcı kayıt olduğu anda doğrulama epostası gidiyor.
// *1 Kayıt formu sıfırlanmıyor, kullanıcı yönlendirilmiyor, sadece doğrulama epostaı gittiğine dair bir yazı çıkıyor.
// *2 Aynı bilgiler ile kayıt gönderemiyor, kullanıcı adı zaten kayıtlı bilgirisi alıyor.
//gn*3 Diyelimki login ekranına döndü ve giriş yapmak istedi.
// ! 3-1 YANLIŞ bir parola girsede giriş yap dediği anda, doğrulama epostası gönderildi bildirim alıyor, ve posta gönderiliyor.
// * 3-2 Epostaya gelen link ile hesap doğrulama başarılı olarak tamamlanıyor. Link 2 kez kullanılamıyor.
// * 3-3 Hesaba yanlış şifre ile girince konsol throw devam ediyor. Ön taraf "Invalid credentials" hatası veriyor.
// * 4 Doğru eposta ve şifre ile başarılı bir giriş gerçekleştiriliyor.

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {


  const ValidatedFields = LoginSchema.safeParse(values);

  if (!ValidatedFields.success) {
    return { error: "Invalid fields!" };
    // eğer bir api route olsaydı şuna benzer birşey olurdu "return Response....."
  }

  //return { success: "Login success!" }

  const { email, password, twofactorcode } = ValidatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.password || !existingUser.email) {
    return { error: "Email not found, invalid credentials!" };
  }

  
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email sent!" };
  }
  
  if (existingUser.twoFactorEnabled && existingUser.email) {

    if (twofactorcode) {

      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }

      if (twoFactorToken.token !== twofactorcode) {
        return { error: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code has expired!" };
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id }
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id }
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id
        }
      });
      // herhangi birşey dönmüyoruz (return) else kısmını atlayıp direk sign-in prosedürüne başlayacak.

    } else {

      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      await sendTwoFactorTokenEmail(
        twoFactorToken.email,
        twoFactorToken.token
      );

      return { twoFactor: true };
    }
  }

  //gn* Yukarıda bahsettiğim hata bu kısımda sign-in içerisinde oluyor:
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      redirectTo: callbackUrl || DEFAULT_AFTERLOGIN_REDIRECT,
      callbackUrl: callbackUrl || DEFAULT_AFTERLOGIN_REDIRECT,
    });
    //return { success: "Login success!" }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    // Todo bu kısımda throw etmediğimiz zaman redirect çalışmama sorunu kontrol edilecek.
    // https://authjs.dev/reference/core/errors#credentialssignin
    throw error;

  }

  // Todo (not) bakılacak
  // nextjs cache fonksiyonları:
  // revalidatePath
  // revalidateTag
};
