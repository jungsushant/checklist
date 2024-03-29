"use server";

import { typeLoginSchema } from "@/components/auth/login-form";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/data/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values: typeLoginSchema) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }
  const { email, password } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email sent" };
  }

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
          return { error: "Invalid Credendials !" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};
