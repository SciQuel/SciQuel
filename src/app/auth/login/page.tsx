import Alert from "@/components/Alert";
import LoginForm from "@/components/Auth/LoginForm";
import { type ReactNode } from "react";

export default async function LoginPage(props: {
  searchParams: Promise<{ [key: string]: unknown }>;
}) {
  const searchParams = await props.searchParams;
  const errorMap: Record<string, ReactNode> = {
    EmailSignin: (
      <Alert type="danger">
        There was a problem while attempting to verify your account.
      </Alert>
    ),
    CredentialsSignin: (
      <Alert type="danger">
        We could not find an account matching that email and password.
      </Alert>
    ),
    Verification: (
      <Alert type="danger">The verification request was invalid.</Alert>
    ),
  };

  const error = searchParams.error;

  return (
    <>
      <LoginForm />
      <div className="mt-6">{typeof error === "string" && errorMap[error]}</div>
    </>
  );
}
