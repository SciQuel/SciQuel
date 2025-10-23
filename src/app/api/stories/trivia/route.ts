import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { AllQuestionResponses } from "./resTypes";
import { getTriviaSchema } from "./schema";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsedParams = getTriviaSchema.safeParse(
    Object.fromEntries(searchParams),
  );

  if (!parsedParams.success) {
    return NextResponse.json(parsedParams.error, { status: 400 });
  }

  const { story_id } = parsedParams.data;

  try {
    const currentTrivia = await prisma.triviaQuestion.findMany({
      where: {
        storyId: story_id,
      },
    });

    const finalTriviaList: AllQuestionResponses[] = [];

    currentTrivia.forEach((question) => {
      switch (question.questionData.questionType) {
        case "MULTIPLE_CHOICE":
          finalTriviaList.push({
            quiz_question_id: question.id,
            sub_header: question.subheader,
            question: question.questionData.question,
            max_score: question.maxScore,
            options: question.questionData.options,
            question_type: "MULTIPLE_CHOICE",
            content_category: question.contentCategories,
          });
          break;
        case "TRUE_FALSE":
          finalTriviaList.push({
            question_type: "TRUE_FALSE",
            content_category: question.contentCategories,
            max_score: question.maxScore,
            questions: question.questionData.questions,
            quiz_question_id: question.id,
            sub_header: question.subheader,
          });
          break;
        case "DIRECT_MATCHING":
          finalTriviaList.push({
            question_type: "DIRECT_MATCHING",
            sub_header: question.subheader,
            quiz_question_id: question.id,
            max_score: question.maxScore,
            categories: question.questionData.categories,
            question: question.questionData.question,
            options: question.questionData.options,
            content_category: question.contentCategories,
          });
          break;
        case "COMPLEX_MATCHING":
          finalTriviaList.push({
            question_type: "COMPLEX_MATCHING",
            quiz_question_id: question.id,
            question: question.questionData.question,
            categories: question.questionData.categories,
            sub_header: question.subheader,
            options: question.questionData.options,
            max_score: question.maxScore,
            content_category: question.contentCategories,
          });
          break;
        case "SELECT_ALL":
          finalTriviaList.push({
            question_type: "SELECT_ALL",
            quiz_question_id: question.id,
            sub_header: question.subheader,
            content_category: question.contentCategories,
            max_score: question.maxScore,
            options: question.questionData.options,
            question: question.questionData.question,
          });
      }
    });

    return NextResponse.json({ quizzes: finalTriviaList });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
