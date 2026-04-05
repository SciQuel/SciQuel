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
    console.log(parsedParams.error);
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const { id, title } = parsedParams.data;
  if (!id && !title) {
    return NextResponse.json(
      { error: "Missing both id and title" },
      { status: 422 },
    );
  }
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
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          error: `Bad Request. Error message: ${err.message}`,
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
          message: "Bad Request. Missing connected stories array",
        },
        { status: 400 },
      );
    }
    const newSeries = await prisma.series.create({
      data: {
        title: parsedData.title,
        stories: {
          connect: parsedData.stories.map((story) => ({ id: story.id })),
        },
      },
    });
    const updatedStories = await prisma.story.updateMany({
      where: {
        id: {
          in: parsedData.stories.map((story) => story.id),
        },
      },
      data: {
        seriesId: {
          push: newSeries.id,
        },
        storySeriesShortHeadline: JSON.stringify(
          parsedData.stories.map((story) => story.shortHeadline),
        ),
      },
    });
    return NextResponse.json({
      newSeries: newSeries,
      updatedStories: updatedStories,
    });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          error: `Bad Request. Error message: ${err.message}`,
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
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          error: `Bad Request. Error message: ${err.message}`,
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
