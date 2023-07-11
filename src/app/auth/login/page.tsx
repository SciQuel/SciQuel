import Alert from "@/components/Alert";
import LoginForm from "@/components/Auth/LoginForm";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: unknown };
}) {
  const errorMap: Record<string, JSX.Element> = {
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
