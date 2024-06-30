/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient, type QuizQuestion, type Subpart } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { createQuizSchema } from "./schema";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const parsed = createQuizSchema.safeParse(requestBody);

    if (!parsed.success) {
      return new NextResponse(JSON.stringify({ error: parsed.error }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const quizData = parsed.data;

    const createdQuiz = await prisma.quizQuestion.create({
      data: {
        storyId: quizData.storyId,
        contentCategory: quizData.contentCategory,
        questionType: quizData.questionType,
        questionName: quizData.questionName,
        totalScore: quizData.totalScore,
        subparts: {
          create: quizData.subparts,
        },
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Quiz question created",
        quizData: createdQuiz,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
export type resp = {
  gradeSubpart: {
    explanation: string;
    isCorrect: boolean;
    subpartId: string;
  }[];
};

export type Questions = {
  id: string;
  question: string;
  options: string[];
  quizQuestionId: string;
};

export type Quizzes = {
  quizzes: {
    id: string;
    storyId: string;
    contentCategory: string;
    questionType: string;
    questionName: string;
    totalScore: number;
    subparts: Subpart[];
  }[];
  // quizzes: string[];
};

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const storyId = url.searchParams.get("storyId");

    if (!storyId) {
      return new NextResponse(
        JSON.stringify({ error: "storyId is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const quizzes = await prisma.quizQuestion.findMany({
      where: { storyId: storyId },
      include: {
        subparts: true,
      },
    });

    return new NextResponse(JSON.stringify({ quizzes }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
