import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { getSeriesSchema, postSeriesSchema, putSeriesSchema } from "./schema";

interface StoryinSeries {
  id: string;
  shortHeadline: string;
  storyURL: string;
}

interface NewSeries {
  id: string;
  title: string | null;
  createdAt: Date | null;
}

//get series based on id or title
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsedParams = getSeriesSchema.safeParse(
    Object.fromEntries(searchParams),
  );
  if (!parsedParams.success) {
    return NextResponse.json(
      { error: `Bad request. Validation Error Message ${parsedParams.error} ` },
      { status: 400 },
    );
  }
  try {
    const { id, title } = parsedParams.data;
    const allSeries = await prisma.series.findMany({
      where: {
        id: id,
        title: title
          ? {
              contains: JSON.stringify(title),
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
/*
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
      const newStoryIds = parsedData.stories
        ? parsedData.stories.map((story) => story.id)
        : series.storyId;
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
*/

export async function POST(req: NextRequest) {
  const seriesFormData = await req.formData();
  const parsedRequest = postSeriesSchema.safeParse(seriesFormData);
  if (!parsedRequest.success) {
    console.log(parsedRequest.error);
    return NextResponse.json(
      { error: "Bad Request. Validation Error." },
      { status: 400 },
    );
  }
  try {
    const parsedData = parsedRequest.data;
    const newSeries: NewSeries = await prisma.series.create({
      data: {
        title: parsedData.title,
      },
    });
    console.log(typeof parsedData.stories);
    const newStoryinSeries = await prisma.storyinSeries.createMany({
      data: parsedData.stories.map((story, id) => ({
        storyId: story.id,
        seriesId: newSeries.id,
        storyShortHeadline: story.shortHeadline,
        storyURL: story.storyURL,
        order: id + 1, //1 based index
      })),
    });
    return NextResponse.json({
      newSeries: newSeries,
      relations: newStoryinSeries,
    });
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

export async function PUT(req: NextRequest) {
  const seriesPutBody = (await req.json()) as string;
  const parsedRequest = putSeriesSchema.safeParse(seriesPutBody);
  console.log(parsedRequest);
  if (!parsedRequest.success) {
    console.log(parsedRequest.error);
    return NextResponse.json(
      { error: "Bad Request. Validation Error." },
      { status: 400 },
    );
  }
  try {
    const parsedData = parsedRequest.data;
    if (parsedData.id) {
      //Let prisma handle?
      const series = await prisma.series.findUnique({
        where: { id: parsedData.id },
      });
      if (!series) {
        return NextResponse.json(
          { error: "Series not found." },
          { status: 404 },
        );
      }
      let result = { series: series };
      if (parsedData.title) {
        const updatedSeries = await prisma.series.update({
          where: {
            id: parsedData.id,
          },
          data: {
            title: parsedData.title,
          },
        });
        result.series = updatedSeries;
      }
      if (parsedData.stories) {
        // const deletedRelations = await prisma.$transaction([
        //   prisma.storyinSeries.deleteMany({
        //     where: {
        //       seriesId: parsedData.id,
        //     },
        //   }),
        //   prisma.storyinSeries.createMany({
        //     data: parsedData.stories.map((story, id) => ({
        //       storyId: (story as unknown as StoryinSeries).id,
        //       seriesId: parsedData.id, //has verified that series id exists
        //       storyShortHeadline: (story as unknown as StoryinSeries)
        //         .shortHeadline,
        //       storyURL: (story as unknown as StoryinSeries).storyURL,
        //       order: id + 1, //1 base index
        //     })),
        //   }),
        // ]);
        const updatedRelations = await prisma.$transaction(async (tx) => {
          const deleted = await tx.storyinSeries.deleteMany({
            where: {
              seriesId: parsedData.id,
            },
          });
          if (parsedData.stories && parsedData.stories.length > 0) {
            const newRelations = await tx.storyinSeries.createMany({
              data: parsedData.stories.map((story, id) => ({
                storyId: (story as unknown as StoryinSeries).id,
                seriesId: parsedData.id,
                storyShortHeadline: (story as unknown as StoryinSeries)
                  .shortHeadline,
                storyURL: (story as unknown as StoryinSeries).storyURL,
                order: id + 1,
              })),
            });
            return { newRelations: newRelations };
          }
          return { deleted: deleted };
        });
        result = { ...result, ...updatedRelations };
      }
      return NextResponse.json({ result });
    }
  } catch (err) {
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
    console.log(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsedParams = getSeriesSchema.safeParse(
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
    const deletedStoryandRelations = await prisma.$transaction([
      prisma.series.delete({
        where: {
          id: id,
        },
      }),
      prisma.storyinSeries.deleteMany({
        where: {
          seriesId: id,
        },
      }),
    ]);
    return NextResponse.json({ deletedStoryandRelations });
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
