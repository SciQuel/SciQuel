import { PrismaClient } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { checkValidInput } from "../tools/SchemaTool";
import { getSubpartByQuizQuestion } from "../tools/SubpartQuiz";
import User from "../tools/User";
import { postSchema, scoreSchema, storyIdSchema } from "./schema";
import {
  getPercentageQuizQuestionRight,
  getPercentageQuizStoryGrade,
  grading,
  QUIZ_TYPE_HANDLER,
} from "./tools";

const prisma = new PrismaClient();
/**
 * grade user answer and give out grade result, explanation
 * and percentage of people answer right
 */
export async function POST(req: NextRequest) {
  try {
    const user = new User();
    //check valid input
    const parseResult = checkValidInput([postSchema], [await req.json()]);
    if (parseResult.nextErrorReponse) {
      return parseResult.nextErrorReponse;
    }
    const [bodyParam] = parseResult.parsedData;
    const userIdPromise = user.getUserId();

    const quizQuestionPromise = getSubpartByQuizQuestion(
      bodyParam.quiz_question_id,
      true,
      true,
    );
    const [userId, quizQuestion] = await Promise.all([
      userIdPromise,
      quizQuestionPromise,
    ]);

    if (!quizQuestion) {
      return new NextResponse(
        JSON.stringify({ error: "Quiz Question not found" }),
        {
          status: 404,
        },
      );
    }

    //start grading
    const {
      errorMessage,
      errors,
      results,
      score,
      categoriesResult,
      userResponseSubpart,
      correctOptionCounts,
    } = grading({
      ...quizQuestion,
      userAnswer: bodyParam.answer,
    });
    if (errorMessage) {
      return new NextResponse(JSON.stringify({ error: errorMessage, errors }), {
        status: 400,
      });
    }
    //if user is logged in, save user response
    if (userId) {
      const quizResult = await prisma.quizResult.findFirst({
        where: {
          userId,
          storyId: quizQuestion.storyId,
        },
        orderBy: {
          createAt: "desc",
        },
        select: {
          id: true,
          quizQuestionIdRemain: true,
          quizType: true,
          storyId: true,
          totalCorrectAnswer: true,
          used: true,
        },
      });
      if (!quizResult) {
        return new NextResponse(
          JSON.stringify({ error: "Quiz result not found" }),
          {
            status: 404,
          },
        );
      }
      const saveDataResult = await QUIZ_TYPE_HANDLER[quizResult.quizType]({
        quizResult,
        categoriesResult,
        userResponseSubpart,
        score,
        results,
        quizQuestion,
        userId,
      });
      if (saveDataResult.errorRes) {
        return saveDataResult.errorRes;
      }
    }

    //count how many people answer correct question
    const percentagePeopleAnswerCorrect = await getPercentageQuizQuestionRight(
      bodyParam.quiz_question_id,
      "POST_QUIZ",
    );

    //return result
    return new NextResponse(
      JSON.stringify({
        message: "Quiz question graded",
        score,
        max_score: quizQuestion.maxScore,
        categories_result: categoriesResult,
        //extra option count for complex matching
        correct_option_counts: correctOptionCounts,
        //extra explanation for complex matching
        option_explanation:
          quizQuestion.questionType === "COMPLEX_MATCHING"
            ? quizQuestion.explanations?.[quizQuestion.explanations.length - 1]
            : undefined,

        results: results.map((value, index) => {
          return {
            correct: value,
            explanation: quizQuestion.explanations?.[index],
          };
        }),
        percent_people_answer_correct: percentagePeopleAnswerCorrect,
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    //get story_id and check type if exist
    const storyIdParam = searchParams.get("story_id");
    const scoreParam = searchParams.get("score");
    const result = checkValidInput(
      [storyIdSchema, scoreSchema],
      [storyIdParam, scoreParam],
    );
    //if there is an error input
    if (result.nextErrorReponse) {
      return result.nextErrorReponse;
    }

    const [storyId, score] = result.parsedData;
    //count how many people get exact score
    const percentagePeopleAnswerCorrect = await getPercentageQuizStoryGrade(
      storyId,
      score,
      "POST_QUIZ",
    );
    return new NextResponse(
      JSON.stringify({
        percent_people_get_score: percentagePeopleAnswerCorrect,
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
