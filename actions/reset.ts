"use server";

import * as z from "zod";
import { ResetSchema } from "@/schemas";

import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken, generateVerificationToken } from "@/lib/tokens";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";

export const reset = async (values: z.infer<typeof ResetSchema>) => {


  const ValidatedFields = ResetSchema.safeParse(values);

  if (!ValidatedFields.success) {
    return { error: "Invalid email!" };
    // eğer bir api route olsaydı şuna benzer birşey olurdu "return Response....."
  }

  const { email } = ValidatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email) {
    return { error: "Email not found, invalid credentials!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Reset password email sent!" };

};
