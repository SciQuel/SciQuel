/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { checkValidInput } from "@/app/api/tools/SchemaTool";
import { PrismaClient } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { quizQuestionIdSchema } from "../../schema";
import { getSubpart } from "../../tools";

const prisma = new PrismaClient();
interface Params {
  id: unknown;
}
/**
 * give a list of quiz questions from story
 */
export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const quizRecordIdParam = params.id;
    const { parsedData, nextErrorReponse } = checkValidInput(
      [quizQuestionIdSchema],
      [quizRecordIdParam],
    );
    if (nextErrorReponse) {
      return nextErrorReponse;
    }
    const [quizRecordId] = parsedData;
    const quizRecord = await prisma.quizRecord.findFirst({
      where: { id: quizRecordId },
      select: {
        quizQuestionIdRemain: true,
        totalQuestion: true,
        totalCorrectAnswer: true,
      },
    });
    if (!quizRecord) {
      return new NextResponse(
        JSON.stringify({ error: "Story record not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    const quizQuestionArr = await prisma.quizQuestion.findMany({
      where: {
        id: {
          in: quizRecord.quizQuestionIdRemain,
        },
      },
      select: {
        id: true,
        contentCategory: true,
        questionType: true,
        maxScore: true,
        subpartId: true,
        subheader: true,
      },
    });
    const subpartPromises = quizQuestionArr.map((quiz) => getSubpart(quiz));
    const subparts = await Promise.all(subpartPromises);
    const quizResponse = quizQuestionArr.map((quiz, index) => {
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
      JSON.stringify({ quizzes: quizResponse, quiz_record_id: quizRecordId }),
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
