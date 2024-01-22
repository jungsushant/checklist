"use server";

import { typeRegisterSchema } from "@/components/auth/register-form";
import { RegisterSchema } from "@/schemas";

export const login = async (values: typeRegisterSchema) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }
  return { success: "Email Sent!" };
};
