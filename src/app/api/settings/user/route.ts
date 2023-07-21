import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import schema from "./schema";

export async function GET(req: NextRequest) {
  try {
    const requestBody = schema.safeParse(await req.json());
    if (!requestBody.success) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: requestBody.data.email },
    });

    if (user === null) {
      return NextResponse.json({ error: "User not find" }, { status: 400 });
    }

    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json(
      { error: "Unable to complete request" },
      { status: 500 },
    );
  }
}
