import { PrismaClient } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { checkValidInput } from "../tools/SchemaTool";
import User from "../tools/User";
import {
  modifiedQuizSchema,
  quizQuestionIdSchema,
  quizTypeSchema,
  storyIdSchema,
} from "./schema";
import { getQuizzes, handleQuizResult } from "./tools";

const prisma = new PrismaClient();

/**
 * give a list of quiz questions from story
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const storyIdParam = url.searchParams.get("story_id");
    const quizTypeParam = url.searchParams.get("quiz_type");
    const user = new User();
    const parseResult = checkValidInput(
      [quizTypeSchema, storyIdSchema],
      [quizTypeParam, storyIdParam],
    );

    if (parseResult.nextErrorReponse) {
      return parseResult.nextErrorReponse;
    }

    const [quizType, storyId] = parseResult.parsedData;

    const userId = await user.getUserId();
    let quizResult = userId
      ? await prisma.quizResult.findFirst({
          where: {
            storyId: storyId,
            userId: userId,
          },
          orderBy: {
            createAt: "desc",
          },
          select: {
            id: true,
            quizQuestionIdRemain: true,
            quizType: true,
            used: true,
          },
        })
      : null;
    if (quizResult?.quizType === "POST_QUIZ" && quizType === "PRE_QUIZ") {
      return NextResponse.json(
        {
          error:
            "Can not get pre-quiz questions if post-quiz questions is already used",
        },
        { status: 403 },
      );
    }

    const { quizzes, subparts } = await getQuizzes({ quizResult, storyId });
    if (userId) {
      quizResult = await handleQuizResult({
        oldQuizResult: quizResult,
        quizzes,
        storyId,
        quizType,
        userId,
      });
    }
    //any key that have value is undefined, when JSON stringify that key will be removed from obj
    const quizResponse = quizzes.map((quiz, index) => {
      const { subheader, questionType, id, maxScore } = quiz;
      return {
        sub_header: subheader,
        question_type: questionType,
        quiz_question_id: id,
        max_score: maxScore,
        ...subparts[index],
      };
    });
    return new NextResponse(
      JSON.stringify({
        quizzes: quizResponse,
        quiz_record_id: quizResult?.id || "",
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
