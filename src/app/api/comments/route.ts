/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { createCommentSchema } from "./schema";

//to create a comment
export async function POST(req: NextRequest) {
  try {
    console.log("Received request:", req);
    const requestBody = await req.json();
    console.log("Request body:", requestBody);

    const parsed = createCommentSchema.safeParse(requestBody);
    console.log("Validation result:", parsed);

    if (!parsed.success) {
      console.error("Validation error:", parsed.error);
      return new NextResponse(JSON.stringify({ error: parsed.error }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const commentData = parsed.data;

    const createdComment = await prisma.comment.create({
      data: {
        content: commentData.content,
        quote: commentData.quote,
        parentCommentId: commentData.parentCommentId,
        userId: commentData.userId,
        storyId: commentData.storyId,
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Comment created successfully",
        commentData: createdComment,
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

//to fetch comments by storyId or userId
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const storyId = url.searchParams.get("storyId");
    const userId = url.searchParams.get("userId");

    if (!storyId && !userId) {
      return new NextResponse(
        JSON.stringify({ error: "storyId or userId is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (storyId) {
      const comments = await prisma.comment.findMany({
        where: { storyId: storyId },
        include: {
          replies: true, // Including nested replies in the response
        },
      });

      return new NextResponse(JSON.stringify({ comments }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else if (userId) {
      const comments = await prisma.comment.findMany({
        where: { userId: userId },
        include: {
          replies: true,
        },
      });
      return new NextResponse(JSON.stringify({ comments }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
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
