import { sendAccountVerification } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AuthVerificationType } from "@prisma/client";
import { redirect } from "next/navigation";
import schema from "./schema";

export default async function VerifyInfoPage({
  searchParams,
}: {
  searchParams: { [key: string]: unknown };
}) {
  const parsedParams = schema.safeParse(searchParams);

  if (!parsedParams.success) {
    return redirect("/auth/login?error=EmailSignin");
  }

  const user = await prisma.user.findUnique({
    where: { email: parsedParams.data.user },
  });

  if (user) {
    await prisma.authVerification.deleteMany({
      where: {
        user: { id: user.id },
        type: AuthVerificationType.EMAIL_VERIFICATION,
      },
    });
    sendAccountVerification(user).catch((err) => {
      console.error(err);
    });
  }
  return (
    <div className="flex flex-col">
      <h1 className="text-center text-4xl font-semibold text-sciquelTeal">
        Please verify your email
      </h1>
      <p className="mt-6">
        Before you may use your account, you must first verify your email.
        Instructions on how to do so were sent to your email address. You may
        close this window once you are finished.
      </p>
    </div>
  );
}
