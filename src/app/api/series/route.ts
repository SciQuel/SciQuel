import { error } from "console";
import { parse } from "path";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { getSeriesSchema, patchSeriesSchema, putSeriesSchema } from "./schema";

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
          ? {
              contains: title,
            }
          : title,
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

export async function PUT(req: NextRequest) {
  const seriesFormData = await req.formData();
  const parsedRequest = putSeriesSchema.safeParse(seriesFormData);
  if (!parsedRequest.success) {
    console.log(parsedRequest.error);
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
  try {
    //update
    const parsedData = parsedRequest.data;

    //create
    if (!parsedData.stories) {
      return NextResponse.json(
        {
          message: "Bad Request. Missing both series id and connected stories",
        },
        { status: 400 },
      );
    }
    const newSeries = await prisma.series.create({
      data: {
        title: parsedData.title,
        stories: {
          connect: parsedData.stories
            ? parsedData.stories.map((storyId) => ({ id: storyId }))
            : [],
        },
      },
    });
    return NextResponse.json({ newSeries });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const parsedRequest = patchSeriesSchema.safeParse(formData);
    if (!parsedRequest.success) {
      console.log(parsedRequest.error);
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }
    //update
    const parsedData = parsedRequest.data;
    if (parsedData.id) {
      const series = await prisma.series.findUnique({
        where: { id: parsedData.id },
      });
      if (!series) {
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
      }
      const newStoryIds = parsedData.stories ?? series.storyId;
      const updatedSeries = await prisma.series.update({
        where: { id: parsedData.id },
        data: {
          title: parsedData.title,
          stories: {
            connect: newStoryIds.map((storyId) => ({ id: storyId })),
          },
        },
        include: {
          stories: true,
        },
      });
      return NextResponse.json({ updatedSeries });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
