import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { postTriviaEditSchema } from "./schema";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user.email) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    if (!user.roles.includes("EDITOR")) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const parsedBody = postTriviaEditSchema.safeParse(await req.json());

    if (!parsedBody.success) {
      return NextResponse.json({ error: parsedBody.error }, { status: 400 });
    }

    const { subheader, subpart, story_id, max_score, question_type } =
      parsedBody.data;

    const story = await prisma.story.findUnique({
      where: {
        id: story_id,
      },
    });

    if (!story) {
      return NextResponse.json(
        {
          error: "invalid story id",
        },
        { status: 400 },
      );
    }

    let questionArgs: Prisma.TriviaQuestionCreateArgs = {
      data: {
        subheader: subheader,
        contentCategories: subpart.content_category,
        maxScore: max_score,
        storyId: story_id,
        explanations:
          typeof subpart.explanations == "string"
            ? [subpart.explanations]
            : subpart.explanations,
        questionData: {
          questionType: "MULTIPLE_CHOICE",
          options: [],
          question: "",
          correctAnswer: 0,
        },
      },
    };

    switch (question_type) {
      case "MULTIPLE_CHOICE":
        questionArgs.data.questionData = {
          questionType: "MULTIPLE_CHOICE",
          options: subpart.options,
          question: subpart.question,
          correctAnswer: subpart.correct_answer,
        };
        break;
      case "TRUE_FALSE":
        questionArgs.data.questionData = {
          questionType: "TRUE_FALSE",
          questions: subpart.questions,
          correctAnswer: subpart.correct_answers,
        };
        break;
      case "DIRECT_MATCHING":
        questionArgs.data.questionData = {
          questionType: "DIRECT_MATCHING",
          question: subpart.question,
          categories: subpart.categories,
          options: subpart.options,
          correctAnswer: subpart.correct_answers,
        };
        break;
      case "COMPLEX_MATCHING":
        questionArgs.data.questionData = {
          questionType: "COMPLEX_MATCHING",
          question: subpart.question,
          categories: subpart.categories,
          options: subpart.options,
          correctAnswer: subpart.correct_answers,
        };
        break;
      case "SELECT_ALL":
        questionArgs.data.questionData = {
          questionType: "SELECT_ALL",
          question: subpart.question,
          options: subpart.options,
          correctAnswer: subpart.correct_answers,
        };
        break;
    }

    const newTriviaQ = await prisma.triviaQuestion.create(questionArgs);

    return NextResponse.json({ triviaId: newTriviaQ.id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        error: "internal server error",
      },
      { status: 500 },
    );
  }
}
