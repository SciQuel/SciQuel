/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { userResponseSchema } from "./schema";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();

    const parsedResult = userResponseSchema.safeParse(requestBody);
    if (!parsedResult.success) {
      return new NextResponse(JSON.stringify({ error: parsedResult.error }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // required input
    const { storyId, questionType, userId, quizQuestionId, responseSubparts } =
      requestBody;

    const quizQuestion = await prisma.quizQuestion.findUnique({
      where: { id: quizQuestionId },
      include: { subparts: true },
    });

    if (!quizQuestion) {
      return new NextResponse(
        JSON.stringify({ error: "Quiz question not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    interface ResponseSubpart {
      id: string;
      subpartId: string;
      subpartUserAns: string[];
    }

    // find corresponding subpart
    const gradeSubpart = responseSubparts.map(
      (responseSubpart: ResponseSubpart) => {
        const correspondingSubpart = quizQuestion.subparts.find(
          (subpart) => subpart.id === responseSubpart.subpartId,
        );

        if (!correspondingSubpart || !correspondingSubpart.correctAnswer) {
          return {
            error: "Subpart not found or correctAnswer is undefined",
            subpartId: responseSubpart.subpartId,
          };
        }

        if (!responseSubpart.subpartUserAns) {
          return {
            error: "User response is undefined",
            subpartId: responseSubpart.subpartId,
          };
        }

        function arraysEqual(a: string | any[], b: string | any[]) {
          if (a.length !== b.length) return false;
          for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
          }
          return true;
        }

        const isCorrect = arraysEqual(
          responseSubpart.subpartUserAns,
          correspondingSubpart.correctAnswer,
        );

        return {
          subpartId: responseSubpart.subpartId,
          isCorrect: isCorrect,
          explanation: correspondingSubpart.explanation,
        };
      },
    );

    return new NextResponse(JSON.stringify({ gradeSubpart }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
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
