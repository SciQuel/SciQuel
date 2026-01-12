import prisma from "@/lib/prisma";
import { type Prisma } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { emailSchema } from "./schema";

export async function POST(req: NextRequest) {
  const parsedRequest = emailSchema.safeParse(await req.json());

  if (!parsedRequest.success) {
    return NextResponse.json(
      {
        error: parsedRequest.error.message
          ? parsedRequest.error.message
          : "Bad Request",
      },
      { status: 400 },
    );
  }
  
  try {
    const timestamp = new Date();

    const data: Prisma.EmailCreateInput = {
      email: parsedRequest.data.email,
      createdAt: timestamp,
    };

    const emailDocument = await prisma.email.create({
      data: data,
    });

    return NextResponse.json({ id: emailDocument });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
