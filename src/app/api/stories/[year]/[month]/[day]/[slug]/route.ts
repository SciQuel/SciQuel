import prisma from "@/lib/prisma";
import { type ContributionType, type Story } from "@prisma/client";
import { DateTime } from "luxon";
import { NextResponse } from "next/server";

interface Params {
  slug: unknown;
  year: unknown;
  month: unknown;
  day: unknown;
}

export type GetStoryResult = Story & {
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
    bio: string | null;
  }[];
  storyContent: {
    content: string;
  }[];
};

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    const { searchParams } = new URL(req.url);

    const { year, month, day, slug } = params;

    const parsedYear = typeof year === "string" ? parseInt(year) : null;
    const parsedMonth = typeof month === "string" ? parseInt(month) : null;
    const parsedDay = typeof day === "string" ? parseInt(day) : null;

    if (
      typeof slug !== "string" ||
      parsedYear === null ||
      parsedMonth === null ||
      parsedDay === null
    ) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const includeContent = searchParams.get("include_content");

    const result = await prisma.story.findFirst({
      where: {
        slug: slug,
        publishedAt: {
          gte: DateTime.utc(
            parsedYear,
            parsedMonth,
            parsedDay,
            0,
            0,
            0,
          ).toJSDate(),
          lt: DateTime.utc(parsedYear, parsedMonth, parsedDay, 0, 0, 0)
            .plus({ days: 1 })
            .toJSDate(),
        },
      },
      include: {
        storyContributions: {
          select: {
            contributionType: true,
            otherContributorType: true,
            otherContributorCredit: true,
            contributorByline: true,
            bio: true,
            contributor: {
              select: {
                id: true,
                contributorSlug: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
        storyContent:
          includeContent === "true"
            ? {
                take: 1,
                orderBy: { createdAt: "desc" },
                select: { content: true },
              }
            : false,
      },
    });

    if (result === null) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
