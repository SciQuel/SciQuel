/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { createQuizSchema, getQuizzesSchema } from "./schema";

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
        subparts: quizData.subparts,
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

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const storyId = url.searchParams.get("storyId");

    if (!storyId) {
      return new NextResponse(
        JSON.stringify({ error: "storyId is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const quizzes = await prisma.quizQuestion.findMany({
      where: {
        storyId: storyId,
      },
    });

    return new NextResponse(JSON.stringify({ quizzes }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("error processing request:", error);
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
