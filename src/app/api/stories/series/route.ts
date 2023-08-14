import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { getSchema, postSchema, putSchema } from "./schema";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsedParams = getSchema.safeParse(Object.fromEntries(searchParams));
  if (!parsedParams.success) {
    return NextResponse.json(parsedParams.error, { status: 400 });
  }

  const { series_id } = parsedParams.data;

  try {
    const series = await prisma.series.findUnique({
      where: {
        id: series_id,
      },
    });

    if (series === null) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(series);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientValidationError) {
      console.log(e.message);
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    // all other errors
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const parsedBody = postSchema.safeParse(await request.json());
    if (!parsedBody.success) {
      return NextResponse.json(parsedBody.error, { status: 400 });
    }

    const { name, story_ids } = parsedBody.data;

    const series = await prisma.series.create({
      data: {
        name,
        stories: {
          connect: story_ids.map((id) => ({ id })),
        },
      },
    });

    return NextResponse.json(series);
  } catch (e) {
    // story_id not exist
    // body is invalid json
    if (
      e instanceof Prisma.PrismaClientValidationError ||
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof SyntaxError
    ) {
      console.log(e.message);
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    // all other errors
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const parsedBody = putSchema.safeParse(await request.json());
    if (!parsedBody.success) {
      return NextResponse.json(parsedBody.error, { status: 400 });
    }

    const { series_id, name, story_ids } = parsedBody.data;

    await prisma.series.update({
      where: {
        id: series_id,
      },
      data: {
        stories: {
          set: [],
        },
      },
    });

    const series = await prisma.series.update({
      where: {
        id: series_id,
      },
      data: {
        name,
        stories: {
          connect: story_ids.map((id) => ({ id })),
        },
      },
    });

    return NextResponse.json(series);
  } catch (e) {
    // story_id not exist
    // body is invalid json
    if (
      e instanceof Prisma.PrismaClientValidationError ||
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof SyntaxError
    ) {
      console.log(e.message);
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    // all other errors
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
