import prisma from "@/lib/prisma";
import {
  Category,
  Prisma,
  type ContributionType,
  type Story,
} from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { getStorySchema } from "./../schema";

export type Stories = (Story & {
  storyContributions: {
    contributor: {
      firstName: string;
      lastName: string;
    };
    contributionType: ContributionType;
  }[];
})[];

export type GetLatestStoriesResult = {
  stories: Stories;
  page_number: number;
  total_pages: number;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsedParams = getStorySchema.safeParse(
    Object.fromEntries(searchParams),
  );
  if (!parsedParams.success) {
    return NextResponse.json(parsedParams.error, { status: 400 });
  }

  const {
    page,
    page_size,
    keyword,
    staff_pick,
    topic,
    type,
    date_from,
    date_to,
    sort_by,
    published,
  } = parsedParams.data;

  if (published === false) {
    const session = await getServerSession();
    const user = await prisma.user.findUnique({
      where: { email: session?.user.email ?? "noemail" },
    });

    if (!user || !user.roles.includes("EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const numPagesToSkip = (page && page - 1) || 0;
  const numStoriesPerPage = page_size || 10; // default page size

  date_to?.setDate(date_to.getDate() + 1);

  try {
    const query: Prisma.StoryFindManyArgs = {
      where: {
        ...(keyword
          ? {
              OR: [
                { title: { contains: keyword, mode: "insensitive" } },
                { summary: { contains: keyword, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(staff_pick !== undefined ? { staffPick: staff_pick } : {}),
        // staffPick: staff_pick,
        ...(topic ? { tags: { has: topic } } : {}),
        storyType: type,
        createdAt: {
          gte: date_from,
          lt: date_to,
        },
        published,
      },
    };

    const stories = await prisma.story.findMany({
      skip: numPagesToSkip * numStoriesPerPage,
      take: numStoriesPerPage,
      include: {
        storyContributions: {
          select: {
            contributionType: true,
            contributor: { select: { firstName: true, lastName: true } },
          },
        },
      },
      where: { ...query.where, category: Category.ARTICLE },
      orderBy: {
        publishedAt: "desc",
        // ...(sort_by === "newest" ? { publishedAt: "desc" } : {}),
        // ...(sort_by === "oldest" ? { publishedAt: "asc" } : {}),
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
      console.log(e.message);
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    return NextResponse.json({ error: e }, { status: 500 });
  }
}
