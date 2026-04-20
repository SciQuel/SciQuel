import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getSchema } from "./schema";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsedParams = getSchema.safeParse(Object.fromEntries(searchParams));

  if (!parsedParams.success) {
    return NextResponse.json(parsedParams.error, { status: 400 });
  }

  const { story_id } = parsedParams.data;

  try {
    const count = await prisma.pageView.count({
      where: {
        storyId: story_id,
      },
    });

    return NextResponse.json({ count });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientValidationError) {
      console.log(e.message);
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    // all other errors
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
