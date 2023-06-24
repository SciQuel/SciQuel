import prisma from "@/lib/prisma";
import { sign } from "jsonwebtoken";
import { NextResponse, type NextRequest } from "next/server";
import schema from "./schema";

export default async function POST(request: NextRequest) {
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
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Unable to complete request" },
      { status: 500 },
    );
  }
}
