import { PrismaClient } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function POST(req:NextRequest) {
  try{
    const requestBody = await req.json();
    const{storyId, quizId, response} = requestBody;

    if(!storyId || !quizId || !response){
      return new NextResponse(JSON.stringify({
        error: "Missing required fields"
      }),{
        status: 400,
        headers:{
          "Content-Type" : "application/json",
        },
      });
    }

    const quizQuestion = await prisma.quizQuestion.findUnique({
      where:{
        id:quizId,
      },
    });

    if(!quizQuestion){
      return new NextResponse(JSON.stringify({
        error: "Quiz question not found"
      }),{
        status: 404,
        headers:{
          "Content-Type": "application/json",
        },
      });
    }

    const 

  }
}