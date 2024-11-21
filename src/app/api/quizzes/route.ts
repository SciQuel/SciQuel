import { PrismaClient } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { checkValidInput } from "../tools/SchemaTool";
import User from "../tools/User";
import { quizTypeSchema, storyIdSchema } from "./schema";
import { getQuizzes, handleQuizResult } from "./tools";

<<<<<<< HEAD
/** Change all safe parse with checkValidInput */
const prisma = new PrismaClient();

/** Create a new quiz for story */
export async function POST(req: NextRequest) {
  try {
    //check valid user
    const user = new User();
    const isEditor = await user.isEditor();
    const userId = await user.getUserId();
    if (!isEditor || !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    //check valid body param
    const requestBody = await req.json();
    const parseResult = checkValidInput([modifiedQuizSchema], [requestBody]);
    if (parseResult.nextErrorReponse) {
      return parseResult.nextErrorReponse;
    }
    const [quizData] = parseResult.parsedData;
    const CountStoryExist = await prisma.story.count({
      where: { id: quizData.story_id },
    });
    if (CountStoryExist === 0) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    //start create quiz
    const { subpartPromise, errorMessage, errors } = createQuizSubpart({
      subpartData: quizData.subpart,
      question_type: quizData.question_type,
    });
    const subpart = await subpartPromise;
    if (errorMessage) {
      return NextResponse.json(
        { error: errorMessage, errors },
        { status: 400 },
      );
    }
    if (!subpart) {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
    const createdQuiz = await prisma.quizQuestion.create({
      data: {
        storyId: quizData.story_id,
        contentCategory: quizData.content_category,
        questionType: quizData.question_type,
        maxScore: quizData.max_score,
        subpartId: subpart.id,
        subheader: quizData.subheader,
      },
    });
    await prisma.quizQuestionRecord.create({
      data: {
        staffId: userId,
        updateType: "CREATE",
        quizQuestionId: createdQuiz.id,
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Quiz question created",
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

/** give a list of quiz questions from story */
=======
const prisma = new PrismaClient();

/**
 * give a list of quiz questions from story
 */
>>>>>>> origin/quiz_back_end
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  try {
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
        quiz_result_id: quizResult?.id || "",
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
