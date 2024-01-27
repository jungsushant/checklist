import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:300/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onbarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click<a href="${confirmLink}">here</a> to confirm you email.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:300/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "onbarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<p>Click<a href="${resetLink}">here</a> to reset your passowrd.</p>`,
  });
};
