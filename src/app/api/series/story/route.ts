import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { getStorySeriesSchema } from "../schema";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsedParams = getStorySeriesSchema.safeParse(
    Object.fromEntries(searchParams),
  );
  if (!parsedParams.success) {
    return NextResponse.json(
      { error: `Bad request. Validation Error Message ${parsedParams.error} ` },
      { status: 400 },
    );
  }
  try {
    const { id } = parsedParams.data;
    const allSeries = await prisma.storyinSeries.findMany({
      where: {
        storyId: id,
      },
    });
    return NextResponse.json({ allSeries });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          error: `Bad Request. Prisma Error message: ${err.message}`,
          errorCode: err.code,
          meta: err.meta,
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
