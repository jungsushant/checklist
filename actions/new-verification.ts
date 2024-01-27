"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenById } from "@/data/verification-token";
import { db } from "@/lib/db";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenById(token);

  if (!existingToken) {
    return { error: "Token does not exist" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has Expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) return { error: "User doesn't exist" };

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });
  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Email Verified" };
};
