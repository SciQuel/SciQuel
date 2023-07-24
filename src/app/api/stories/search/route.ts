import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getStorySchema } from "./schema";

interface Query {
  where: {
    OR?: object[];
    topic?: string;
    type?: string;
    date_from?: Date;
    date_to?: Date;
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsedParams = getStorySchema.safeParse(
    Object.fromEntries(searchParams),
  );
  if (!parsedParams.success) {
    return NextResponse.json(parsedParams.error, { status: 400 });
  }

  const { page, page_size, keyword, topic, type, date_from, date_to, sort_by } =
    parsedParams.data;

  const numPagesToSkip = (page && page - 1) || 0;
  const numStoriesPerPage = page_size || 10; // default page size

  // to include stories created on that date
  date_to?.setDate(date_to.getDate() + 1);

  try {
    const query: Query = {
      where: {
        ...(keyword
          ? {
              OR: [
                { title: { contains: keyword, mode: "insensitive" } },
                { summary: { contains: keyword, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(topic ? { tags: { has: topic } } : {}),
        ...(type ? { storyType: type } : {}),
        ...(date_from ? { createdAt: { gte: date_from } } : {}),
        ...(date_to ? { createdAt: { lt: date_to } } : {}),
      },
    };

    const stories = await prisma.story.findMany({
      skip: numPagesToSkip * numStoriesPerPage,
      take: numStoriesPerPage,
      include: {
        storyContributions: {
          select: {
            contributionType: true,
            user: { select: { firstName: true, lastName: true } },
          },
        },
      },
      where: query.where,
      orderBy: {
        ...(sort_by === "newest" ? { updatedAt: "desc" } : {}),
        ...(sort_by === "oldest" ? { updatedAt: "asc" } : {}),
      },
    });

    const numStories = await prisma.story.count({
      where: query.where,
    });

    return NextResponse.json(
      {
        stories,
        page_number: numPagesToSkip + 1,
        total_pages: Math.ceil(numStories / numStoriesPerPage),
      } ?? { stories: [] },
    );
  } catch (e) {
    if (e instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    // all other errors
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
