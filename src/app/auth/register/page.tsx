import Alert from "@/components/Alert";
import RegisterForm from "@/components/Auth/RegisterForm";

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { [key: string]: unknown };
}) {
  const errorMap: Record<string, JSX.Element> = {
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
