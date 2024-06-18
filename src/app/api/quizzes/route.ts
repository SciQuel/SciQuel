/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import User from "../tools/User";
import {
  modifiedQuizSchema,
  quizQuestionIdSchema,
  quizTypeSchema,
  storyIdSchema,
} from "./schema";
import { createQuizSubpart, getDeleteSuppart, getSubpart } from "./tools";

/**
 * create quizQuestionRecord for patch and delete
 */

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const user = new User();
    if (!(await user.isEditor())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestBody = await req.json();
    const parsed = modifiedQuizSchema.safeParse(requestBody);
    if (!parsed.success) {
      return new NextResponse(
        JSON.stringify({
          error: parsed.error.errors[0].message,
          errors: parsed.error.errors.map((err) => err.message),
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
    const quizData = parsed.data;
    const CountStoryExist = await prisma.story.count({
      where: { id: quizData.story_id },
    });
    if (CountStoryExist === 0) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
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
    return new NextResponse(
      JSON.stringify({
        message: "Quiz question created",
        quizData: { ...createdQuiz, subpart },
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
    const storyId = url.searchParams.get("story_id");
    const quizType = url.searchParams.get("quiz_type");
    const quizTypeParse = quizTypeSchema.safeParse(quizType);
    const storyIdParse = storyIdSchema.safeParse(storyId);

    const user = new User();

    if (!storyIdParse.success) {
      return new NextResponse(
        JSON.stringify({ error: storyIdParse.error.errors[0].message }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    if (!quizTypeParse.success) {
      return new NextResponse(
        JSON.stringify({ error: quizTypeParse.error.errors[0].message }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // const session = user.getSession();
    // if (!session) {
    //   return new NextResponse(
    //     JSON.stringify({ error: "Authentication is required" }),
    //     {
    //       status: 400,
    //       headers: { "Content-Type": "application/json" },
    //     },
    //   );
    // }
    const userId = await user.getUserId();
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "user not found" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const quizzes = await prisma.quizQuestion.findMany({
      where: { storyId: storyIdParse.data, deleted: false },
      select: {
        id: true,
        contentCategory: true,
        questionType: true,
        maxScore: true,
        subpartId: true,
        subheader: true,
      },
    });
    if (quizzes.length == 0) {
      return new NextResponse(
        JSON.stringify({ quizzes: [], quiz_record_id: "" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    //get subpart
    const subpartPromises = quizzes.map((quiz) => getSubpart(quiz));
    const subparts = await Promise.all(subpartPromises);
    const quizRecord = await prisma.quizRecord.create({
      data: {
        storyId: storyIdParse.data,
        userId: userId,
        maxScore: quizzes.reduce((sum, quiz) => sum + quiz.maxScore, 0),
        totalQuestion: quizzes.length,
        totalCorrectAnswer: 0,
        score: 0,
        quizType: quizTypeParse.data,
        quizQuestionIdRemain: quizzes.map((quiz) => quiz.id),
      },
    });
    const quizResponse = quizzes.map((quiz, index) => {
      const { subheader, questionType, id, maxScore, contentCategory } = quiz;
      return {
        sub_header: subheader,
        question_type: questionType,
        quiz_question_id: id,
        max_score: maxScore,
        content_category: contentCategory,
        ...subparts[index],
      };
    });
    return new NextResponse(
      JSON.stringify({ quizzes: quizResponse, quiz_record_id: quizRecord.id }),
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
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const quizQuestionId = url.searchParams.get("quiz_question_id");
    const quizQuestionIdParse = quizQuestionIdSchema.safeParse(quizQuestionId);
    const user = new User();
    if (!quizQuestionIdParse.success) {
      return new NextResponse(
        JSON.stringify({ error: quizQuestionIdParse.error.errors[0].message }),
        {
          status: 400,
        },
      );
    }

    if (!(await user.isEditor())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quizQuestionCheck = await prisma.quizQuestion.findUnique({
      where: { id: quizQuestionIdParse.data },
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
      where: { id: quizQuestionIdParse.data },
      data: { deleted: true },
    });

    await Promise.all([quizQuestionDeletePromise]);

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

export async function PATCH(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const quizQuestionId = url.searchParams.get("quiz_question_id");
    const quizQuestionIdParse = quizQuestionIdSchema.safeParse(quizQuestionId);
    const user = new User();
    const userId = await user.getUserId();
    if (!quizQuestionIdParse.success) {
      return new NextResponse(
        JSON.stringify({ error: quizQuestionIdParse.error.errors[0].message }),
        {
          status: 400,
        },
      );
    }

    if (!user.isEditor() || !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestBody = await req.json();
    const parsed = modifiedQuizSchema.safeParse(requestBody);

    if (!parsed.success) {
      return new NextResponse(JSON.stringify({ error: parsed.error }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    const quizData = parsed.data;

    const quizQuestionCheck = await prisma.quizQuestion.findUnique({
      where: { id: quizQuestionIdParse.data },
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
      question_type: quizQuestionCheck.questionType,
      subpartData: quizData.subpart,
    });
    const subpart = await subpartPromise;

    if (errorMessage) {
      return NextResponse.json(
        { error: errorMessage, errors },
        { status: 400 },
      );
    }
    const createQuizQuestionPromise = prisma.quizQuestion.create({
      data: {
        storyId: quizData.story_id,
        contentCategory: quizData.content_category,
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
        id: quizQuestionIdParse.data,
      },
    });
    const [quizQuestion] = await Promise.all([
      createQuizQuestionPromise,
      hideOldQuizQuestionPromise,
    ]);
    prisma.quizQuestionRecord.create({
      data: {
        quizQuestionId: quizQuestion.id,
        staffId: userId,
        updateType: "UPDATE",
      },
    });
    return new NextResponse(
      JSON.stringify({
        message: "Quiz question updated",
        quizData: { ...quizQuestion, subpart },
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
