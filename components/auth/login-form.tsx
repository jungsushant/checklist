import { CardWrapper } from "./card-wrapper";

export const LoginForm = () => {
  return (
    <CardWrapper
      headerLabel="Welcome Back !"
      backButtonLabel="Don't have an account ?"
      showSocial
      backButtonHref="/auth/register"
    >
      Login Form
    </CardWrapper>
  );
};
