"use server";

import { NewPasswordSchema } from "@/schemas";

import { getUserByEmail } from "@/data/user";
import bcryptjs from "bcryptjs";
import * as z from "zod";
import { generatePasswordResetToken } from "@/data/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";
import { getPasswordResetTokenById } from "@/data/password-reset-token";
import { db } from "@/lib/db";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "Missing Token!" };
  }
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Email!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenById(token);

  if (!existingToken) {
    return { error: "Token does not exist" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has Expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) return { error: "User doesn't exist" };

  const hashedPassword = await bcryptjs.hash(password, 10);
  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      password: hashedPassword,
    },
  });
  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Password Reset done" };
};
