"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";

import { signIn } from "@/auth";
import { DEFAULT_AFTERLOGIN_REDIRECT } from "@/routes";

import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

// ! NOT: (TODO)
// *0 Kullanıcı kayıt olduğu anda doğrulama epostası gidiyor.
// *1 Kayıt formu sıfırlanmıyor, kullanıcı yönlendirilmiyor, sadece doğrulama epostaı gittiğine dair bir yazı çıkıyor.
// *2 Aynı bilgiler ile kayıt gönderemiyor, kullanıcı adı zaten kayıtlı bilgirisi alıyor.
//gn*3 Diyelimki login ekranına döndü ve giriş yapmak istedi.
// ! 3-1 YANLIŞ bir parola girsede giriş yap dediği anda, doğrulama epostası gönderildi bildirim alıyor, ve posta gönderiliyor.
// * 3-2 Epostaya gelen link ile hesap doğrulama başarılı olarak tamamlanıyor. Link 2 kez kullanılamıyor.
// * 3-3 Hesaba yanlış şifre ile girince konsol throw devam ediyor. Ön taraf "Invalid credentials" hatası veriyor.
// * 4 Doğru eposta ve şifre ile başarılı bir giriş gerçekleştiriliyor.

export const login = async (values: z.infer<typeof LoginSchema>) => {
  console.log(values);

  const ValidatedFields = LoginSchema.safeParse(values);

  if (!ValidatedFields.success) {
    return { error: "Invalid fields!" };
    // eğer bir api route olsaydı şuna benzer birşey olurdu "return Response....."
  }

  //return { success: "Login success!" }

  const { email, password } = ValidatedFields.data;

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
  

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      redirectTo: DEFAULT_AFTERLOGIN_REDIRECT,
      callbackUrl: DEFAULT_AFTERLOGIN_REDIRECT,
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
