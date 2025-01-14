"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas";

import bcrypt from "bcryptjs";
// * not: eğer "bcrypt" ile bir sorun yaşanır ise "bcryptjs" de kullanılabilir.
import { db } from "@/lib/db";
import { getUserByEmail, getUserByUsername } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  console.log(values);

  const ValidatedFields = RegisterSchema.safeParse(values);

  if (!ValidatedFields.success) {
    return { error: "Invalid fields!" };
    // eğer bir api route olsaydı şuna benzer birşey olurdu "return Response....."
  }

  const { email, password, username } = ValidatedFields.data;

  // * Username KONTROL:
  const existingUsername = await getUserByUsername(username);
  if (existingUsername) return { error: "Username already taken!" }

  // * Email KONTROL:
  const existingEmail = await getUserByEmail(email);
  if (existingEmail) return { error: "Email already in use!" }

  // * Password CRYPT:
  // Forma girilen şifreyi bir salt ile crpyt'le. (salt = 10)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Hiç bir sorun olmadığı taktirde kullanıyıcı kaydet.
  await db.user.create({
    data: {
      username,
      email,
      password: hashedPassword
    }
  });


  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Welcome " + username + "! Please verify your email." }

  // Todo redirect after register (to login or somewhere)
  // veya direk kullanıcıyı login etme.

  // Todo (not) bakılacak
  // nextjs cache fonksiyonları:
  // revalidatePath
  // revalidateTag

}