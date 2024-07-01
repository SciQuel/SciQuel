import prisma from "@/lib/prisma";
import { type QuizType, type StoryTopic } from "@prisma/client";
import { getServerSession } from "next-auth";

export type QuizHistory = {
  story: {
    title: string;
    topics: StoryTopic[];
  };
  quizType: QuizType;
  score: number;
  totalScore: number;
  date: Date;
};

export async function getSession() {
  return await getServerSession();
}

export default async function getQuizHistory() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const quizzes = (await prisma.quiz.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      select: {
        quizType: true,
        score: true,
        totalScore: true,
        date: true,
        story: {
          select: {
            title: true,
            topics: true,
          },
        },
      },
    })) as QuizHistory[];

    if (!quizzes) {
      return null;
    }

    return quizzes;
  } catch (err) {
    return null;
  }
}
