import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { getSeriesSchema } from "./schema";

//get series based on id or title
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsedParams = getSeriesSchema.safeParse(
    Object.fromEntries(searchParams),
  );
  if (!parsedParams.success) {
    return NextResponse.json(parsedParams.error, { status: 400 });
  }
  const { id, title } = parsedParams.data;
  try {
    const allSeries = await prisma.series.findMany({
      where: {
        id: id,
        title: title
          ? title
          : {
              contains: title,
            },
      },
    });
    return NextResponse.json({
      allSeries,
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
