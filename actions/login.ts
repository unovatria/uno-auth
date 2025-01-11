"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  console.log(values);

  const ValidatedFields = LoginSchema.safeParse(values);

  if (!ValidatedFields.success) {
    return { error: "Invalid fields!" };
    // eğer bir api route olsaydı şuna benzer birşey olurdu "return Response....."
  }

  //return { success: "Login success!" }

  const { email, password } = ValidatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
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
