"use server";

import { EmailResetSchema } from "@/schemas";

import { getUserByEmail } from "@/data/user";

import * as z from "zod";
import { generatePasswordResetToken } from "@/data/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

export const reset = async (values: z.infer<typeof EmailResetSchema>) => {
  const validatedFields = EmailResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Email!" };
  }

  const { email } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "No user found" };
  }

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist" };
  }
  const passwordResetToken = await generatePasswordResetToken(
    existingUser.email
  );
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Login link Sent if the user exists" };
};
