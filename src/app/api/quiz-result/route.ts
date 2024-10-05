import prisma from "@/lib/prisma";
import { type QuizType } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { checkValidInput } from "../tools/SchemaTool";
import User from "../tools/User";
import { storyIdSchema } from "./schema";
import { createResponseQuizResult, getQuizResult } from "./tool";

interface QuizResultI {
  storyId: string;
  maxScore: number;
  quizQuestionIdRemain: string[];
  grades: {
    id: string;
    maxScore: number;
    totalScore: number;
  }[];
  quizType: QuizType;
  score: number;
  createAt: Date;
}

/**
 * get first quiz record and recent quiz record.
 * If story_id is included, get records base on story_id
 * If story_id is not included, get records base on user attempt
 */
export async function GET(req: NextRequest) {
  try {
    const user = new User();
    const userId = await user.getUserId();

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: "Authentication is required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const { searchParams } = new URL(req.url);

    //get story_id and check type if exist
    const storyIdParam = searchParams.get("story_id");
    let storyId = null;
    if (storyIdParam) {
      const { nextErrorReponse, parsedData } = checkValidInput(
        [storyIdSchema],
        [storyIdParam],
      );
      if (nextErrorReponse) {
        return nextErrorReponse;
      }
      storyId = parsedData[0];
    }
    const firstQuizResultPromise = getQuizResult("FIRST", userId, storyId);
    const mostRecentQuizResultPromise = getQuizResult(
      "RECENT",
      userId,
      storyId,
    );
    const [firstQuizResult, mostRecentQuizResult] = await Promise.all([
      firstQuizResultPromise,
      mostRecentQuizResultPromise,
    ]);
    return new NextResponse(
      JSON.stringify({
        first_quiz_record: createResponseQuizResult(
          firstQuizResult.quizResult,
          firstQuizResult.subpartArr,
        ),
        most_recent_quiz: createResponseQuizResult(
          mostRecentQuizResult.quizResult,
          mostRecentQuizResult.subpartArr,
        ),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
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
