import prisma from "@/lib/prisma";
import { type Quiz, type Story } from "@prisma/client";
import { getServerSession } from "next-auth";

type QuizAndStory = Quiz & { story: Story };

export async function getSession() {
  return await getServerSession();
}

export default async function getQuizHistory() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const quizs = (await prisma.quiz.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      include: {
        story: true,
      },
    })) as QuizAndStory[];

    if (!quizs) {
      return null;
    }

    return quizs;
  } catch (err) {
    return null;
  }
}
