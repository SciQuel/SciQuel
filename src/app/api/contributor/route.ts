import prisma from "@/lib/prisma";
import {
  type ContributionType,
  type Contributor,
  type Prisma,
  type Story,
} from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { ContributorGetSchema } from "./schema";

type StoryResult = Story & {
  storyContributions: {
    contributor: {
      id: string;
      contributorSlug: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
    contributionType: ContributionType;
    otherContributorType: string | undefined;
    otherContributorCredit: string | undefined;
    contributorByline: string;
  }[];
  storyContent: {
    content: string;
  }[];
};

export interface GetContributionResult {
  contributor: Contributor;
  stories: StoryResult[];
  count: number;
}

/**
 * one api for every single story a contributor has worked on sorted by time (given the user id) one
 * api for the same thing, but for stories that have been staff picked I'll do do a single api that
 * determines if we should do staff picked based on input
 *
 * example url:
 * http://localhost:3000/api/contributor?contributorId=660778a163c61d29bd4f8de4&staffPick=True
 * Parameter: userId(id), staffPick(string: "True" | "False") return: all contributions by the
 * userId ordered in descending order by story creation date
 */

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const objectFromUrl = Object.fromEntries(url.searchParams);
  const parsed = ContributorGetSchema.safeParse(objectFromUrl);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { contributorSlug, staffPick, pageNum } = parsed.data;

  const storyArgs: Prisma.StoryFindManyArgs & {
    where: Prisma.StoryWhereInput;
  } = {
    take: 9,
    where: {
      published: {
        equals: true,
      },
      storyContributions: {
        some: {
          contributor: {
            contributorSlug: {
              equals: contributorSlug,
            },
          },
        },
      },
    },
    include: {
      storyContributions: {
        select: {
          contributionType: true,
          otherContributorCredit: true,
          otherContributorType: true,

          contributor: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  };

  const countArgs: Prisma.StoryCountArgs & {
    where: Prisma.StoryWhereInput;
  } = {
    where: {
      published: {
        equals: true,
      },
      storyContributions: {
        some: {
          contributor: {
            contributorSlug: {
              equals: contributorSlug,
            },
          },
        },
      },
    },
  };

  if (staffPick) {
    storyArgs.where.staffPick = true;
    countArgs.where.staffPick = true;
  }

  if (pageNum) {
    storyArgs["skip"] = pageNum * 9;
  }

  try {
    const contributor = await prisma.contributor.findUnique({
      where: {
        contributorSlug: contributorSlug,
      },
    });

    if (contributor == null) {
      return NextResponse.json(
        { error: "Contributor Does Not Exist" },
        { status: 404 },
      );
    }

    const stories = await prisma.story.findMany(storyArgs);
    const count = await prisma.story.count(countArgs);

    return NextResponse.json({
      contributor: contributor,
      stories: stories,
      count: count,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
