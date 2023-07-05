import env from "@/lib/env";
import mailer from "@/lib/mailer";
import prisma from "@/lib/prisma";
import { sign } from "jsonwebtoken";
import { NextResponse, type NextRequest } from "next/server";
import schema from "./schema";

export async function POST(request: NextRequest) {
  console.log(1);
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
      const token = sign({ email }, process.env.NEXTAUTH_SECRET ?? "");
      void mailer.sendMail({
        from: '"SciQuel" <no-reply@sciquel.org>',
        replyTo: '"SciQuel Team" <team@sciquel.org>',
        to: user.email,
        subject: "Reset your SciQuel password",
        text: `Please reset your password with the following link: ${env.NEXT_PUBLIC_SITE_URL}/auth/reset-password/${token}`,
      });
    }
    return NextResponse.json({});
  } catch (err) {
    return NextResponse.json(
      { error: "Unable to complete request" },
      { status: 500 },
    );
  }
}
