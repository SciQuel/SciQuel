import tokenSchema from "@/app/api/auth/tokenSchema";
import ResetPasswordForm from "@/components/Auth/ResetPasswordForm";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

interface Params {
  token: string;
}

export default async function ResetPasswordPage({
  params,
}: {
  params: Params;
}) {
  try {
    const data = jwt.verify(params.token, process.env.NEXTAUTH_SECRET ?? "");
    const { email, id } = tokenSchema.parse(data);

    const authVerification = await prisma.authVerification.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!authVerification || authVerification?.user.email !== email) {
      throw new Error("Invalid token");
    }

    return <ResetPasswordForm token={params.token} />;
  } catch (err) {
    return redirect("/auth/login?error=Verification");
  }
}
