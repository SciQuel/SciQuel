/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { checkValidInput } from "../../tools/SchemaTool";
import User from "../../tools/User";
import {
  modifiedQuizSchema,
  quizQuestionIdSchema,
  storyIdSchema,
} from "../schema";
import {
  createEditQuizResponse,
  createQuizSubpart,
  getQuizzes,
} from "../tools";

/**
 * Create a new quiz for story.
 */
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
    const parseResult = checkValidInput(
      [modifiedQuizSchema],
      [await req.json()],
    );
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
      questionType: quizData.question_type,
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
    const additionResponse = createEditQuizResponse(
      quizData.question_type,
      subpart,
    );
    return new NextResponse(
      JSON.stringify({
        message: "Quiz question created",
        sub_header: createdQuiz.subheader,
        question_type: createdQuiz.questionType,
        quiz_question_id: createdQuiz.id,
        max_score: createdQuiz.maxScore,
        ...additionResponse,
      }),
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

//delete quiz question from quiz_question_id
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const user = new User();
    const userId = await user.getUserId();
    const isEditor = await user.isEditor();
    const quizQuestionIdParam = url.searchParams.get("quiz_question_id");
    console.log(quizQuestionIdParam);
    const { nextErrorReponse, parsedData } = checkValidInput(
      [quizQuestionIdSchema],
      [quizQuestionIdParam],
    );
    if (nextErrorReponse) {
      return nextErrorReponse;
    }
    const [quizQuestionId] = parsedData;
    if (!userId || !isEditor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quizQuestionCheck = await prisma.quizQuestion.findFirst({
      where: { id: quizQuestionId, deleted: false },
      select: { subpartId: true, questionType: true },
    });

    if (!quizQuestionCheck) {
      return new NextResponse(
        JSON.stringify({ error: "Quiz question not found" }),
        {
          status: 404,
        },
      );
    }

    const quizQuestionDeletePromise = prisma.quizQuestion.update({
      where: { id: quizQuestionId },
      data: { deleted: true },
    });
    const createQuizQuestionRecordPromise = prisma.quizQuestionRecord.create({
      data: {
        staffId: userId,
        updateType: "DELETE",
        quizQuestionId: quizQuestionId,
      },
    });
    await Promise.all([
      quizQuestionDeletePromise,
      createQuizQuestionRecordPromise,
    ]);

    return new NextResponse(
      JSON.stringify({
        message: "Quiz question deleted",
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

//update quiz question from quiz_question_id
export async function PATCH(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const quizQuestionIdParam = url.searchParams.get("quiz_question_id");
    const user = new User();
    const userId = await user.getUserId();
    const isEditor = await user.isEditor();
    //only editor allow to use this method
    if (!isEditor || userId == null) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parseResult = checkValidInput(
      [quizQuestionIdSchema, modifiedQuizSchema],
      [quizQuestionIdParam, await req.json()],
    );

    if (parseResult.nextErrorReponse) {
      return parseResult.nextErrorReponse;
    }

    const [quizQuestionId, quizData] = parseResult.parsedData;
    const quizQuestionCheck = await prisma.quizQuestion.findFirst({
      where: { id: quizQuestionId, deleted: false },
      select: { subpartId: true, questionType: true },
    });

    if (!quizQuestionCheck) {
      return new NextResponse(
        JSON.stringify({ error: "Quiz question not found" }),
        {
          status: 404,
        },
      );
    }

    if (quizQuestionCheck.questionType !== quizData.question_type) {
      return new NextResponse(
        JSON.stringify({ error: "Can not change type of quiz question" }),
        {
          status: 400,
        },
      );
    }

    const { errorMessage, subpartPromise, errors } = createQuizSubpart({
      questionType: quizQuestionCheck.questionType,
      subpartData: quizData.subpart,
    });
    if (errorMessage) {
      return NextResponse.json(
        { error: errorMessage, errors },
        { status: 400 },
      );
    }
    const subpart = await subpartPromise;
    if (!subpart) {
      throw new Error("Unable to update quiz question");
    }
    const createQuizQuestionPromise = prisma.quizQuestion.create({
      data: {
        storyId: quizData.story_id,
        questionType: quizData.question_type,
        maxScore: quizData.max_score,
        subheader: quizData.subheader,
        subpartId: subpart?.id || "",
      },
    });
    const hideOldQuizQuestionPromise = prisma.quizQuestion.update({
      data: {
        deleted: true,
      },
      where: {
        id: quizQuestionId,
      },
    });
    const [quizQuestion] = await Promise.all([
      createQuizQuestionPromise,
      hideOldQuizQuestionPromise,
    ]);
    await prisma.quizQuestionRecord.create({
      data: {
        quizQuestionId: quizQuestion.id,
        staffId: userId,
        updateType: "UPDATE",
      },
    });
    const additionResponse = createEditQuizResponse(
      quizData.question_type,
      subpart,
    );
    return new NextResponse(
      JSON.stringify({
        message: "Quiz question updated",
        sub_header: quizQuestion.subheader,
        question_type: quizQuestion.questionType,
        quiz_question_id: quizQuestion.id,
        max_score: quizQuestion.maxScore,
        ...additionResponse,
      }),
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

//get quiz question from story_id
export async function GET(req: NextRequest) {
  try {
    const user = new User();
    const url = new URL(req.url);
    const storyIdParam = url.searchParams.get("story_id");
    const parseResult = checkValidInput([storyIdSchema], [storyIdParam]);
    if (parseResult.nextErrorReponse) {
      return parseResult.nextErrorReponse;
    }
    const [storyId] = parseResult.parsedData;
    const isEditor = await user.isEditor();
    if (!isEditor) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }
    const { quizzes, subparts } = await getQuizzes({ storyId });
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
