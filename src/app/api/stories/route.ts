import prisma from "@/lib/prisma";
import { type ContributionType, type Story } from "@prisma/client";
import { NextResponse } from "next/server";

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

  let numPagesToSkip = 0;
  const numStoriesPerPage = 10;

  if (page === null) {
    // return first 10 stories if user does not specify a page
    numPagesToSkip = 0;
  } else {
    // return stories based on page
    const parsedPage = typeof page === "string" ? parseInt(page) : null;

    if (parsedPage === null || parsedPage < 1) {
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
    orderBy: {
      updatedAt: "desc",
    },
  });
  return NextResponse.json(stories ?? []);
}
