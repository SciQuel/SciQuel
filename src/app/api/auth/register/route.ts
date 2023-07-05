import { hashPassword } from "@/lib/auth";
import env from "@/lib/env";
import mailer from "@/lib/mailer";
import prisma from "@/lib/prisma";
import { AuthVerificationType } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextResponse, type NextRequest } from "next/server";
import schema from "./schema";

export async function POST(request: NextRequest) {
  try {
    const requestBody = schema.safeParse(await request.json());
    if (!requestBody.success) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { email: requestBody.data.email },
    });
    if (user !== null) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }
    const newUser = await prisma.user.create({
      data: {
        email: requestBody.data.email,
        firstName: requestBody.data.firstName,
        lastName: requestBody.data.lastName,
        bio: "",
        passwordHash: hashPassword(requestBody.data.password),
      },
    });

    const authVerification = await prisma.authVerification.create({
      data: {
        user: { connect: { id: newUser.id } },
        type: AuthVerificationType.EMAIL_VERIFICATION,
      },
    });

    const token = jwt.sign(
      { email: newUser.email, id: authVerification.id },
      process.env.NEXTAUTH_SECRET ?? "",
    );
    const verifyLink = `${env.NEXT_PUBLIC_SITE_URL}/auth/verify/${token}`;
    await mailer.sendMail({
      from: '"SciQuel" <no-reply@sciquel.org>',
      replyTo: '"SciQuel Team" <team@sciquel.org>',
      to: requestBody.data.email,
      subject: "Complete your account registration",
      text: `Please complete your account registration by verifying your email with the following link: ${verifyLink}`,
    });
    return NextResponse.json({}, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Unable to complete request" },
      { status: 500 },
    );
  }
}
