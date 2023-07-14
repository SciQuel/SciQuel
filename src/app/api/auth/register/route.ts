import { hashPassword, sendAccountVerification } from "@/lib/auth";
import prisma from "@/lib/prisma";
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

    await sendAccountVerification(newUser);
    return NextResponse.json({}, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unable to complete request" },
      { status: 500 },
    );
  }
}
