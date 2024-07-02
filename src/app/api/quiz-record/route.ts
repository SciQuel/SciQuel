import prisma from "@/lib/prisma";
import { type QuizType } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { checkValidInput } from "../tools/SchemaTool";
import User from "../tools/User";
import { storyIdSchema } from "./schema";

interface QuizRecordI {
  storyId: string;
  maxScore: number;
  quizQuestionIdRemain: string[];
  grades: {
    UserResponseSubpart: {
      id: string;
    };
    maxScore: number;
    totalScore: number;
  }[];
  quizType: QuizType;
  score: number;
  createAt: Date;
}

/**
 * get first quiz record and recent quiz record.
 * If story_id is included, get records base on story_id
 * If story_id is not included, get records base on user attempt
 */
export async function GET(req: NextRequest) {
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

  const { searchParams } = new URL(req.url);

  //get story_id and check type if exist
  const storyIdParam = searchParams.get("story_id");
  let storyId = null;
  if (storyIdParam) {
    const { nextErrorReponse, parsedData } = checkValidInput(
      [storyIdSchema],
      [storyIdParam],
    );
    if (nextErrorReponse) {
      return nextErrorReponse;
    }
    storyId = parsedData[0];
  }
  const quizRecordArg = {
    where: storyId
      ? {
          userId: userId,
          storyId: storyId,
        }
      : {
          userId: userId,
        },
    select: {
      storyId: true,
      quizType: true,
      maxScore: true,
      score: true,
      createAt: true,
      quizQuestionIdRemain: true,
      grades: {
        select: {
          UserResponseSubpart: {
            select: {
              id: true,
            },
          },
          totalScore: true,
          maxScore: true,
        },
      },
    },
  };
  try {
    const firstQuizRecordPromise = prisma.quizRecord.findFirst({
      ...quizRecordArg,
      orderBy: {
        createAt: "asc",
      },
    });
    const mostRecentQuizRecordPromise = prisma.quizRecord.findFirst({
      ...quizRecordArg,
      orderBy: {
        createAt: "desc",
      },
    });
    const [firstQuizRecord, mostRecentQuizRecord] = await Promise.all([
      firstQuizRecordPromise,
      mostRecentQuizRecordPromise,
    ]);
    return new NextResponse(
      JSON.stringify({
        first_quiz_record: createResponseQuizRecord(firstQuizRecord),
        most_recent_quiz: createResponseQuizRecord(mostRecentQuizRecord),
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
function createResponseQuizRecord(quizRecord: QuizRecordI | null) {
  if (!quizRecord) return null;
  const {
    grades,
    createAt,
    storyId,
    score,
    maxScore,
    quizType,
    quizQuestionIdRemain,
  } = quizRecord;
  return {
    story_id: storyId,
    score,
    max_score: maxScore,
    quiz_type: quizType,
    create_at: createAt,
    quiz_question_id_remain: quizQuestionIdRemain,
    grades: grades.map((grade) => {
      const { UserResponseSubpart, maxScore, totalScore } = grade;
      return {
        user_response_id: UserResponseSubpart.id,
        total_score: totalScore,
        max_score: maxScore,
      };
    }),
  };
}
