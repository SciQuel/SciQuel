/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient, type Prisma } from "@prisma/client";
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

    // get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const firstQuizRecord = user.firstQuizRecord || {};
    const mostRecentQuizRecord = user.mostRecentQuizRecord || {};

    // console.log("Existing firstQuizRecord:", firstQuizRecord);
    // console.log("Existing mostRecentQuizRecord:", mostRecentQuizRecord);

      interface ResponseSubpart {
        id: string;
        subpartId: string;
        subpartUserAns: string[];
      }

      // find corresponding subpart
      const gradeResults = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/require-await
        responseSubparts.map(async (responseSubpart: { subpartId: string; subpartUserAns: string[]; }) => {
            const correspondingSubpart = quizQuestion.subparts.find(subpart => subpart.id === responseSubpart.subpartId);
            if (!correspondingSubpart || !correspondingSubpart.correctAnswer) {
                return { error: "Subpart not found or correctAnswer is undefined", subpartId: responseSubpart.subpartId };
            }

            if (!responseSubpart.subpartUserAns) {
                return { error: "User response is undefined", subpartId: responseSubpart.subpartId };
            }

            const isCorrect = JSON.stringify(responseSubpart.subpartUserAns.sort()) === JSON.stringify(correspondingSubpart.correctAnswer.sort());
            return { subpartId: responseSubpart.subpartId, isCorrect: isCorrect, explanation: correspondingSubpart.explanation, userResponses:responseSubpart.subpartUserAns};
        })
    );

    const updatedFirstQuizRecord = user.firstQuizRecord 
  ? (typeof user.firstQuizRecord === 'string' 
    ? JSON.parse(user.firstQuizRecord) 
    : user.firstQuizRecord)
  : {};
const updatedMostRecentQuizRecord = user.mostRecentQuizRecord 
  ? (typeof user.mostRecentQuizRecord === 'string' 
    ? JSON.parse(user.mostRecentQuizRecord) 
    : user.mostRecentQuizRecord)
  : {};

    // console.log("Existing firstQuizRecord:", updatedFirstQuizRecord);
    // console.log("Existing mostRecentQuizRecord:", updatedMostRecentQuizRecord);

    gradeResults.forEach(grade => {
      if (!updatedFirstQuizRecord.hasOwnProperty(grade.subpartId)) {
        updatedFirstQuizRecord[grade.subpartId] = {
          isCorrect: grade.isCorrect,
          userResponses: grade.userResponses,
        };
      }
      updatedMostRecentQuizRecord[grade.subpartId] = {
        isCorrect: grade.isCorrect,
        userResponses: grade.userResponses,
      };
    });
    
    console.log("Updated firstQuizRecord before saving:", updatedFirstQuizRecord);
    console.log("Updated mostRecentQuizRecord before saving:", updatedMostRecentQuizRecord);

    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstQuizRecord: JSON.stringify(updatedFirstQuizRecord),
      mostRecentQuizRecord: JSON.stringify(updatedMostRecentQuizRecord),
      },
    });
    
    //console.log("User after update:", updateUser);
  

    return new NextResponse(JSON.stringify({ gradeSubpart: gradeResults }), {
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

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId) {
    return new NextResponse(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstQuizRecord: true,
        mostRecentQuizRecord: true,
      },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(JSON.stringify({
      firstQuizRecord: user.firstQuizRecord,
      mostRecentQuizRecord: user.mostRecentQuizRecord,
    }), {
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