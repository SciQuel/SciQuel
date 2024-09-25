import prisma from "@/lib/prisma";
import { type Contributor } from "@prisma/client";
import { getServerSession } from "next-auth";

export type ReadingHistoryType = {
  story: {
    storyContributions: {
      contributor: Contributor;
    }[];
    title: string;
    thumbnailUrl: string;
  };
};

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
      include: {
        story: true,
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
