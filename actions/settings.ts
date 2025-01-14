"use server";

import * as z from "zod";

import { db } from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/hooks/current-user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

import bcrypt from "bcryptjs";
import { unstable_update } from "@/auth";

export const settings = async (
  values: z.infer<typeof SettingsSchema>
) => {

  const user = await currentUser();

  if (!user) return { error: "Unauthorized" };

  if (!user.id) return { error: "Unauthorized, ID not found!" };

  const dbUser = await getUserById(user.id);
  
  if (!dbUser) return { error: "Unauthorized" };

  // Kullanıcı harici bir sistem ile giriş yaptıysa bu alanlarda değişiklik engellenecek:
  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.twoFactorEnabled = undefined;
  }

  //Kullanıcı eposta güncellemek isterse:
  if (values.email && values.email !== user.email) {

    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) return { error: "Email already in use!"}; 

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: "Verification email sent!" }
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(values.password, dbUser.password);

    if (!passwordMatch) return { error: "Incorrect password!" };

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);

    values.password = hashedPassword;
    values.newPassword = undefined;

  }

  await db.user.update({
    where: { id: user.id },
    data: {
      ...values,
    }
  });

  // Server side componentleri güncelleme.
  // AYRICA SERVER SIDE TARAFI SORUNLU ÇALIŞIYOR Front tarafında.
  unstable_update({
    user: {
      ...values,
    }
  });

  return { success: "Settings updated!" };
}