import tokenSchema from "@/app/api/auth/tokenSchema";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Params {
  token: string;
}

export default async function VerifyPage({ params }: { params: Params }) {
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

    await Promise.all([
      prisma.authVerification.delete({
        where: { id: authVerification.id },
      }),
      prisma.user.update({
        where: { email },
        data: { verified: true },
      }),
    ]);

    return (
      <div className="flex flex-col">
        <h1 className="text-center text-4xl font-semibold text-sciquelTeal">
          Account Verified!
        </h1>
        <p className="mt-6">
          Your account was successfully verified. Please login{" "}
          <Link href="/auth/login" className="text-sciquelTeal">
            here
          </Link>
          .
        </p>
      </div>
    );
  } catch (err) {
    // TODO: Implement proper error messaging
    return redirect("/auth/login");
  }
}
