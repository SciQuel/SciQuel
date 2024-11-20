import prisma from "@/lib/prisma";
import {
  type Category,
  type ContributionType,
  type Contributor,
  type StoryTopic,
  type StoryType,
} from "@prisma/client";
import { getServerSession } from "next-auth";

interface PageViewGet {
  createdAt: Date;
  story: {
    storyContributions: {
      contributor: Contributor;
      id: string;
      contributionType: ContributionType;
      otherContributorType: string | null;
    }[];
    id: string;
    storyType: StoryType;
    category: Category;

    title: string;

    slug: string;

    summary: string;

    tags: StoryTopic[];

    thumbnailUrl: string;
    coverCaption: string;
    publishedAt: Date;
  };
}

export type ReadingHistory = PageViewGet[];

export async function getSession() {
  return await getServerSession();
}

export default async function getReadingHistory() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const views = await prisma.pageView.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      select: {
        createdAt: true,
        story: {
          select: {
            id: true,
            storyType: true,
            category: true,
            title: true,
            slug: true,
            summary: true,
            tags: true,
            thumbnailUrl: true,
            coverCaption: true,
            publishedAt: true,
            storyContributions: {
              select: {
                id: true,
                contributor: true,
                contributionType: true,
                otherContributorType: true,
              },
            },
          },
        },
      },
      take: 15,
      orderBy: {
        createdAt: "desc",
      },
    });

    return views;
  } catch (err) {
    console.log(err);
    return null;
  }
}
