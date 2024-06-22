/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Prisma, PrismaClient, QuizType } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { checkValidInput } from "../tools/SchemaTool";
import { getSubpartQuizAnswear } from "../tools/SubpartQuiz";
import User from "../tools/User";
import { postSchema, scoreSchema, storyIdSchema } from "./schema";
import { grading, insertIfNotExists } from "./tools";

interface QuizRecordI {
  storyId: string;
  maxScore: number;
  grades: {
    userResponseSubpart: {
      id: string;
    };
    maxScore: number;
    totalScore: number;
  }[];
  quizType: QuizType;
  score: number;
  createAt: Date;
}

const ROUND_UP_DECIMAL = 1;
const prisma = new PrismaClient();

/**
 * grade user answer and give out grade result, explaination
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
    //get quiz record
    const quizRecordPromise = prisma.quizRecord.findUnique({
      where: { id: bodyParam.quiz_record_id },
      select: {
        quizQuestionIdRemain: true,
        storyId: true,
        totalCorrectAnswer: true,
      },
    });
    const userIdPromise = user.getUserId();
    const quizQuestionPromise = getSubpartQuizAnswear(
      bodyParam.quiz_question_id,
    );
    const [quizQuestion, quizRecord, userId] = await Promise.all([
      quizQuestionPromise,
      quizRecordPromise,
      userIdPromise,
    ]);
    if (!quizRecord) {
      return new NextResponse(
        JSON.stringify({ error: "Quiz Record not found" }),
        {
          status: 404,
        },
      );
    }
    if (!quizQuestion) {
      return new NextResponse(
        JSON.stringify({ error: "Quiz Question not found" }),
        {
          status: 404,
        },
      );
    }

    //check quiz question id in quiz record
    const indexFound = quizRecord.quizQuestionIdRemain.indexOf(
      quizQuestion.quizQuestionId,
    );
    if (indexFound === -1) {
      return new NextResponse(
        JSON.stringify({ error: "This Quiz Question is already graded" }),
        {
          status: 403,
        },
      );
    }

    //start grading
    const { errorMessage, errors, results, score, userResponseSubpart } =
      grading({
        ...quizQuestion,
        userAnswer: bodyParam.answer,
      });
    if (errorMessage) {
      return new NextResponse(JSON.stringify({ error: errorMessage, errors }), {
        status: 400,
      });
    }

    //store value to put in database
    const isCorrect = results.every((result) => result.every((val) => val));
    const isLastQuestion = quizRecord.quizQuestionIdRemain.length === 1;
    //create user response
    const userRes = await prisma.userResponseSubpart.create({
      data: {
        userId,
        userAns: userResponseSubpart,
        quizQuestionId: quizQuestion.quizQuestionId,
        questionType: quizQuestion.questionType,
      },
    });

    //create grade
    const createGradePromise = prisma.grade.create({
      data: {
        userId,
        userResponseSubpartId: userRes.id,
        quizQuestionId: quizQuestion.quizQuestionId,
        totalScore: score,
        maxScore: quizQuestion.maxScore,
        quizRecordId: bodyParam.quiz_record_id,
      },
    });

    //remove graded quizQuestionId from quizQuestionIdRemain
    const updatequizRecordPromise = prisma.quizRecord.update({
      where: { id: bodyParam.quiz_record_id },
      data: {
        score: { increment: score },
        quizQuestionIdRemain: quizRecord.quizQuestionIdRemain.filter(
          (str, index) => index !== indexFound,
        ),
        totalCorrectAnswer: { increment: isCorrect ? 1 : 0 },
        lastUpdate: new Date(),
      },
    });

    const userFirstAnsPromise = insertIfNotExists<
      "QuestionAnswerFirstTime",
      Prisma.QuestionAnswerFirstTimeWhereInput,
      Prisma.QuestionAnswerFirstTimeCreateInput
    >({
      model: "QuestionAnswerFirstTime",
      where: userId
        ? {
            userId: userId,
            quizQuestionId: quizQuestion.quizQuestionId,
          }
        : null,
      data: {
        userId: userId,
        quizQuestionId: quizQuestion.quizQuestionId,
        correct: isCorrect,
      },
    });

    //create dummy promise
    let userFirstScorePromise = new Promise((resolve, reject) => {
      resolve(0);
    });
    if (isLastQuestion) {
      insertIfNotExists<
        "StoryQuizScoreFirstTime",
        Prisma.StoryQuizScoreFirstTimeWhereInput,
        Prisma.StoryQuizScoreFirstTimeCreateInput
      >({
        model: "StoryQuizScoreFirstTime",
        where: userId
          ? {
              userId: userId,
              storyId: quizRecord.storyId,
            }
          : null,
        data: {
          userId,
          storyId: quizRecord.storyId,
          totalCorrectAnswer:
            quizRecord.totalCorrectAnswer + (isCorrect ? 1 : 0),
        },
      });
    }
    await Promise.all([
      createGradePromise,
      updatequizRecordPromise,
      userFirstAnsPromise,
      userFirstScorePromise,
    ]);

    //count how many people answer correct question
    const countPeopleAnswerCorrectPromise =
      prisma.questionAnswerFirstTime.count({
        where: { quizQuestionId: quizQuestion.quizQuestionId, correct: true },
      });
    const countPeopleAnswerPromise = prisma.questionAnswerFirstTime.count({
      where: { quizQuestionId: quizQuestion.quizQuestionId },
    });
    const [countPeopleAnswerCorrect, countPeopleAnswer] = await Promise.all([
      countPeopleAnswerCorrectPromise,
      countPeopleAnswerPromise,
    ]);
    const percentage = (countPeopleAnswerCorrect / countPeopleAnswer) * 100;
    const percentageRoundUp =
      Math.round(percentage * Math.pow(10, ROUND_UP_DECIMAL)) /
      Math.pow(10, ROUND_UP_DECIMAL);
    //return result
    return new NextResponse(
      JSON.stringify({
        message: "Quiz question graded",
        score,
        max_score: quizQuestion.maxScore,
        results: results.map((value, index) => {
          return {
            correct: value,
            explaination: quizQuestion.explanations[index],
          };
        }),
        percent_people_answer_correct: percentageRoundUp,
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
    const user = new User();

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
    //count how many people answer correct question
    const countPeopleGetExactScorePromise =
      prisma.storyQuizScoreFirstTime.count({
        where: { storyId: storyId, totalCorrectAnswer: score },
      });
    const countPeopleGetScoreStoryPromise =
      prisma.storyQuizScoreFirstTime.count({
        where: { storyId: storyId },
      });
    const [countPeopleGetExactScore, countPeopleGetScoreStory] =
      await Promise.all([
        countPeopleGetExactScorePromise,
        countPeopleGetScoreStoryPromise,
      ]);
    const percentage =
      (countPeopleGetExactScore / countPeopleGetScoreStory) * 100;
    const percentageRoundUp =
      Math.round(percentage * Math.pow(10, ROUND_UP_DECIMAL)) /
      Math.pow(10, ROUND_UP_DECIMAL);
    return new NextResponse(
      JSON.stringify({
        percent_people_get_score: percentageRoundUp,
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
