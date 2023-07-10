import prisma from "@/lib/prisma";
import {
  ContributionType,
  StoryTopic,
  StoryType,
  type Story,
} from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import slug from "slug";
import { postStorySchema } from "./schema";

export type GetStoriesResult = (Story & {
  storyContributions: {
    user: {
      firstName: string;
      lastName: string;
    };
    contributionType: ContributionType;
  }[];
})[];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");
  const pageSize = searchParams.get("page_size");
  const staffPick = searchParams.get("staff_pick");

  let numPagesToSkip = 0;
  let numStoriesPerPage = 10; // default page size

  if (pageSize !== null) {
    // user specified page size
    const parsedPageSize =
      typeof pageSize === "string" ? parseInt(pageSize) : null;

    if (
      parsedPageSize === null ||
      isNaN(parsedPageSize) ||
      parsedPageSize < 1
    ) {
      // user requests a invalid page size
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    numStoriesPerPage = parsedPageSize;
  }

  if (page === null) {
    // return first page if user does not specify a page
    numPagesToSkip = 0;
  } else {
    // user specified page
    const parsedPage = typeof page === "string" ? parseInt(page) : null;

    if (parsedPage === null || isNaN(parsedPage) || parsedPage < 1) {
      // user requests a invalid page
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    numPagesToSkip = parsedPage - 1;
  }

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
    where: { staffPick: staffPick === "true" ? true : undefined },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return NextResponse.json(stories ?? []);
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
