import prisma from "@/lib/prisma";
import { type User } from "@prisma/client";
import { getServerSession } from "next-auth";

export type ReadingHistory = {
  story: {
    storyContributions: {
      user: User;
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

    const quizs = await prisma.quiz.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      select: {
        story: {
          select: {
            title: true,
            thumbnailUrl: true,
            storyContributions: {
              select: {
                user: true,
              },
            },
          },
        },
      },
    });

    return quizs;
  } catch (err) {
    return null;
  }
}
