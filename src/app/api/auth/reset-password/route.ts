import { hashPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextResponse, type NextRequest } from "next/server";
import tokenSchema from "../tokenSchema";
import schema from "./schema";

export async function POST(request: NextRequest) {
  try {
    const requestBody = schema.safeParse(await request.json());
    if (!requestBody.success) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }
    const { token, password } = requestBody.data;
    const data = tokenSchema.safeParse(
      jwt.verify(token, process.env.NEXTAUTH_SECRET ?? ""),
    );
    if (!data.success) {
      return NextResponse.json(
        { error: "Unable to complete request" },
        { status: 500 },
      );
    }

    const authVerification = await prisma.authVerification.findUnique({
      where: { id: data.data.id },
    });

    if (!authVerification) {
      return NextResponse.json(
        { error: "The request is expired" },
        { status: 401 },
      );
    }

    await Promise.all([
      prisma.user.update({
        where: { email: data.data.email },
        data: { passwordHash: hashPassword(password) },
      }),
      prisma.authVerification.delete({
        where: { id: data.data.id },
      }),
    ]);
    return NextResponse.json({});
  } catch (err) {
    return NextResponse.json(
      { error: "Unable to complete request" },
      { status: 500 },
    );
  }
}
