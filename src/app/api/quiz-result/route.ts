import { QuizType } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { checkValidInput } from "../tools/SchemaTool";
import User from "../tools/User";
import { quizTypeSchema, storyIdSchema } from "./schema";
import { createResponseQuizResult, getQuizResult } from "./tool";

/**
 * get first quiz record and recent quiz record.
 * If story_id is included, get records base on story_id
 * If story_id is not included, get records base on user attempt
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
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
    //get story_id and check type if exist
    const storyIdParam = searchParams.get("story_id");
    const quizTypeParam = searchParams.get("quiz_type") || QuizType.POST_QUIZ;
    const { nextErrorReponse, parsedData } = checkValidInput(
      [storyIdSchema, quizTypeSchema],
      [storyIdParam, quizTypeParam],
    );
    if (nextErrorReponse) {
      return nextErrorReponse;
    }
    const [storyId, quizType] = parsedData;
    const firstQuizResultPromise = getQuizResult(
      "FIRST",
      userId,
      quizType,
      storyId,
    );
    const mostRecentQuizResultPromise = getQuizResult(
      "RECENT",
      userId,
      quizType,
      storyId,
    );
    const [firstQuizResult, mostRecentQuizResult] = await Promise.all([
      firstQuizResultPromise,
      mostRecentQuizResultPromise,
    ]);
    return new NextResponse(
      JSON.stringify({
        first_quiz_record: createResponseQuizResult(firstQuizResult),
        most_recent_quiz: createResponseQuizResult(mostRecentQuizResult),
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
