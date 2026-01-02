import prisma from "@/lib/prisma";
import { type Prisma } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { checkBans, checkSpam } from "../contact/tools";
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
  const ip = req.headers.get("x-forwarded-for");
  const isBanned = await checkBans(
    parsedRequest.data.email,
    ip ? ip : undefined,
  );
  if (isBanned) {
    return NextResponse.json(
      {
        error: "Banned email or IP found",
      },
      { status: 403 },
    );
  }
  if (isBanned === undefined) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
  if (ip) {
    const ipSpam = await checkSpam(false, ip);
    if (ipSpam) {
      return NextResponse.json(
        {
          error: "Banned email or IP found",
        },
        { status: 403 },
      );
    }
    if (ipSpam === undefined) {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  }
  const emailSpam = await checkSpam(true, parsedRequest.data.email);
  if (emailSpam) {
    return NextResponse.json(
      {
        error: "Banned email or IP found",
      },
      { status: 403 },
    );
  }

  if (emailSpam === undefined) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
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
