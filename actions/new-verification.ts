"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const newVerification = async (token: string) => {

  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token not found!" };
  }

  const hasExpired = new Date() > new Date(existingToken.expires);

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "User does not exist, Email not found!" };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      // Bu kısımdaki email güncellemesini ekleme sebebimiz, kullanıcı eposta değişikliğine gider ise bunuda bir doğrulama ile yapcak olmamızdan ötürü.
      email: existingToken.email
    },
  });

  await  db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email & account verified!" };
};