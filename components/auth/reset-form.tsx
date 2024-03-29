"use client";
import { CardWrapper } from "./card-wrapper";
import { EmailResetSchema } from "@/schemas";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
  FormField,
} from "../ui/form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { reset } from "@/actions/reset";
import { useState, useTransition } from "react";

export type typeEmailResetSchema = z.infer<typeof EmailResetSchema>;
export const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<typeEmailResetSchema>({
    resolver: zodResolver(EmailResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: typeEmailResetSchema) => {
    setError("");
    setError("");
    startTransition(() => {
      reset(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
    console.log(values);
  };

  return (
    <CardWrapper
      headerLabel="Forgot your password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="john.doe@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormSuccess message={success} />
          <FormError message={error} />
          <Button disabled={isPending} type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
