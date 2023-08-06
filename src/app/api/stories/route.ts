import prisma from "@/lib/prisma";
import {
  Category,
  ContributionType,
  Prisma,
  StoryTopic,
  StoryType,
  type Story,
} from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import slug from "slug";
import { getStorySchema, postStorySchema } from "./schema";

interface GetStoryQuery {
  where: {
    OR?: object[];
    staffPick: boolean | undefined;
    tags?: object;
    storyType: StoryType | undefined;
    createdAt: object;
  };
}

export type Stories = (Story & {
  storyContributions: {
    user: {
      firstName: string;
      lastName: string;
    };
    contributionType: ContributionType;
  }[];
})[];

export type GetStoriesResult = {
  stories: Stories;
  page_number: number;
  total_pages: number;
};

export async function GET(req: Request) {
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
  } = parsedParams.data;

  const numPagesToSkip = (page && page - 1) || 0;
  const numStoriesPerPage = page_size || 10; // default page size

  // to include stories created on that date
  date_to?.setDate(date_to.getDate() + 1);

  try {
    const query: GetStoryQuery = {
      where: {
        ...(keyword
          ? {
              OR: [
                { title: { contains: keyword, mode: "insensitive" } },
                { summary: { contains: keyword, mode: "insensitive" } },
              ],
            }
          : {}),
        staffPick: staff_pick,
        ...(topic ? { tags: { has: topic } } : {}),
        storyType: type,
        createdAt: {
          gte: date_from,
          lt: date_to,
        },
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
      where: { ...query.where, category: Category.ARTICLE },
      orderBy: {
        updatedAt: "desc",
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
      console.log(e.message);
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    // all other errors
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const timestamp = new Date();
  const parsedBody = postStorySchema.safeParse(await request.json());
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  const { title, content } = parsedBody.data;

  const user = await prisma.user.findFirst({});
  if (!user) {
    return NextResponse.json({ error: "No user available" }, { status: 500 });
  }

  const storyContribution = await prisma.storyContribution.create({
    data: {
      user: { connect: { id: user.id } },
      story: {
        create: {
          storyType: StoryType.ARTICLE,
          category: Category.ARTICLE,
          title,
          titleColor: "#ffffff",
          slug: slug(title),
          summary: `summary of ${title}`,
          summaryColor: "#ffffff",
          tags: [StoryTopic.ASTRONOMY],
          published: true,
          staffPick: Math.random() > 0.5,
          thumbnailUrl: "/assets/images/bobtail.png",
          createdAt: timestamp,
          publishedAt: timestamp,
          updatedAt: timestamp,
        },
      },
      contributionType: ContributionType.AUTHOR,
    },
  });

  await prisma.storyContent.create({
    data: {
      story: { connect: { id: storyContribution.storyId } },
      content,
      createdAt: timestamp,
    },
  });

  return NextResponse.json({}, { status: 201 });
}
