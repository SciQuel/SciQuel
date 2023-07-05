import ResetPasswordForm from "@/components/Auth/ResetPasswordForm";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

interface Params {
  token: string;
}

export default function ForgotPasswordPage({ params }: { params: Params }) {
  try {
    jwt.verify(params.token, process.env.NEXTAUTH_SECRET ?? "");
    return <ResetPasswordForm token={params.token} />;
  } catch (err) {
    return redirect("/auth/login");
  }
}
