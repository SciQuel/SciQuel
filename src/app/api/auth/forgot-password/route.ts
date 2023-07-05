import env from "@/lib/env";
import mailer from "@/lib/mailer";
import prisma from "@/lib/prisma";
import { AuthVerificationType } from "@prisma/client";
import { sign } from "jsonwebtoken";
import { NextResponse, type NextRequest } from "next/server";
import schema from "./schema";

export async function POST(request: NextRequest) {
  try {
    const requestBody = schema.safeParse(await request.json());
    if (!requestBody.success) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }
    const { email } = requestBody.data;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user !== null) {
      const authVerification = await prisma.authVerification.create({
        data: {
          user: { connect: { id: user.id } },
          type: AuthVerificationType.PASSWORD_RESET,
        },
      });

      const token = sign(
        { email, id: authVerification.id },
        process.env.NEXTAUTH_SECRET ?? "",
      );
      const resetLink = `${env.NEXT_PUBLIC_SITE_URL}/auth/reset-password/${token}`;
      void mailer.sendMail({
        from: '"SciQuel" <no-reply@sciquel.org>',
        replyTo: '"SciQuel Team" <team@sciquel.org>',
        to: user.email,
        subject: "Reset your SciQuel password",
        text: `Please reset your password with the following link: ${resetLink}`,
      });
    }
    return NextResponse.json({});
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unable to complete request" },
      { status: 500 },
    );
  }
}
