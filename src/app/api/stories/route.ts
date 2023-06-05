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

export async function GET() {
  const stories = await prisma.story.findMany({
    take: 4,
    include: {
      storyContributions: {
        select: {
          contributionType: true,
          user: { select: { firstName: true, lastName: true } },
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
  });
  return NextResponse.json(stories ?? []);
}
