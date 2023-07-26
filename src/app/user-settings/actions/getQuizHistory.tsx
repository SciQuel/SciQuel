import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function getSession() {
  return await getServerSession();
}

export default async function getQuizHistory() {
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
      include: {
        story: true,
      },
    });

    if (!quizs) {
      return null;
    }

    return quizs;
  } catch (err) {
    return null;
  }
}
