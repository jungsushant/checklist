"use server";

import { typeLoginSchema } from "@/components/auth/login-form";
import { LoginSchema } from "@/schemas";

export const login = async (values: typeLoginSchema) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }
  return { success: "Email Sent!" };
};
