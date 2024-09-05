import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getSchema, postSchema } from "./schema";

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

    return NextResponse.json({ total: count || 0 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientValidationError) {
      console.log(e.message);
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    // all other errors
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const parsedParams = postSchema.safeParse(await req.json());
    if (!parsedParams.success) {
      return NextResponse.json(
        {
          error: parsedParams.error.errors[0].message,
          errors: parsedParams.error.errors.map((err) => err.message),
        },
        { status: 400 },
      );
    }
    const { start_date, end_date, topic } = parsedParams.data;
    const countPromise = prisma.pageView.count({
      where: {
        story: {
          topics: {
            has: topic,
          },
        },
        createdAt: {
          lte: new Date(end_date),
          gte: new Date(start_date),
        },
      },
    });
    const totalPromise = prisma.pageView.count({
      where: {
        createdAt: {
          lte: new Date(end_date),
          gte: new Date(start_date),
        },
      },
    });
    const [count, total] = await Promise.all([countPromise, totalPromise]);
    return NextResponse.json({
      avg: total && count ? Math.round((count / total) * 10000) / 100 : 0,
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientValidationError) {
      console.log(e.message);
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    // all other errors
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
