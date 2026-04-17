import Alert from "@/components/Alert";
import RegisterForm from "@/components/Auth/RegisterForm";
import { type ReactNode } from "react";

export default async function RegisterPage(props: {
  searchParams: Promise<{ [key: string]: unknown }>;
}) {
  const searchParams = await props.searchParams;
  const errorMap: Record<string, ReactNode> = {
    Default: (
      <Alert type="danger">
        There was a problem creating your account. Please check that your email
        has not been used to an existing account already.
      </Alert>
    ),
  };

  const error = searchParams.error;
  return (
    <>
      <RegisterForm />
      <div className="mt-6">{typeof error === "string" && errorMap[error]}</div>
    </>
  );
}
